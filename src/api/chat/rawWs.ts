// api/chat/rawWs.ts
// SockJS 전용 (STOMP 미사용). 기존 함수명/시그니처 유지.

import SockJS from "sockjs-client";
import useUserStore from "../../store/useUserStore";

let ws: WebSocket | null = null;

export type WsStatus = "idle" | "connecting" | "open" | "closed" | "error";

// 서버 발신 타입들
//type ServerMessageType = 'CONNECT' | 'ERROR' | 'SUBSCRIBE' | 'SEND' | 'SYSTEM';

// 서버 → 클라이언트(브로드캐스트)===================================
//🌟
export type BcFile = {
  fileKey: string;
  originalFileName: string;
  fileSize: number;
  fileType: string;
};
//🌟
export type BcImage = {
  imgKey: string;
  imgOrder: number;
  originalFileName: string;
  fileSize: number;
  fileType: string;
};

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
  type: "UNSUBSCRIBE"; // 문서/예시 상 불일치 대비
  chatRoomId: number;
  message: string;
  timestamp: string;
};

// 새 브로드캐스트 포맷
export type BroadcastMessage = {
  type: "SEND";
  chatRoomId: number;
  messageId: number;
  content: string | null;
  files: BcFile[] | null;
  images: BcImage[] | null;
  senderId: number;
  senderName: string;
  senderProfileImageUrl: string | null;
  timestamp: string;
  unreadCount?: number;
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

//토큰 유틸 & 가드
//const getToken = () => localStorage.getItem("accessToken") || "";
const getToken = () => {
  const { user } = useUserStore.getState();
  return user?.accessToken ?? localStorage.getItem("accessToken") ?? "";
};
const hasToken = () => !!getToken();

// 🌟서버로 보낼 메시지 타입
// type OutgoingMessage =
//   | { type: "SUBSCRIBE"; chatRoomId: number }
//   | { type: "UNSUBSCRIBE"; chatRoomId: number }
//   | { type: "SEND"; chatRoomId: number; messageType?: "TEXT"; content: string }
//   | {
//       type: "SEND";
//       chatRoomId: number;
//       messageType?: "IMAGE";
//       imgKeys: string[];
//       content?: string;
//     };
export type WsSendFile = {
  fileKey: string;
  originalFileName: string;
  fileSize: number;
  fileType: string;
};

export type WsSendImage = {
  imgKey: string;
  imgOrder: number;
  originalFileName: string;
  fileSize: number;
  fileType: string;
};

type WsSendEnvelope = {
  type: "SEND";
  chatRoomId: number;
  content: string | null;
  files: WsSendFile[] | null;
  images: WsSendImage[] | null;
};

type OutgoingMessage =
  | { type: "SUBSCRIBE"; chatRoomId: number }
  | { type: "UNSUBSCRIBE"; chatRoomId: number }
  | WsSendEnvelope;

const sendJSON = (msg: OutgoingMessage) => {
  //if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log("[WS→] SEND", msg);
    ws.send(JSON.stringify(msg));
    return true;
  }
  console.warn("[WS] not open. drop:", msg);
  return false;
};

// --------- 공개 API ----------
export const connectRawWs = (
  { memberId, origin }: { memberId: number; origin?: string },
  handlers: Handlers = {},
) => {
  // accessToken 없으면 연결 시도 안 함
  if (!hasToken()) {
    console.info("[WS] skipped: no accessToken");
    return null;
  }

  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    return ws;
  }

  const base = buildSockUrl(origin);
  const url = new URL(base);
  url.searchParams.set("memberId", String(memberId));
  url.searchParams.set("token", getToken()); // 서버가 헤더 대신 쿼리 파라미터로 읽는 형태라면 유지

  // SockJS 생성 (NOTE: SockJS는 http/https URL 사용)
  const sock = new SockJS(url.toString());
  ws = sock as WebSocket;

  // readyState가 OPEN이 되면 onopen 호출
  sock.onopen = () => {
    reconnectAttempt = 0;
    handlers.onOpen?.();

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
    console.warn("[WS close]", ev.code, ev.reason);
    handlers.onClose?.(ev);
    ws = null;

    // 토큰 없으면 재시도 안 함
    if (!hasToken()) return;

    // 백오프 재연결
    if (!reconnectTimer) {
      const delay = Math.min(500 * 2 ** reconnectAttempt, 8000);
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null;
        reconnectAttempt++;
        connectRawWs({ memberId, origin }, handlers);
        //connectRawWs({ memberId, origin });
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
  const ok = sendJSON({ type: "UNSUBSCRIBE", chatRoomId: roomId });
  if (!ok) {
    // 소켓이 닫혀있으면 재접속 시 자동 재구독되지 않도록만 유지.
    console.warn("[WS] UNSUBSCRIBE send failed (socket closed)");
  }
};

//
export const unsubscribeAll = () => {
  [...currentRooms].forEach(id =>
    sendJSON({ type: "UNSUBSCRIBE", chatRoomId: id }),
  );

  currentRooms.clear();
};

// 채팅 SEND
// ---------- 송신 헬퍼 (혼합 허용) ----------
export const sendTextWS = (chatRoomId: number, content: string) =>
  sendJSON({ type: "SEND", chatRoomId, content, files: null, images: null });

export const sendImagesWS = (chatRoomId: number, images: WsSendImage[]) =>
  sendJSON({ type: "SEND", chatRoomId, content: null, files: null, images });

export const sendFilesWS = (chatRoomId: number, files: WsSendFile[]) =>
  sendJSON({ type: "SEND", chatRoomId, content: null, files, images: null });

export const sendMixedWS = (args: {
  chatRoomId: number;
  content?: string | null;
  files?: WsSendFile[] | null;
  images?: WsSendImage[] | null;
}) =>
  sendJSON({
    type: "SEND",
    chatRoomId: args.chatRoomId,
    content: args.content ?? null,
    files: args.files ?? null,
    images: args.images ?? null,
  });
