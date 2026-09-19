// api/chat/rawWs.ts
// CHAT 도메인. GAME과 함께 /ws/realtime 단일 연결(api/realtime/connection.ts)을 공유한다.
// 기존 /ws/chats 시절의 평문 { type, ... } 메시지 대신 이제 { version, domain:"CHAT", action/type, requestId, payload/data } envelope을 쓰지만,
// 이 파일 아래의 IncomingMessage 형태(및 함수 시그니처)는 기존과 동일하게 유지해서 이 파일을 쓰는 다른 코드는 손대지 않아도 되게 했다.
// ⚠️ CHAT 도메인의 새 응답 envelope 필드명은 백엔드 공지에서 요청(SUBSCRIBE) 예시만 확인됐고 응답 쪽은 GAME 도메인과의 유사성으로 추정한 것이라,
//    아래 toIncomingMessage()의 매핑이 실제와 다르면 여기만 고치면 된다.
import {
  connectRealtimeWs,
  disconnectRealtimeWs,
  isRealtimeWsOpen,
  realtimeWsState,
  sendRealtimeFireAndForget,
  addRealtimeListener,
  addRealtimeOpenListener,
  addRealtimeCloseListener,
  type ResponseEnvelope,
} from "../realtime/connection";

export type WsStatus = "idle" | "connecting" | "open" | "closed" | "error";

// 서버 → 클라이언트(브로드캐스트)===================================
export type BcFile = {
  fileKey: string;
  originalFileName: string;
  fileSize: number;
  fileType: string;
};

export type BcImage = {
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

// --- 채팅방목록 구독
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

// --- 내비바/채팅 탭 안읽음 뱃지용 (memberId 스코프, 방 구독과 무관하게 옴)
export type UnreadStatusUpdate = {
  type: "UNREAD_STATUS_UPDATE";
  hasUnread: boolean;
  hasPartyUnread: boolean;
  hasDirectUnread: boolean;
  timestamp: string;
};

export type BroadcastMessage = {
  type: "SEND";
  chatRoomId: number;
  messageId: number;
  content: string | null;
  files: BcFile[] | null;
  images: BcImage[] | null;
  senderId: number | null;
  senderName: string;
  senderProfileImageUrl: string | null;
  messageType?: "TEXT" | "SYSTEM" | null;
  timestamp: string | null;
  unreadCount?: number;
};

export type IncomingMessage =
  | ConnectResponse
  | ErrorResponse
  | SubscriptionResponse
  | UnsubscribeResponse
  | BroadcastMessage
  | ChatRoomListUpdate
  | UnreadStatusUpdate;

// CHAT 도메인 envelope(ResponseEnvelope) → 기존 평문 IncomingMessage로 변환
const toIncomingMessage = (env: ResponseEnvelope): IncomingMessage | null => {
  const data = (env.data ?? {}) as Record<string, unknown>;
  const timestamp = (data.timestamp as string | undefined) ?? env.timestamp;

  switch (env.type) {
    case "CONNECT":
      return {
        type: "CONNECT",
        memberId: data.memberId as number,
        memberName: data.memberName as string,
        connectedAt: (data.connectedAt as string) ?? timestamp,
        message: data.message as string,
      };
    case "ERROR": {
      const err = env.error ?? (data as { code?: string; message?: string });
      return {
        type: "ERROR",
        errorCode: err?.code ?? "UNKNOWN",
        message: err?.message ?? "오류가 발생했어요.",
      };
    }
    case "SUBSCRIBE":
    case "SUBSCRIBED":
      return {
        type: "SUBSCRIBE",
        ...data,
        message: (data.message as string) ?? "",
        timestamp,
      } as SubscriptionResponse;
    case "UNSUBSCRIBE":
    case "UNSUBSCRIBED":
      return {
        type: "UNSUBSCRIBE",
        ...data,
        message: (data.message as string) ?? "",
        timestamp,
      } as UnsubscribeResponse;
    case "SEND":
      return {
        type: "SEND",
        chatRoomId: data.chatRoomId as number,
        messageId: data.messageId as number,
        content: (data.content as string | null) ?? null,
        files: (data.files as BcFile[] | null) ?? null,
        images: (data.images as BcImage[] | null) ?? null,
        senderId: (data.senderId as number | null) ?? null,
        senderName: data.senderName as string,
        senderProfileImageUrl:
          (data.senderProfileImageUrl as string | null) ?? null,
        messageType: data.messageType as "TEXT" | "SYSTEM" | null | undefined,
        timestamp,
        unreadCount: data.unreadCount as number | undefined,
      };
    case "CHAT_ROOM_LIST_UPDATE":
      return {
        type: "CHAT_ROOM_LIST_UPDATE",
        chatRoomId: data.chatRoomId as number,
        lastMessage: data.lastMessage as ChatRoomListUpdate["lastMessage"],
        newUnreadCount: data.newUnreadCount as number,
        timestamp,
      };
    case "UNREAD_STATUS_UPDATE":
      return {
        type: "UNREAD_STATUS_UPDATE",
        hasUnread: data.hasUnread as boolean,
        hasPartyUnread: data.hasPartyUnread as boolean,
        hasDirectUnread: data.hasDirectUnread as boolean,
        timestamp,
      };
    // 목록 구독/해제 ack — 클라이언트가 따로 처리할 게 없어 조용히 무시
    case "SUBSCRIBE_CHAT_LIST":
    case "UNSUBSCRIBE_CHAT_LIST":
    default:
      return null;
  }
};

//현재 구독 중인 방 목록을 전역으로 유지 (클라이언트 단의 '의도' 상태)
// 서버는 Redis에 실제 구독을 보관/복원하므로 재연결시 재구독 전송은 불필요
const currentRooms = new Set<number>();

//전역 리스너(Event Bus)
type MsgListener = (data: IncomingMessage) => void;
const listeners = new Set<MsgListener>();

export const addWsListener = (fn: MsgListener) => {
  const off = addRealtimeListener(env => {
    if (env.domain !== "CHAT") return;
    const msg = toIncomingMessage(env);
    if (msg) fn(msg);
  });
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
    off();
  };
};

