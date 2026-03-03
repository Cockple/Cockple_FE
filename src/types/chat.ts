// API 데이터 형태에 맞춘 타입

export interface LastMessage {
  //messageId: number | null;
  content: string | null;
  timestamp: string | null;
  messageType: "TEXT" | "IMAGE" | string | null;
  senderName?: string | null; // 그룹에서만 올 수 있어 optional
}
export interface GroupChatRoom {
  chatRoomId: number;
  partyId: number;
  partyName: string;
  partyImgUrl: string;
  memberCount: number;
  unreadCount: number;
  lastMessage: LastMessage | null;
}

export interface PersonalChatRoom {
  chatRoomId: number;
  displayName: string;
  profileImgUrl: string;
  unreadCount: number;
  // lastMessage?: {
  //   messageId: number;
  //   content: string;
  //   timestamp: string;
  //   messageType: "TEXT" | "IMAGE";
  // };
  lastMessage: LastMessage | null;
}

export interface ChatRoomInfo {
  chatRoomId: number;
  chatRoomType: "PARTY" | "PERSONAL";
  displayName: string;
  profileImageUrl: string | null;
  memberCount: number;
  lastReadMessageId: number;
  isCounterPartWithdrawn: boolean;
}

// 🌟새 이미지 타입 (REST/WS 공통)
export interface ImageInfo {
  imageId: number;
  imageUrl: string;
  imgOrder: number;
  isEmoji: boolean;
  originalFileName: string;
  fileSize: number;
  fileType: string;
}

export interface ChatMessageResponse {
  messageId: number;
  senderId: number;
  senderName: string;
  // 🌟senderProfileImage: string;
  senderProfileImageUrl: string;
  content: string;
  messageType: "TEXT" | "SYSTEM";
  images: ImageInfo[]; //🌟
  //imageUrls?: string[]; // UI 호환(기존 컴포넌트 쓰면 사용)
  timestamp: string;
  isMyMessage: boolean;
}

export interface FileInfo {
  fileId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  thumbnailUrl: string;
  downUrl: string;
}

export interface Participants {
  memberId: number;
  memberName: string;
  profileImgUrl: string;
}
