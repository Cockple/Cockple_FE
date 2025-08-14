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
export type UnsubscribeResponse = {
  type: "UNSUBSCRIBE" | "SUBSCRIBE"; // 문서/예시 상 불일치 대비
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
  timestamp?: string;
};

export type IncomingMessage =
  | ConnectResponse
  | ErrorResponse
  | SubscriptionResponse
  | UnsubscribeResponse
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

// 🌟전역 리스너 레지스트리
const listeners = new Set<Handlers>();
export const addWsListener = (h: Handlers) => {
  listeners.add(h);
  // 현재가 OPEN이면 즉시 알림(초기 렌더에서 상태 동기화 용)
  if (ws?.readyState === WebSocket.OPEN) {
    queueMicrotask(() => h.onOpen?.());
  }
  return () => listeners.delete(h);
};

//🌟
const emit = {
  open: () => listeners.forEach(l => l.onOpen?.()),
  msg: (m: IncomingMessage) => listeners.forEach(l => l.onMessage?.(m)),
  err: (e: Event | Error) => listeners.forEach(l => l.onError?.(e)),
  close: (e: CloseEvent) => listeners.forEach(l => l.onClose?.(e)),
};

const WS_ORIGIN = (
  import.meta.env.VITE_WS_ORIGIN ?? window.location.origin
).replace(/\/$/, "");
const WS_PATH = (import.meta.env.VITE_WS_PATH ?? "/ws/chats").replace(
  /\/$/,
  "",
);

const buildSockUrl = (origin?: string) => {
  const base = (origin ?? WS_ORIGIN) + WS_PATH;
  return base; // SockJS는 http/https 사용
};

// 서버로 보낼 메시지 타입
type OutgoingMessage =
  | { type: "SUBSCRIBE"; chatRoomId: number }
  | { type: "UNSUBSCRIBE"; chatRoomId: number }
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
  { memberId, origin }: { memberId: number; origin?: string },
  //🌟
  // handlers: Handlers = {},
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
    emit.open?.();

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
      emit.msg?.(parsed);
    } catch {
      console.warn("[SockJS] Non-JSON message:", e.data);
    }
  };

  sock.onerror = (ev: Event) => {
    emit.err?.(ev);
  };

  sock.onclose = (ev: CloseEvent) => {
    emit.close?.(ev);
    ws = null;

    // 백오프 재연결
    if (!reconnectTimer) {
      const delay = Math.min(500 * 2 ** reconnectAttempt, 8000);
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null;
        reconnectAttempt++;
        //🌟
        //connectRawWs({ memberId, origin }, handlers);
        connectRawWs({ memberId, origin });
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
  //🌟
  const ok = sendJSON({ type: "UNSUBSCRIBE", chatRoomId: roomId });
  if (!ok) {
    // 소켓이 닫혀있으면 재접속 시 자동 재구독되지 않도록만 유지.
    console.warn("[WS] UNSUBSCRIBE send failed (socket closed)");
  }
};

//
export const unsubscribeAll = () => {
  // 🌟서버 명세에 따라 개별 방마다 UNSUBSCRIBE 전송
  [...currentRooms].forEach(id =>
    sendJSON({ type: "UNSUBSCRIBE", chatRoomId: id }),
  );

  currentRooms.clear();
};

// 채팅 SEND
export const sendChatWS = (chatRoomId: number, content: string) => {
  // 백엔드 명세: 반드시 JSON 문자열로 보냄
  return sendJSON({ type: "SEND", chatRoomId, content });
};
