import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChatMessageResponse } from "../types/chat";
import {
  createChatReadSender,
  type ChatReadMode,
  type ReadPayload,
} from "../api/chat/readSender";

type Params = {
  roomId: number;
  messages?: ChatMessageResponse[]; //최신 ID 계산용
  mode?: ChatReadMode; // "mock" | "rest" | "ws"
  wsSendFn?: (p: ReadPayload) => Promise<{ lastReadMessageId?: number }>; // WS 전용
};

// 캐시에 들어있는 최소 형태만 정의 (확장 가능)
type ChatInitialCache = {
  chatRoomInfo?: {
    lastReadMessageId?: number | null;
    // 다른 필드가 있어도 깨지지 않도록 선택형으로 둠
  };
  // 필요한 경우 나머지 필드도 여기에 추가
};

export const useChatRead = ({
  roomId,
  messages = [],
  mode = "mock", // 지금은 mock으로 동작 → URL 확정되면 "rest"로 변경
  wsSendFn,
}: Params) => {
  const qc = useQueryClient();
  const [lastReadId, setLastReadId] = useState<number | null>(null);
  const sender = createChatReadSender(mode, wsSendFn);

  const getLatestMessageId = useCallback(() => {
    if (!messages.length) return undefined;
    //오름차순 가정
    return messages[messages.length - 1].messageId;
  }, [messages]);

  // 포커스 스팸 방지
  const lastSentAtRef = useRef(0);
  const COOLDOWN_MS = 1500;

  const { mutate: sendRead, isPending } = useMutation({
    mutationKey: ["chat", roomId, "read-all"],
    mutationFn: async () => {
      const payload: ReadPayload = {
        chatRoomId: roomId,
        lastReadMessageId: getLatestMessageId(),
        readAt: new Date().toISOString(),
      };
      return sender.send(payload);
    },
    onSuccess: data => {
      const effective = data?.lastReadMessageId ?? getLatestMessageId() ?? null;
      setLastReadId(effective);

      // React Query 캐시에 lastReadMessageId 반영
      qc.setQueryData<ChatInitialCache | undefined>(
        ["chat", roomId, "initial"],
        prev => {
          if (!prev) return prev;
          const prevId = prev?.chatRoomInfo?.lastReadMessageId ?? null;
          if (effective && effective !== prevId) {
            return {
              ...prev,
              chatRoomInfo: {
                ...prev.chatRoomInfo,
                lastReadMessageId: effective,
              },
            };
          }
          return prev;
        },
      );
    },
  });

  // 진입 시 1회
  useEffect(() => {
    if (!messages.length) return;
    sendRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // 포커스/가시성 회복 시
  useEffect(() => {
    const safeSend = () => {
      const now = Date.now();
      if (now - lastSentAtRef.current < COOLDOWN_MS) return;
      lastSentAtRef.current = now;
      if (messages.length) sendRead();
    };

    window.addEventListener("focus", safeSend);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") safeSend();
    });
    return () => {
      window.removeEventListener("focus", safeSend);
      document.removeEventListener("visibilitychange", () => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, sendRead]);

  return { lastReadId, isPending, markReadNow: () => sendRead() };
};
