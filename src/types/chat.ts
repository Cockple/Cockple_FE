// API 응답 기반 메시지 타입
export interface ChatMessageResponse {
  messageId: number;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  senderProfileImage: string;
  messageType: "TEXT" | "IMAGE";
  content: string;
  reactions: Reaction[];
  replyTo: null | number;
  fileInfo: null | any;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Reaction {
  reactionId: number;
  emoji: string;
  count: number;
  userReacted: boolean;
  reactedUsers: string[];
}

// 프론트에서 사용하는 메시지 타입 (ChattingComponent에 맞춤)
export interface Chatting {
  id: number;
  nickname: string;
  profile: string;
  chatting: string;
  time: string;
  createdAt: string; // YYYY.MM.DD
  isMe: boolean;
  unreadCount: number;
  imageUrls?: string[];
}

// // 채팅 메시지 하나의 기본 구조
// export interface Chatting {
//   id: number;
//   nickname: string;
//   profile: string; // 프로필 이미지 URL
//   chatting: string;
//   time: string; // HH:MM 형식 문자열
//   createdAt: string; // yyyy.mm.dd
//   isMe: boolean;
//   unreadCount: number;
//   imageUrls?: string[]; // 첨부 이미지 (선택)
// }

// // ChattingComponent에서 사용하는 props (id, profile 제외)
// export type ChattingComponentProps = Omit<Chatting, "id">;
