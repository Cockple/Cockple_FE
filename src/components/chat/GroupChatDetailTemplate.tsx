// 그룹 채팅창 템플릿: ChatDetailTemplate와 동일한 구조/흐름으로 정리

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChattingComponent from "../common/chat/ChattingComponent";
import ImagePreviewModal from "./ImagePreviewModal";
import ChatBtn from "../common/DynamicBtn/ChatBtn";
import ProfileImg from "../../assets/images/Profile_Image.png";
import BottomChatInput from "../common/chat/BottomChatInput";
import { PageHeader } from "../common/system/header/PageHeader";
import ChatDateSeparator from "./ChatDataSeperator";
import { formatTime } from "../../utils/formatDate";

// 데이터 훅
import { useChatInfinite } from "../../hooks/useChatInfinite";
import { useMockChatInfinite } from "../../hooks/useMockChatInfinite";
import { useChatRead } from "../../hooks/useChatRead";

// WS 연결(원시 WebSocket 전용 훅)
import { useRawWsConnect } from "../../hooks/useRawWsConnect";

// ─────────────────────────────────────────────────────────────
// Mock/Real 스위치: 개발 중엔 true로 목업 스택 점검 가능
const USE_MOCK = false;
// ─────────────────────────────────────────────────────────────

const CenterBox: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex-1 flex items-center justify-center py-8 text-gy-700">
    {children}
  </div>
);

interface GroupChatDetailTemplateProps {
  chatId: number; // 방 ID
  chatName: string; // 상단 타이틀
  onBack: () => void; // 뒤로가기
  partyId?: number; // "모임 홈으로" 이동 시 필요
  showHomeButton?: boolean; // 상단 고정 버튼 표시 여부
}

export const GroupChatDetailTemplate: React.FC<
  GroupChatDetailTemplateProps
> = ({ chatId, chatName, onBack, partyId, showHomeButton = false }) => {
  const navigate = useNavigate();

  // 로그인 사용자(실서비스에선 전역 상태나 토큰 파싱으로 주입)
  const currentUserId = Number(localStorage.getItem("memberId") || 1);

  // ===== 무한 스크롤 데이터 (real/mock 공존 호출 후 선택) =====
  const real = useChatInfinite(chatId);
  const mock = useMockChatInfinite(chatId);

  const {
    messages, // 정렬된 평탄화(오름차순)
    initLoading,
    initError,
    isEmpty,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetchInitial,
  } = USE_MOCK ? mock : real;

  // ===== 읽음 처리: 진입/스크롤 하단 도달 시 =====
  const { markReadNow } = useChatRead({
    roomId: chatId,
    messages,
    mode: "mock", // TODO: 백엔드 REST/WS 경로 확정 시 "rest" 또는 wsSendFn 적용
  });

  // ===== WebSocket 연결 상태 뱃지 =====
  const { status: wsStatus, isOpen: wsOpen } = useRawWsConnect({
    memberId: currentUserId,
    origin: "https://cockple.store", // 필요 시 고정
  });

  // ===== 입력/프리뷰 상태 =====
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ===== 스크롤 요소 =====
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  // 초기 로드시 맨 아래로 이동
  useEffect(() => {
    if (!initLoading && messages.length) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [initLoading, messages.length]);

  // 상단 센티넬 → 과거 로드
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
            requestAnimationFrame(() => {
              const newHeight = root.scrollHeight;
              const delta = newHeight - prevHeight;
              root.scrollTop = root.scrollTop + delta; // 점프 방지
            });
          });
        }
      },
      { root, threshold: 0.1 },
    );

    io.observe(target);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 하단 근처 도달 시 읽음 처리
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

  // 메시지 전송 (WS publish 경로 확정 전까지는 입력 리셋 + 스크롤만)
  const handleSendMessage = () => {
    if (!input.trim()) return;

    // TODO(WS): destination 확정되면 publish 로직 연결
    setInput("");
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    );
    console.log("[SEND:pending WS]", input.trim());
  };

  // 이미지 업로드(미연결: 로컬 프리뷰만)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setPreviewImage(fileUrl);
    e.target.value = "";
  };

  // 날짜 라벨(YYYY.MM.DD (요일))
  const formatDateLabel = (dateString: string) => {
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    return `${year}.${month}.${day} (${weekday})`;
  };

  if (initError) {
    return (
      <div className="relative flex flex-col min-h-[100dvh] -mb-8 -mt-14 pt-14 -mx-4">
        <PageHeader title={chatName} onBackClick={onBack} />
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
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-[100dvh] -mb-8 -mt-14 pt-14 -mx-4">
      {/* 상단 헤더 */}
      <PageHeader title={chatName} onBackClick={onBack} />

      {/* WS 연결 상태 뱃지 */}
      <div className="absolute top-14 right-4 text-xs">
        {wsOpen ? (
          <span className="rounded-md bg-gr-100 text-gr-800 px-2 py-1">
            WS 연결됨
          </span>
        ) : (
          <span className="rounded-md bg-gy-200 text-gy-700 px-2 py-1">
            {wsStatus === "connecting" ? "WS 연결 중…" : wsStatus.toUpperCase()}
          </span>
        )}
      </div>

      {/* 스크롤 영역 */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden bg-gr-200"
      >
        {/* 상단 고정 “모임 홈으로” 버튼 (선택) */}
        {showHomeButton && (
          <div className="fixed top-[4.25rem] left-1/2 -translate-x-1/2 z-10 mt-2">
            <ChatBtn
              imgSrc={ProfileImg}
              onClick={() => {
                if (partyId) navigate(`/group/${partyId}`);
              }}
            >
              모임 홈으로
            </ChatBtn>
          </div>
        )}

        {/* 상태 UI */}
        {initLoading && <CenterBox>불러오는 중…</CenterBox>}
        {isEmpty && !initLoading && (
          <CenterBox>아직 메시지가 없습니다</CenterBox>
        )}

        {/* 메시지 리스트 */}
        {!initLoading && !isEmpty && (
          <div className="flex flex-col gap-5 shrink-0 p-4">
            {/* 위쪽 센티넬: 과거 페이지 로드 트리거 */}
            <div ref={topSentinelRef} />

            {messages.map((chat, idx) => {
              const prev = idx > 0 ? messages[idx - 1] : undefined;
              const dateOnly = (s: string) =>
                new Date(s).toISOString().split("T")[0];
              const showDate =
                !prev || dateOnly(chat.timestamp) !== dateOnly(prev.timestamp);

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
          </div>
        )}

        {/* 이미지 프리뷰 모달 */}
        {previewImage && (
          <ImagePreviewModal
            imageUrl={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}
      </div>

      {/* 하단 입력창 */}
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
