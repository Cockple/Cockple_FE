// ─────────────────────────────────────────────────────────────

import type { ChatMessageResponse } from "../types/chat";
import ProfileImg from "../assets/images/profile_Image.png";
import { useMemo, useState } from "react";

// Mock 메시지 생성기
const makeMockMessages = (
  total: number,
  currentUserId: number,
): ChatMessageResponse[] => {
  const arr: ChatMessageResponse[] = [];
  const now = Date.now();
  for (let i = 1; i <= total; i++) {
    const ts = new Date(now - (total - i) * 1000 * 60 * 5).toISOString(); // 5분 간격
    const isMe = i % 3 === 0; // 임의로 내가 보낸 메시지
    arr.push({
      messageId: i,
      senderId: isMe ? currentUserId : 999,
      senderName: isMe ? "나" : "상대",
      senderProfileImage: isMe ? ProfileImg : ProfileImg,
      content: `테스트 메시지 #${i}`,
      messageType: "TEXT",
      imgUrls: [],
      timestamp: ts,
      isMyMessage: isMe,
    });
  }
  return arr;
};

// 시간 오름차순 정렬
const sortAsc = (arr: ChatMessageResponse[]) =>
  [...arr].sort((a, b) => a.messageId - b.messageId);

// 메시지 중복 제거
const uniqueById = (arr: ChatMessageResponse[]) => {
  const seen = new Set<number>();
  return arr.filter(m => {
    if (seen.has(m.messageId)) return false;
    seen.add(m.messageId);
    return true;
  });
};

// ─────────────────────────────────────────────────────────────
// useMockChatInfinite: 실제 훅과 동일한 인터페이스로 동작
export const useMockChatInfinite = (currentUserId: number) => {
  const PAGE_SIZE = 30;
  const [all] = useState<ChatMessageResponse[]>(() =>
    sortAsc(makeMockMessages(150, currentUserId)),
  );
  const [loadedCount, setLoadedCount] = useState<number>(PAGE_SIZE); // 초기엔 최근 N개 노출
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // initial: 채팅방 정보 + 초기 메시지(최근 N개)
  const initial = useMemo(() => {
    const msgs = all.slice(-loadedCount);
    return {
      chatRoomInfo: {
        lastReadMessageId: msgs.length
          ? msgs[msgs.length - 1].messageId - 5
          : null, // 대충 이전에 5개 덜 읽은 상태로
        participants: [{ id: currentUserId, name: "나" }],
      },
      messages: msgs,
    };
  }, [all, loadedCount, currentUserId]);

  // 이전 페이지(과거) 로드 가능 여부
  const hasNextPage = loadedCount < all.length;

  // fetchNextPage: 위로 스크롤 시 과거 N개 더 붙이기
  const fetchNextPage = async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    setIsFetchingNextPage(true);
    // 네트워크 지연 흉내
    await new Promise(r => setTimeout(r, 400));
    setLoadedCount(prev => Math.min(prev + PAGE_SIZE, all.length));
    setIsFetchingNextPage(false);
  };

  // 합쳐서 시간 오름차순 + 중복 제거
  const messages = useMemo(
    () => uniqueById(sortAsc(initial.messages)),
    [initial.messages],
  );

  return {
    initial,
    messages,
    status: "success" as const,
    initLoading: false,
    initError: null as unknown as Error | null,
    isEmpty: messages.length === 0,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetchInitial: async () => {}, // 필요 시 확장
  };
};
// ─────────────────────────────────────────────────────────────
