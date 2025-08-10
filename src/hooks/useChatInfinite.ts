//무한 스크롤 훅
//위로 스크롤 올릴 때 자동으로 더 불러오도록
//IntersectionObserver + useInfiniteQuery
import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchChatMessages,
  fetchPreviousMessages,
} from "../api/chat/chattingMessage";
import type { ChatMessageResponse } from "../types/chat";

// 메시지를 시간 오름차순으로 정렬
const flattenAscending = (pages: ChatMessageResponse[][]) =>
  pages.flat().sort((a, b) => a.messageId - b.messageId);

// messageId 기준 중복 제거 (서버 cursor inclusive여도 안전)
const uniqueByMessageId = (items: ChatMessageResponse[]) => {
  const seen = new Set<number>();
  return items.filter(m => {
    if (seen.has(m.messageId)) return false;
    seen.add(m.messageId);
    return true;
  });
};

export const useChatInfinite = (roomId: string) => {
  // 1) 초기 윈도우(현재 메시지 묶음)
  const {
    data: initial,
    isLoading: initLoading,
    error: initError,
    refetch: refetchInitial,
  } = useQuery({
    queryKey: ["chat", roomId, "initial"],
    queryFn: () => fetchChatMessages(roomId),
    staleTime: 0,
  });

  // 서버 스펙: cursor = 마지막으로 읽은 메시지 ID (과거를 더 가져오기 위한 기준)
  const lastRead = initial?.chatRoomInfo?.lastReadMessageId ?? null;

  // 초기 화면에 표시된 것들 중 가장 오래된 메시지 ID(안전하게 min으로 계산)
  const oldestVisible =
    initial?.messages && initial.messages.length > 0
      ? Math.min(...initial.messages.map(m => m.messageId))
      : null;

  // 최종 초기 커서
  // 우선순위: lastRead -> oldestVisible -> undefined(비활성화)
  const initialCursor = lastRead ?? oldestVisible ?? undefined;

  // 2) 이전 페이지 무한 스크롤
  const {
    data,
    fetchNextPage, // 과거 더 불러오기
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["chat", roomId, "previous"],
    enabled: initialCursor !== undefined, // 커서 없으면 비활성화
    queryFn: ({ pageParam }) =>
      fetchPreviousMessages({
        roomId,
        cursor: pageParam as number, // nextCursor 또는 첫 커서
        size: 50,
      }),
    initialPageParam: initialCursor as number,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });

  // 3) 화면에 뿌릴 최종 메시지 (initial + previous pages)
  const messages = useMemo(() => {
    const prevPages = data?.pages?.map(p => p.messages) ?? [];
    // previous는 "과거 묶음"들이라 initial보다 더 과거 메시지.
    // 합쳐서 시간 오름차순 정렬 → messageId로 중복 제거
    const merged = flattenAscending([...prevPages, initial?.messages ?? []]);
    return uniqueByMessageId(merged);
  }, [data?.pages, initial?.messages]);

  // 빈 상태 여부
  const isEmpty = !initLoading && !initError && messages.length === 0;

  return {
    initial, // ChatRoomInfo, Participants 등
    messages, // 오름차순 + 중복 제거 결과
    status,
    initLoading,
    initError,
    isEmpty,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetchInitial, // 에러/빈 상태에서 재시도 버튼용
  };
};
