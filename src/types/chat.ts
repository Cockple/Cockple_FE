// API 데이터 형태에 맞춘 타입
export interface GroupChatRoom {
  chatRoomId: number;
  partyId: number;
  partyName: string;
  partyImgUrl: string;
  memberCount: number;
  unreadCount: number;
  lastMessage: {
    messageId: number;
    content: string;
    senderName: string;
    timestamp: string;
    messageType: "TEXT" | "IMAGE";
  };
}

export interface PersonalChatRoom {
  chatRoomId: number;
  displayName: string;
  profileImageUrl: string;
  unreadCount: number;
  lastMessage: {
    messageId: number;
    content: string;
    timestamp: string;
    messageType: "TEXT" | "IMAGE";
  };
}

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
  fileInfo: FileInfo | null;
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

export interface FileInfo {
  fileId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  thumbnailUrl: string;
  downUrl: string;
}
