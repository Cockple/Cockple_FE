// 안 읽은 채팅 존재 여부 (내비바 / 채팅 탭 뱃지용)
// 서버가 memberId 스코프로 밀어주는 UNREAD_STATUS_UPDATE 웹소켓 메시지를
// useUnreadStatusStore가 그대로 저장하고, 여기선 그 값을 읽기만 한다.
import { useUnreadStatusStore, type UnreadStatus } from "../../store/useUnreadStatusStore";

export type { UnreadStatus };

export function useUnreadStatus(): UnreadStatus {
  return useUnreadStatusStore(s => s.status);
}
