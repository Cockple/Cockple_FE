import api from "../api";

export type ReadPayload = {
  chatRoomId: number;
  lastReadMessageId?: number;
  readAt?: string;
};

export type ReadResult = {
  lastReadMessageId?: number;
  readAt?: string;
};

export interface ChatReadSender {
  send(payload: ReadPayload): Promise<ReadResult>;
}

const READ_REST_ENDPOINT = (roomId: number) => `/api/chats/${roomId}/read-all`; // TODO: 백엔드 확정 후 수정!!!!!!

/** REST 버전(아직 URL 미정) */
export const restReadSender: ChatReadSender = {
  async send({ chatRoomId, lastReadMessageId, readAt }) {
    // 서버 스펙 맞춰 body/param 조정
    const { data } = await api.patch<ReadResult>(
      READ_REST_ENDPOINT(chatRoomId),
      { lastReadMessageId, readAt },
    );
    return data ?? {};
  },
};

/** WS 버전(URL 확정되면 이 부분만 고치면 됨) */
export const wsReadSender = (
  sendFn: (p: ReadPayload) => Promise<ReadResult>,
): ChatReadSender => ({
  async send(payload) {
    // 예: sendFn(`/app/chats/${payload.chatRoomId}/read`, payload)
    return sendFn(payload);
  },
});

/** 목업 버전: 네트워크 없이 즉시 성공 처리 */
export const mockReadSender: ChatReadSender = {
  async send({ lastReadMessageId }) {
    return { lastReadMessageId, readAt: new Date().toISOString() };
  },
};

/** 공장: 모드만 바꾸면 즉시 전환 */
export type ChatReadMode = "mock" | "rest" | "ws";
export const createChatReadSender = (
  mode: ChatReadMode,
  wsSend?: (p: ReadPayload) => Promise<ReadResult>,
) => {
  if (mode === "rest") return restReadSender;
  if (mode === "ws" && wsSend) return wsReadSender(wsSend);
  return mockReadSender;
};
