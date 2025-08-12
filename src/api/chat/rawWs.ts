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

//현재 구독 중인 방 목록을 전역으로 유지
const currentRooms = new Set<number>();

// 재연결 백오프
let reconnectTimer: number | null = null;
let reconnectAttempt = 0;

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
// const buildSockUrl = (originOverride?: string) => {
//   const isHttps =
//     typeof window !== "undefined" && window.location.protocol === "https:";
//   // originOverride가 없으면 배포/로컬 자동 분기
//   const origin =
//     originOverride ?? (isHttps ? WS_ORIGIN : "http://localhost:8080");
//   return `${origin}${WS_PATH}`;
// };
const buildSockUrl = (origin?: string) => {
  const base = (origin ?? WS_ORIGIN) + WS_PATH;
  return base; // SockJS는 http/https 사용
};

// 서버로 보낼 메시지 타입
type OutgoingMessage =
  | { type: "SUBSCRIBE"; chatRoomId: number }
  | { type: "SEND"; chatRoomId: number; content: string };

const sendJSON = (msg: OutgoingMessage) => {
  //if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
    return true;
  }
  console.warn("[WS] not open. drop:", msg);
  return false;
};

// --------- 공개 API ----------
export const connectRawWs = (
  {
    memberId,
    origin,
    //chatRoomId,
  }: { memberId: number; origin?: string },
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
    reconnectAttempt = 0;
    handlers.onOpen?.();

    //====== 이 부분 ============
    //const payload = { type: "SUBSCRIBE", chatRoomId };
    //console.log("[WS >>] SUBSCRIBE:", payload);
    //sock.send(JSON.stringify(payload));
    // 자동 재구독
    if (currentRooms.size) {
      [...currentRooms].forEach(id =>
        sendJSON({ type: "SUBSCRIBE", chatRoomId: id }),
      );
    }
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

    // 백오프 재연결
    if (!reconnectTimer) {
      const delay = Math.min(500 * 2 ** reconnectAttempt, 8000);
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null;
        reconnectAttempt++;
        connectRawWs({ memberId, origin }, handlers);
      }, delay);
    }
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

//
export const subscribeRoom = (roomId: number) => {
  if (currentRooms.has(roomId)) return; // 중복 방지
  currentRooms.add(roomId);
  sendJSON({ type: "SUBSCRIBE", chatRoomId: roomId });
};

//
export const subscribeMany = (roomIds: number[]) => {
  roomIds.forEach(id => subscribeRoom(id));
};

//
export const unsubscribeRoom = (roomId: number) => {
  if (!currentRooms.has(roomId)) return;
  currentRooms.delete(roomId);
  // 서버가 UNSUBSCRIBE 지원하면 다음 줄 활성화
  // sendJSON({ type: "UNSUBSCRIBE", chatRoomId: roomId });
};

//
export const unsubscribeAll = () => {
  // 서버가 UNSUBSCRIBE 지원하면 room별 전송
  // currentRooms.forEach(id => sendJSON({ type:"UNSUBSCRIBE", chatRoomId:id }));
  currentRooms.clear();
};

// 채팅 SEND
export const sendChatWS = (chatRoomId: number, content: string) => {
  // 백엔드 명세: 반드시 JSON 문자열로 보냄
  return sendJSON({ type: "SEND", chatRoomId, content });
};