export const addWsOpenListener = addRealtimeOpenListener;
export const addWsCloseListener = addRealtimeCloseListener;

// --------- 공개 API (연결은 realtime/connection.ts로 위임) ----------
export const connectRawWs = ({
  origin,
}: {
  memberId?: number; // 신규 /ws/realtime은 token만 사용 — 호환을 위해 인자만 유지
  origin?: string;
} = {}) => connectRealtimeWs({ origin });

export const disconnectRawWs = () => disconnectRealtimeWs();

export const rawWsState = () => realtimeWsState(); // 0/1/2/3
export const isRawWsOpen = () => isRealtimeWsOpen();

const sendChat = (action: string, payload: Record<string, unknown>) =>
  sendRealtimeFireAndForget("CHAT", action, payload);

export const subscribeChatList = (roomIds: number[]) => {
  if (!roomIds.length) return;
  sendChat("SUBSCRIBE_CHAT_LIST", { memberRooms: roomIds });
};

export const subscribeRoom = (roomId: number) => {
  if (currentRooms.has(roomId)) return; // 중복 방지
  currentRooms.add(roomId);
  sendChat("SUBSCRIBE", { chatRoomId: roomId });
};

export const subscribeMany = (roomIds: number[]) => {
  roomIds.forEach(id => subscribeRoom(id));
};

export const unsubscribeChatList = (roomIds: number[]) => {
  if (!roomIds.length) return;
  sendChat("UNSUBSCRIBE_CHAT_LIST", { memberRooms: roomIds });
};

export const unsubscribeRoom = (roomId: number) => {
  if (!currentRooms.has(roomId)) return;
  currentRooms.delete(roomId);
  sendChat("UNSUBSCRIBE", { chatRoomId: roomId });
};

export const unsubscribeAll = () => {
  // 서버가 구독을 영속화하므로, 진짜로 모두 끊고 싶을 때만 호출하세요.
  [...currentRooms].forEach(id => sendChat("UNSUBSCRIBE", { chatRoomId: id }));
  currentRooms.clear();
};

// 채팅 SEND
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

// ---------- 송신 헬퍼 (혼합 허용) ----------
export const sendTextWS = (chatRoomId: number, content: string) =>
  sendChat("SEND", { chatRoomId, content, files: null, images: null });

export const sendImagesWS = (chatRoomId: number, images: WsSendImage[]) =>
  sendChat("SEND", { chatRoomId, content: null, files: null, images });

export const sendFilesWS = (chatRoomId: number, files: WsSendFile[]) =>
  sendChat("SEND", { chatRoomId, content: null, files, images: null });

export const sendMixedWS = (args: {
  chatRoomId: number;
  content?: string | null;
  files?: WsSendFile[] | null;
  images?: WsSendImage[] | null;
}) =>
  sendChat("SEND", {
    chatRoomId: args.chatRoomId,
    content: args.content ?? null,
    files: args.files ?? null,
    images: args.images ?? null,
  });
