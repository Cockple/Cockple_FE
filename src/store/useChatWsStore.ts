//채팅방 카드의 lastMessage, timestamp, unread를 실시간으로 반영하기 위한 스토어
// src/store/useChatWsStore.ts
import { create } from "zustand";
import type { BroadcastMessage } from "../api/chat/rawWs";

// 🌟목록 브로드캐스트(이미지 7번) 페이로드용 타입
type ListUpdatePayload = {
  chatRoomId: number;
  lastMessage: string | null;
  timestamp: string | null;
  unreadCount: number;
  messageType?: "TEXT" | "IMAGE"; // 선택: 오면 미리보기에 반영
};

// 목록 카드에서 필요한 최소 메타
export type RoomMeta = {
  chatRoomId: number;
  lastMessage: string | null;
  timestamp: string | null;
  unreadCount: number;
};

type State = {
  meta: Record<number, RoomMeta>; // roomId -> meta
  activeRoomId: number | null; // 상세에 머무는 방
};

type Actions = {
  /** 최초 API로 받아온 목록을 스토어에 주입 */
  hydrateFromAPI: (rooms: RoomMeta[]) => void;

  /** 상세 페이지 진입/이탈 시 활성 방 설정 */
  setActiveRoom: (roomId: number | null) => void;

  /** 특정 방의 안읽음 수를 0으로 초기화 */
  clearUnread: (roomId: number) => void;

  /** 채팅방을 구독한 상대방에게 가는 브로드캐스트(SEND) 수신 시 반영 */
  applyInbound: (msg: BroadcastMessage) => void;

  /** 채팅방 "목록"을 구독한 상대방에게 가는 브로드캐스트(CHAT_ROOM_LIST_UPDATE) 반영 */
  applyListUpdate: (p: ListUpdatePayload) => void; // 🌟목록 브로드캐스트
};

export const useChatWsStore = create<State & Actions>(set => ({
  meta: {},
  activeRoomId: null,

  hydrateFromAPI: rooms =>
    set(state => {
      const next = { ...state.meta };
      rooms.forEach(r => {
        next[r.chatRoomId] = {
          chatRoomId: r.chatRoomId,
          lastMessage: r.lastMessage ?? null,
          timestamp: r.timestamp ?? null,
          unreadCount: r.unreadCount ?? 0,
        };
      });
      return { meta: next };
    }),

  setActiveRoom: roomId => set({ activeRoomId: roomId }),

  clearUnread: roomId =>
    set(state => {
      const cur = state.meta[roomId];
      if (!cur) return {};
      return { meta: { ...state.meta, [roomId]: { ...cur, unreadCount: 0 } } };
    }),

  // 채팅방을 구독한 상대방에게 가는 브로드캐스트(SEND)
  applyInbound: msg =>
    set(state => {
      if (msg.type !== "SEND") return {};

      const cur = state.meta[msg.chatRoomId] ?? {
        chatRoomId: msg.chatRoomId,
        lastMessage: null,
        timestamp: null,
        unreadCount: 0,
      };

      const hasImages = (msg.images?.length ?? 0) > 0;
      const hasOnlyEmoji =
        hasImages && (msg.images ?? []).every(im => im.isEmoji === true);

      const preview = hasImages
        ? hasOnlyEmoji
          ? "[이모티콘]"
          : "[사진]"
        : (msg.content ?? "");

      // 상세에 들어가 있지 않은 경우에만 unread++
      const unreadBump =
        state.activeRoomId === msg.chatRoomId ? 0 : (cur.unreadCount ?? 0) + 1;

      return {
        meta: {
          ...state.meta,
          [msg.chatRoomId]: {
            chatRoomId: msg.chatRoomId,
            lastMessage: preview,
            timestamp: msg.timestamp ?? cur.timestamp,
            unreadCount: unreadBump,
          },
        },
      };
    }),

  // 🌟채팅방 "목록"을 구독한 상대방에게 가는 브로드캐스트(CHAT_ROOM_LIST_UPDATE)
  applyListUpdate: p =>
    set(state => {
      const cur = state.meta[p.chatRoomId] ?? {
        chatRoomId: p.chatRoomId,
        lastMessage: null,
        timestamp: null,
        unreadCount: 0,
      };

      // 미리보기 규칙: lastMessage는 서버 값 그대로 반영
      const preview = p.lastMessage ?? cur.lastMessage ?? null;

      // 목록 업데이트의 unreadCount는 서버 기준으로 '덮어쓰기'
      const unreadByServer =
        state.activeRoomId === p.chatRoomId ? 0 : (p.unreadCount ?? 0);

      return {
        meta: {
          ...state.meta,
          [p.chatRoomId]: {
            chatRoomId: p.chatRoomId,
            lastMessage: preview,
            timestamp: p.timestamp ?? cur.timestamp,
            unreadCount: unreadByServer,
          },
        },
      };
    }),
}));
