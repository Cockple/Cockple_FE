// api/chat/rawWs.ts
// SockJS 전용 (STOMP 미사용). 기존 함수명/시그니처 유지.

import SockJS from "sockjs-client";
import useUserStore from "../../store/useUserStore";

let ws: WebSocket | null = null;

export type WsStatus = "idle" | "connecting" | "open" | "closed" | "error";

// 서버 발신 타입들
//type ServerMessageType = 'CONNECT' | 'ERROR' | 'SUBSCRIBE' | 'SEND' | 'SYSTEM';

// 서버 → 클라이언트(브로드캐스트)===================================
export type BcFile = {
  fileKey: string;
  originalFileName: string;
  fileSize: number;
  fileType: string;
};

export type BcImage = {
  //🌟
  // imgKey: string;
  // imgOrder: number;
  // originalFileName: string;
  // fileSize: number;
  // fileType: string;
  imageId: number;
  imageUrl: string;
  imgOrder: number;
  isEmoji: boolean;
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

// --- 🌟채팅방목록 구독
export type ChatRoomListUpdate = {
  type: "CHAT_ROOM_LIST_UPDATE";
  chatRoomId: number;
  lastMessage: {
    content: string | null;
    timestamp: string | null;
    messageType: "TEXT";
  };
  newUnreadCount: number;
  timestamp: string;
};

// 🌟export type SubscriptionResponse = {
//   type: "SUBSCRIBE";
//   chatRoomId: number;
//   message: string;
//   timestamp: string;
// };
export type SubscriptionResponse =
  | {
      type: "SUBSCRIBE";
      chatRoomId: number;
      message: string;
      timestamp: string;
    }
  | {
      type: "SUBSCRIBE";
      chatRoomIds: number[];
      message: string;
      timestamp: string;
    };

// 🌟export type UnsubscribeResponse = {
//   type: "UNSUBSCRIBE"; // 문서/예시 상 불일치 대비
//   chatRoomId: number;
//   message: string;
//   timestamp: string;
// };
export type UnsubscribeResponse =
  | {
      type: "UNSUBSCRIBE";
      chatRoomId: number;
      message: string;
      timestamp: string;
    }
  | {
      type: "UNSUBSCRIBE";
      chatRoomIds: number[];
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
  senderProfileImageUrl: string;
  timestamp: string | null;
  unreadCount?: number;
};

export type IncomingMessage =
  | ConnectResponse
  | ErrorResponse
  | SubscriptionResponse
  | UnsubscribeResponse
  | BroadcastMessage
  | ChatRoomListUpdate; // 🌟 (채팅방 목록을 구독한 상대방에게 보내는 업데이트)

//현재 구독 중인 방 목록을 전역으로 유지 (클라이언트 단의 '의도' 상태)
// 서버는 Redis에 실제 구독을 보관/복원하므로 재연결시 재구독 전송은 불필요
const currentRooms = new Set<number>();

// 재연결 백오프
let reconnectTimer: number | null = null;
let reconnectAttempt = 0;
let isManualClose = false; // 🌟 수동 종료 플래그 추가

//🌟전역 리스너(Event Bus)
type MsgListener = (data: IncomingMessage) => void;
const listeners = new Set<MsgListener>();

export const addWsListener = (fn: MsgListener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

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
  | { type: "SUBSCRIBE_CHAT_LIST"; memberRooms: number[] } // 🌟목록 탭용
  | { type: "UNSUBSCRIBE_CHAT_LIST"; memberRooms: number[] } // 🌟목록 탭용
  | WsSendEnvelope;

const sendJSON = (msg: OutgoingMessage) => {
  //if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
    console.log("[WS→] SEND", msg);
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
    isManualClose = false; // 연결 성공 시 플래그 초기화
    console.log("[WS open]");
    handlers.onOpen?.();

    // 자동 재구독
    // ->
    // 재연결 시 재구독 불필요: 서버가 Redis에 구독 상태를 보관/복원
    // if (currentRooms.size) {
    //   [...currentRooms].forEach(id => {
    //     //sendJSON({ type: "SUBSCRIBE", chatRoomId: id }),
    //     const ok = sendJSON({ type: "SUBSCRIBE", chatRoomId: id });
    //     console.log("[WS→] auto-resubscribe", id, ok ? "OK" : "FAIL");
    //   });
    // }
  };

  sock.onmessage = (e: MessageEvent) => {
    try {
      const parsed: IncomingMessage = JSON.parse(e.data);
      console.log("[WS←] message", parsed); // 디버깅
      handlers.onMessage?.(parsed);

      // 🌟전역 리스너 브로드캐스트
      listeners.forEach(fn => {
        try {
          fn(parsed);
        } catch (err) {
          console.warn("ws listener err", err);
        }
      });
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

    // 🌟 수동으로 끊은 경우 재연결 시도 안 함
    if (isManualClose) {
      console.log("[WS] Manual disconnect. No reconnect.");
      return;
    }

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
    isManualClose = true; // 🌟 수동 종료임을 명시
    ws.close();
  }
  ws = null;
};

export const rawWsState = () => ws?.readyState; // 0/1/2/3
export const isRawWsOpen = () => ws?.readyState === WebSocket.OPEN;

//🌟
export const subscribeChatList = (roomIds: number[]) => {
  if (!roomIds.length) return;
  const ok = sendJSON({ type: "SUBSCRIBE_CHAT_LIST", memberRooms: roomIds });
  console.log("[WS→] SUBSCRIBE_CHAT_LIST", roomIds, ok ? "OK" : "DEFER");
};

//
export const subscribeRoom = (roomId: number) => {
  console.log(currentRooms);
  if (currentRooms.has(roomId)) return; // 중복 방지
  currentRooms.add(roomId);
  const ok = sendJSON({ type: "SUBSCRIBE", chatRoomId: roomId });
  console.log("[WS→] SUBSCRIBE", roomId, ok ? "OK" : "DEFER");
};

//
export const subscribeMany = (roomIds: number[]) => {
  roomIds.forEach(id => subscribeRoom(id));
};

//🌟
export const unsubscribeChatList = (roomIds: number[]) => {
  if (!roomIds.length) return;
  const ok = sendJSON({ type: "UNSUBSCRIBE_CHAT_LIST", memberRooms: roomIds });
  console.log("[WS→] UNSUBSCRIBE_CHAT_LIST", roomIds, ok ? "OK" : "DEFER");
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
  // 서버가 구독을 영속화하므로, 진짜로 모두 끊고 싶을 때만 호출하세요.
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
