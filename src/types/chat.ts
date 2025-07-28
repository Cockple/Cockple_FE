// 채팅 메시지 하나의 기본 구조
export interface Chatting {
  id: number;
  nickname: string;
  profile: string; // 프로필 이미지 URL
  chatting: string;
  time: string; // HH:MM 형식 문자열
  createdAt: string; // yyyy.mm.dd
  isMe: boolean;
  unreadCount: number;
  imageUrls?: string[]; // 첨부 이미지 (선택)
}

// ChattingComponent에서 사용하는 props (id, profile 제외)
export type ChattingComponentProps = Omit<Chatting, "id">;
