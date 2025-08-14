// 그룹 채팅창과 개인 채팅창에 사용되는 공통 컴포넌트(템플릿)

import React, { useState, useEffect, useRef, useMemo } from "react";
import ChattingComponent from "../common/chat/ChattingComponent";
import ImagePreviewModal from "./ImagePreviewModal";
import ChatBtn from "../common/DynamicBtn/ChatBtn";
import ProfileImg from "../../assets/images/Profile_Image.png";
import BottomChatInput from "../common/chat/BottomChatInput";
import { PageHeader } from "../common/system/header/PageHeader";
import ChatDateSeparator from "./ChatDataSeperator";
//import { formatTime } from "../../utils/formatDate";

import { useNavigate } from "react-router-dom";
import { useChatInfinite } from "../../hooks/useChatInfinite";
import { useChatRead } from "../../hooks/useChatRead";

import { subscribeRoom, unsubscribeRoom } from "../../api/chat/rawWs";
import { useRawWsConnect } from "../../hooks/useRawWsConnect";
import type { ChatMessageResponse } from "../../types/chat";
import { formatDateWithDay, formatEnLowerAmPm } from "../../utils/time";

// 간단 빈 상태/에러/로딩 UI
const CenterBox: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex-1 flex items-center justify-center py-8 text-gy-700">
    {children}
  </div>
);

interface ChatDetailTemplateProps {
  chatId: number;
  chatName: string;
  chatType: "group" | "personal";
  //chatData: Record<string, ChatMessageResponse[]>;
  onBack: () => void;
  showHomeButton?: boolean;
  partyId?: number;
}

