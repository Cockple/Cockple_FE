import { useEffect } from "react";
import {
  getGroupChatRooms,
  getPersonalChatRooms,
} from "../api/chat/chatList";
import { useChatWsStore } from "../store/useChatWsStore";
import useUserStore from "../store/useUserStore";
import { resolveMemberId } from "../utils/auth";

// [임시 조치] 하단 네비 채팅 안읽음 뱃지는
//  1) UNREAD_STATUS_UPDATE 웹소켓 push (접속 이후 상태가 "변할 때"만 옴)
//  2) 채팅 탭(ChatPage)에서만 채워지던 useChatWsStore.meta
// 두 가지에만 의존한다. 그래서 채팅 탭을 한 번도 안 들어가면, 앱을 켜기 전에 쌓여 있던
// 안읽음이 메인 화면 뱃지에 반영되지 않는다 (채팅 탭 진입 후에야 뜸).
//
// 근본 해결은 서버가 소켓 접속/구독 직후 현재 안읽음 상태를 1회 push하는 것.
// 그 전까지의 임시 방편으로, 앱 진입 시(로그인 상태) 채팅방 목록을 한 번 조회해
// store를 seed 한다. 서버 push가 적용되면 이 훅은 제거 가능.
let seededFor: number | null = null;

export const useSeedChatUnread = () => {
  const hydrateFromAPI = useChatWsStore(s => s.hydrateFromAPI);
  const token =
    useUserStore(s => s.user?.accessToken) ??
    localStorage.getItem("accessToken") ??
    "";
  const memberId = resolveMemberId() ?? 0;

  useEffect(() => {
    if (!token || !memberId || seededFor === memberId) return;
    seededFor = memberId;

    (async () => {
      try {
        const [groupRes, personalRes] = await Promise.all([
          getGroupChatRooms(),
          getPersonalChatRooms(),
        ]);
        hydrateFromAPI(
          [...groupRes.content, ...personalRes.content].map(r => ({
            chatRoomId: r.chatRoomId,
            lastMessage: r.lastMessage?.content ?? null,
            timestamp: r.lastMessage?.timestamp ?? null,
            unreadCount: r.unreadCount ?? 0,
          })),
        );
      } catch (err) {
        seededFor = null; // 실패 시 다음 기회에 재시도
        console.error("[unread] 초기 안읽음 상태 seed 실패", err);
      }
    })();
  }, [token, memberId, hydrateFromAPI]);
};
