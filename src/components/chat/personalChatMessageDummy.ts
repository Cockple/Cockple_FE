import ProfileImg from "../../assets/images/Profile_Image.png";
import type { ChatMessageResponse } from "../../types/chat";

export const personalChatDataMap: Record<string, ChatMessageResponse[]> = {
  "100": [
    {
      messageId: 1,
      chatRoomId: 100,
      senderId: 201,
      senderName: "김세익스피어",
      senderProfileImage: ProfileImg,
      messageType: "TEXT",
      content: "안녕하세요! 개인채팅입니다 :)",
      reactions: [],
      replyTo: null,
      fileInfo: null,
      isDeleted: false,
      createdAt: "2025-07-20T10:30:00Z",
      updatedAt: "2025-07-20T10:30:00Z",
    },
    {
      messageId: 2,
      chatRoomId: 100,
      senderId: 999,
      senderName: "나",
      senderProfileImage: ProfileImg,
      messageType: "TEXT",
      content: "반가워요!",
      reactions: [],
      replyTo: null,
      fileInfo: null,
      isDeleted: false,
      createdAt: "2025-07-20T10:35:00Z",
      updatedAt: "2025-07-20T10:35:00Z",
    },
  ],
};
