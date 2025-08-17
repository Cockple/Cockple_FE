// API 데이터 형태에 맞춘 타입

export interface LastMessage {
  messageId: number | null;
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
  // lastMessage: {
  //   messageId: number;
  //   content: string;
  //   senderName: string;
  //   timestamp: string;
  //   messageType: "TEXT" | "IMAGE";
  // };
  lastMessage: LastMessage | null;
}

export interface PersonalChatRoom {
  chatRoomId: number;
  displayName: string;
  profileImageUrl: string;
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
}

export interface ChatMessageResponse {
  messageId: number;
  senderId: number;
  senderName: string;
  senderProfileImage: string;
  content: string;
  messageType: "TEXT" | "IMAGE";
  imageUrls: string[];
  //reactions: Reaction[];
  //replyTo: null | number;
  //fileInfo: FileInfo | null;
  //isDeleted: boolean;
  //createdAt: string;
  //updatedAt: string;
  timestamp: string;
  isMyMessage: boolean;
}

// interface Reaction {
//   reactionId: number;
//   emoji: string;
//   count: number;
//   userReacted: boolean;
//   reactedUsers: string[];
// }

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
