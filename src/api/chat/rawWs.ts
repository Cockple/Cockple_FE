// api/chat/rawWs.ts
// SockJS 전용 (STOMP 미사용). 기존 함수명/시그니처 유지.

import SockJS from "sockjs-client";

let ws: WebSocket | null = null;

export type WsStatus = "idle" | "connecting" | "open" | "closed" | "error";

// 서버 발신 타입들
//type ServerMessageType = 'CONNECT' | 'ERROR' | 'SUBSCRIBE' | 'SEND' | 'SYSTEM';

// 서버 → 클라이언트
export type ConnectResponse = {
  type: "CONNECT";
  memberId: number;
  memberName: string;
  connectedAt: string;
  message: string;
};
export type ErrorResponse = {
  type: "ERROR";
  errorCode: string;
  message: string;
};
export type SubscriptionResponse = {
  type: "SUBSCRIBE";
  chatRoomId: number;
  message: string;
  timestamp: string;
};
export type BroadcastMessage = {
  type: "SEND" | "SYSTEM";
  chatRoomId: number;
  messageId?: number;
  content?: string;
  senderId?: number | null;
  senderName?: string | null;
  senderProfileImage?: string | null;
  createdAt?: string;
};

export type IncomingMessage =
  | ConnectResponse
  | ErrorResponse
  | SubscriptionResponse
  | BroadcastMessage;

// 클라이언트 → 서버
type OutgoingMessage =
  | { type: "SUBSCRIBE"; chatRoomId: number }
  | { type: "SEND"; chatRoomId: number; content: string };

type Handlers = {
  onOpen?: (info?: ConnectResponse) => void;
  onMessage?: (data: IncomingMessage) => void;
  onError?: (ev: Event | Error) => void;
  onClose?: (ev: CloseEvent) => void;
};

const WS_ORIGIN = (
  import.meta.env.VITE_WS_ORIGIN ?? window.location.origin
).replace(/\/$/, "");
const WS_PATH = (import.meta.env.VITE_WS_PATH ?? "/ws/chats").replace(
  /\/$/,
  "",
);

// SockJS는 http/https 스킴 사용
const buildSockUrl = (originOverride?: string) => {
  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  // originOverride가 없으면 배포/로컬 자동 분기
  const origin =
    originOverride ?? (isHttps ? WS_ORIGIN : "http://localhost:8080");
  return `${origin}${WS_PATH}`;
};

export const connectRawWs = (
  { memberId, origin }: { memberId: number; origin?: string },
  handlers: Handlers = {},
) => {
  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    return ws;
  }

  const base = buildSockUrl(origin);
  const url = new URL(base);
  const token = localStorage.getItem("accessToken") ?? "";

  url.searchParams.set("memberId", String(memberId));
  url.searchParams.set("token", token);

  // SockJS 생성 (NOTE: SockJS는 http/https URL 사용)
  // 타입 호환 위해 any 캐스팅. 런타임은 WebSocket 유사 API 제공.
  const sock = new SockJS(url.toString());
  ws = sock as WebSocket;

  // readyState가 OPEN이 되면 onopen 호출
  sock.onopen = () => {
    handlers.onOpen?.();
  };

  sock.onmessage = (e: MessageEvent) => {
    try {
      const parsed: IncomingMessage = JSON.parse(e.data);
      handlers.onMessage?.(parsed);
    } catch {
      console.warn("[SockJS] Non-JSON message:", e.data);
    }
  };

  sock.onerror = (ev: Event) => {
    handlers.onError?.(ev);
  };

  sock.onclose = (ev: CloseEvent) => {
    handlers.onClose?.(ev);
    ws = null;
  };

  return ws!;
};

export const disconnectRawWs = () => {
  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    ws.close();
  }
  ws = null;
};

export const rawWsState = () => ws?.readyState; // 0/1/2/3
export const isRawWsOpen = () => ws?.readyState === WebSocket.OPEN;

// 구독 / 메시지 전송 헬퍼 (SockJS도 문자열 전송)
export const subscribeWS = (chatRoomId: number) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) throw new Error("WS not open");
  const payload: OutgoingMessage = { type: "SUBSCRIBE", chatRoomId };
  ws.send(JSON.stringify(payload));
};

export const sendChatWS = (chatRoomId: number, content: string) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) throw new Error("WS not open");
  const trimmed = content.trim();
  if (!trimmed) return;
  if (trimmed.length > 1000)
    throw new Error("메시지는 최대 1000자까지 가능합니다.");
  const payload: OutgoingMessage = {
    type: "SEND",
    chatRoomId,
    content: trimmed,
  };
  ws.send(JSON.stringify(payload));
};
