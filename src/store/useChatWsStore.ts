//채팅방 카드의 lastMessage, timestamp, unread를 실시간으로 반영하기 위한 스토어
// src/store/useChatWsStore.ts
import { create } from "zustand";
import type { BroadcastMessage } from "../api/chat/rawWs";

// 목록 카드에서 필요한 최소 메타
export type RoomMeta = {
  chatRoomId: number;
  lastMessage: string | null;
  timestamp: string | null;
  unreadCount: number;
};

type State = {
  // roomId -> meta
  meta: Record<number, RoomMeta>;
  activeRoomId: number | null; // 상세에 머무는 방
};

type Actions = {
  hydrateFromAPI: (rooms: RoomMeta[]) => void;
  setActiveRoom: (roomId: number | null) => void;
  clearUnread: (roomId: number) => void;
  applyInbound: (msg: BroadcastMessage) => void;
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
        } as RoomMeta;
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

  applyInbound: msg =>
    set(state => {
      if (msg.type !== "SEND") return {};

      const cur = state.meta[msg.chatRoomId] ?? {
        chatRoomId: msg.chatRoomId,
        lastMessage: null,
        timestamp: null,
        unreadCount: 0,
      };

      const isImage =
        (msg.images?.length ?? 0) > 0 ||
        (msg.content &&
          /^https?:\/\/.+\.(png|jpe?g|gif|webp|jfif)$/i.test(msg.content));

      const preview = isImage ? "[사진]" : (msg.content ?? "");

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
}));
