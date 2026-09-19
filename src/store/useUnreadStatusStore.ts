// 내비바 / 채팅 탭 안읽음 뱃지 상태.
// 서버가 memberId 스코프로 UNREAD_STATUS_UPDATE 웹소켓 메시지를 보내주면
// 그 값을 그대로 저장한다. REST 폴링/유추 없음 — 100% 서버 push.
import { create } from "zustand";
import { addWsListener } from "../api/chat/rawWs";

export type UnreadStatus = {
  hasUnread: boolean;
  hasPartyUnread: boolean;
  hasDirectUnread: boolean;
};

const initialStatus: UnreadStatus = {
  hasUnread: false,
  hasPartyUnread: false,
  hasDirectUnread: false,
};

type State = {
  status: UnreadStatus;
};

type Actions = {
  setStatus: (status: UnreadStatus) => void;
};

export const useUnreadStatusStore = create<State & Actions>(set => ({
  status: initialStatus,
  setStatus: status => set({ status }),
}));

// 컴포넌트 마운트 여부와 무관하게 앱 전체에서 한 번만 구독
addWsListener(msg => {
  if (msg.type !== "UNREAD_STATUS_UPDATE") return;
  useUnreadStatusStore.getState().setStatus({
    hasUnread: msg.hasUnread,
    hasPartyUnread: msg.hasPartyUnread,
    hasDirectUnread: msg.hasDirectUnread,
  });
});