export const ChatDetailTemplate = ({
  chatId,
  chatName,
  //chatData,
  onBack,
  showHomeButton = false,
  partyId,
}: ChatDetailTemplateProps) => {
  const navigate = useNavigate();

  // 실제 로그인 사용자 정보로 대체
  const currentUserId = Number(localStorage.getItem("memberId") || 1);
  const currentUserName = localStorage.getItem("memberName") || "나";

  // ==== 무한 스크롤 데이터 ====
  const {
    messages, // 오름차순
    initLoading,
    initError,
    isEmpty,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetchInitial,
  } = useChatInfinite(chatId);

  // ===== 읽음 처리 =====
  const { markReadNow } = useChatRead({
    roomId: Number(chatId),
    messages,
    mode: "mock", // ← 백엔드 URL 확정되면 "rest"로 교체
    // wsSendFn: payload => stompClient.publish({...}) 형태로 주입 가능
    //   // TODO(WS): sendReadWS(chatId, payload) 등으로 연결
    //   return { lastReadMessageId: payload.lastReadMessageId };
    // },
  });

  // 방 입장/퇴장: 단일 구독 유지
  useEffect(() => {
    subscribeRoom(chatId);
    return () => {
      // 방 퇴장: 해제 (리스트 화면에서 다시 여러 방 구독함)
      unsubscribeRoom(chatId);
    };
  }, [chatId]);

  // ===== 로컬 상태 ====
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  //🌟낙관적/실시간 메시지 보관
  const [liveMsgs, setLiveMsgs] = useState<ChatMessageResponse[]>([]);

  // ==== Refs ====
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 초기 로드시 맨 아래로
  useEffect(() => {
    if (!initLoading && messages.length) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [initLoading, messages.length]);

  // 위쪽 센티넬 교차 관찰 → 과거 페이지 로드
  useEffect(() => {
    const root = scrollAreaRef.current;
    const target = topSentinelRef.current;
    if (!root || !target || !hasNextPage) return;

    const io = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          const prevHeight = root.scrollHeight;
          fetchNextPage().then(() => {
            // prepend 후 스크롤 점프 방지
            requestAnimationFrame(() => {
              const newHeight = root.scrollHeight;
              const delta = newHeight - prevHeight;
              root.scrollTop = root.scrollTop + delta;
            });
          });
        }
      },
      { root, threshold: 0.1 },
    );

    io.observe(target);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 하단 근처 도달 시 자동 읽음 처리(목업)
  useEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;

    const onScroll = () => {
      const nearBottom =
        root.scrollHeight - root.scrollTop - root.clientHeight < 60;
      if (nearBottom) markReadNow();
    };

    root.addEventListener("scroll", onScroll);
    return () => root.removeEventListener("scroll", onScroll);
  }, [markReadNow]);

  //===== WS 연결 및 전송 =====
  //🌟
  const { send, lastMessage } = useRawWsConnect({
    memberId: currentUserId,
    origin: "https://cockple.store",
  });

  const rendered = useMemo(() => {
    // messages가 오름차순이므로 live는 뒤에 붙인다.
    // 정렬이 필요하면 여기에서 정렬.
    return [...messages, ...liveMsgs];
  }, [messages, liveMsgs]);

  // 전송 (낙관적 추가 + 실패 롤백)
  const handleSendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const tempId = -Date.now(); // 임시 음수 id
    const optimistic: ChatMessageResponse = {
      messageId: tempId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderProfileImage: "",
      content: text,
      messageType: "TEXT",
      imgUrls: [],
      timestamp: new Date().toISOString(),
      isMyMessage: true,
    };

    // 1) 즉시 화면 반영
    setLiveMsgs(prev => [...prev, optimistic]);

    // 2) 서버로 SEND
    const ok = send(chatId, text); // 또는 sendChatWS(chatId, text);
    // 실패 시 사용자 안내
    if (!ok) {
      console.warn("WS 미연결로 전송 실패");
      // TODO: 토스트/스낵바 등 사용자 피드백
      // 전송 실패 시 롤백(선택)
      setLiveMsgs(prev => prev.filter(m => m.messageId !== tempId));
      return;
    }

    // 3) 입력 초기화 + 스크롤
    setInput("");
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    );
    console.log(
      "handleSendMessage: ",
      liveMsgs.map(m => m.timestamp),
    );
    console.log("메시지 전송:", text);
  };

  // 이미지 업로드(미연결 - 로컬 프리뷰만)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setPreviewImage(fileUrl);

    // 초기화
    e.target.value = "";
  };

  useEffect(() => {
    if (!lastMessage || lastMessage.type !== "SEND") return;
    if (lastMessage.chatRoomId !== chatId) return;

    const incoming: ChatMessageResponse = {
      messageId: lastMessage.messageId ?? Date.now(),
      senderId: lastMessage.senderId ?? 0,
      senderName: lastMessage.senderName ?? "",
      senderProfileImage: lastMessage.senderProfileImage ?? "",
      content: lastMessage.content ?? "",
      messageType: "TEXT",
      imgUrls: [],
      //🌟
      //timestamp: lastMessage.createdAt ?? new Date().toISOString(),
      timestamp: lastMessage.timestamp ?? "",
      isMyMessage: (lastMessage.senderId ?? 0) === currentUserId,
    };

    // 내 임시와 동일하면 교체(에코가 올 경우)
    setLiveMsgs(prev => {
      const idx = prev.findIndex(
        m =>
          m.messageId < 0 &&
          m.isMyMessage &&
          m.content === incoming.content &&
          Math.abs(+new Date(m.timestamp) - +new Date(incoming.timestamp)) <
            5000,
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = incoming;
        return copy;
      }
      // 상대 메시지면 추가
      return [...prev, incoming];
    });

    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    );
  }, [lastMessage, chatId, currentUserId]);

  //🌟
  // 채팅창 날짜 표시
  // const formatDateLabel = (dateString: string) => {
  //   //const date = new Date(dateString);
  //   const date = toDate(dateString);
  //   const year = date.getFullYear();
  //   const month = ("0" + (date.getMonth() + 1)).slice(-2);
  //   const day = ("0" + date.getDate()).slice(-2);
  //   const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  //   return `${year}.${month}.${day} (${weekday})`;
  // };
  //const DateSeperator = (dateString: string) => KSTDate(dateString);

  if (initError) return <div className="p-6">메시지 불러오기 실패</div>;

  return (
    <div className="relative flex flex-col min-h-[100dvh] -mb-8 -mt-14 pt-14 -mx-4">
      {/* 헤더 */}
      <PageHeader title={chatName} onBackClick={onBack} />

      {/* 스크롤 영역 */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden bg-gr-200"
      >
        {/* 상단 고정 버튼 */}
        {showHomeButton && (
          <div className="fixed top-[4.25rem] left-1/2 -translate-x-1/2 z-10 mt-2">
            <ChatBtn
              imgSrc={ProfileImg}
              onClick={() => {
                navigate(`/group/${partyId}`);
                console.log(`/group/${partyId}로 이동`);
              }}
            >
              모임 홈으로
            </ChatBtn>
          </div>
        )}

        {/* 상태 UI */}
        {initLoading && <CenterBox>불러오는 중…</CenterBox>}
        {initError && (
          <CenterBox>
            <div className="flex flex-col items-center gap-3">
              <div>메시지 불러오기 실패</div>
              <button
                className="px-3 py-1 rounded-lg border border-gy-300"
                onClick={() => refetchInitial()}
              >
                다시 시도
              </button>
            </div>
          </CenterBox>
        )}
        {isEmpty && <CenterBox>아직 메시지가 없습니다</CenterBox>}

        {/* 메시지 리스트 */}
        {!initLoading && !initError && !isEmpty && (
          <div className="flex flex-col gap-5 shrink-0 p-4">
            {/* 위쪽 센티넬: 과거 불러오기 트리거 */}
            <div ref={topSentinelRef} />

            {rendered.map((chat, idx) => {
              const prev = idx > 0 ? rendered[idx - 1] : undefined;
              //🌟
              // const onlyDate = (s: string) =>
              //   new Date(s).toISOString().split("T")[0];
              //const onlyDate = (s: string) => s;
              // const showDate =
              //   !prev || onlyDate(chat.timestamp) !== onlyDate(prev.timestamp);
              const showDate =
                !prev ||
                formatDateWithDay(chat.timestamp) !==
                  formatDateWithDay(prev.timestamp);
              return (
                <React.Fragment key={chat.messageId}>
                  {showDate && (
                    <ChatDateSeparator
                      date={formatDateWithDay(chat.timestamp)}
                    />
                  )}
                  <ChattingComponent
                    message={chat}
                    isMe={chat.senderId === currentUserId}
                    onImageClick={setPreviewImage}
                    time={formatEnLowerAmPm(chat.timestamp)}
                  />
                </React.Fragment>
              );
            })}

            {isFetchingNextPage && (
              <div className="text-center text-gy-600 text-sm">
                이전 메시지 불러오는 중…
              </div>
            )}

            {/* 하단 앵커 */}
            <div className="h-5" ref={bottomRef} />
          </div>
        )}

        {previewImage && (
          <ImagePreviewModal
            imageUrl={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}
      </div>
      {/* 입력창 */}
      <div className="sticky bottom-0">
        <BottomChatInput
          input={input}
          isComposing={isComposing}
          onInputChange={setInput}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={e => {
            setIsComposing(false);
            setInput(e.currentTarget.value);
          }}
          onSendMessage={handleSendMessage}
          onImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
        />
      </div>
    </div>
  );
};
