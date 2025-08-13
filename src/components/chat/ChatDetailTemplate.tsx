// 그룹 채팅창과 개인 채팅창에 사용되는 공통 컴포넌트(템플릿)

import React, { useState, useEffect, useRef } from "react";
import ChattingComponent from "../common/chat/ChattingComponent";
import ImagePreviewModal from "./ImagePreviewModal";
import ChatBtn from "../common/DynamicBtn/ChatBtn";
import ProfileImg from "../../assets/images/Profile_Image.png";
import BottomChatInput from "../common/chat/BottomChatInput";
import { PageHeader } from "../common/system/header/PageHeader";
import ChatDateSeparator from "./ChatDataSeperator";
import { formatTime } from "../../utils/formatDate";

import { useNavigate } from "react-router-dom";
import { useChatInfinite } from "../../hooks/useChatInfinite";
import { useChatRead } from "../../hooks/useChatRead";

import { subscribeRoom, unsubscribeRoom } from "../../api/chat/rawWs";
import { useRawWsConnect } from "../../hooks/useRawWsConnect";

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
  const currentUserId = 1; // 실제 로그인 사용자 ID로 대체!!!!!!!!!!!!!!

  // ==== 무한 스크롤 데이터 ====
  const {
    //initial, //ChatRoomInfo, Participants 등
    messages, // 렌더용 편탄화 메시지(오름차순)
    initLoading,
    initError,
    isEmpty,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetchInitial,
  } = useChatInfinite(chatId);
  //USE_MOCK ? mock : real;
  // ===== 읽음 처리: 진입/포커스 시 자동 전송(현재 mock, 나중에 rest/ws로 변경) =====
  const { markReadNow } = useChatRead({
    roomId: Number(chatId),
    messages,
    mode: "mock", // ← 백엔드 URL 확정되면 "rest"로 교체
    // wsSendFn: payload => stompClient.publish({...}) 형태로 주입 가능
    //   // TODO(WS): sendReadWS(chatId, payload) 등으로 연결
    //   return { lastReadMessageId: payload.lastReadMessageId };
    // },
  });

  // 방 입장: 단일 구독
  useEffect(() => {
    subscribeRoom(chatId);
    return () => {
      // 방 퇴장: 해제 (리스트 화면에서 다시 여러 방 구독함)
      unsubscribeRoom(chatId);
    };
  }, [chatId]);

  // ===== 로컬 상태 ====
  //const [chattings, setChattings] = useState<ChatMessageResponse[]>([]);
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ==== Refs ====
  const fileInputRef = useRef<HTMLInputElement>(null!);
  //const chatEndRef = useRef<HTMLDivElement>(null);
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

  //======== SEND ==================
  // 전역 소켓 연결로부터 send 함수 받기
  const memberId = Number(localStorage.getItem("memberId") || 1);
  const { send } = useRawWsConnect({
    memberId,
    origin: "https://cockple.store",
  });

  // 메시지 전송(WS 경로 확정 전까지는 스크롤만)
  const handleSendMessage = () => {
    const text = input.trim();
    if (!text) return;

    // 1) 서버로 전송 (스펙: JSON string)
    const ok = send(chatId, text); // 또는 sendChatWS(chatId, text);

    // 2) 입력 초기화 + 스크롤
    setInput("");

    // (선택) 실패 시 사용자 안내
    if (!ok) {
      console.warn("WS 미연결로 전송 실패");
      // TODO: 토스트/스낵바 등 사용자 피드백
    }

    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
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

  // 채팅창 날짜 표시
  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${year}.${month}.${day} (${weekday})`;
  };

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

            {messages.map((chat, idx) => {
              const prev = idx > 0 ? messages[idx - 1] : undefined;
              const onlyDate = (s: string) =>
                new Date(s).toISOString().split("T")[0];
              const showDate =
                !prev || onlyDate(chat.timestamp) !== onlyDate(prev.timestamp);

              return (
                <React.Fragment key={chat.messageId}>
                  {showDate && (
                    <ChatDateSeparator date={formatDateLabel(chat.timestamp)} />
                  )}
                  <ChattingComponent
                    message={chat}
                    isMe={chat.senderId === currentUserId}
                    onImageClick={setPreviewImage}
                    time={formatTime(chat.timestamp)}
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

            {/* <div className="h-5" ref={chatEndRef}></div> */}
          </div>
        )}

        {previewImage && (
          <ImagePreviewModal
            imageUrl={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}
      </div>
      {/* 입력창(지금은 WS 전송 미구현) */}
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
