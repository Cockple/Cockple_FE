// 그룹채팅 메시지 더미
import ProfileImg from "../../assets/images/Profile_Image.png";
import type { ChatMessageResponse } from "../../types/chat";

export const groupChatDataMap: Record<string, ChatMessageResponse[]> = {
  "1": [
    {
      messageId: 1,
      chatRoomId: 1,
      senderId: 101,
      senderName: "양준석(팀장)",
      senderProfileImage: ProfileImg,
      messageType: "TEXT",
      content: "그룹 채팅에 오신 걸 환영합니다!",
      reactions: [],
      replyTo: null,
      fileInfo: null,
      isDeleted: false,
      createdAt: "2025-07-20T10:01:00Z",
      updatedAt: "2025-07-20T10:01:00Z",
    },
    {
      messageId: 2,
      chatRoomId: 1,
      senderId: 101,
      senderName: "양준석(팀장)",
      senderProfileImage: ProfileImg,
      messageType: "TEXT",
      content: "간단한 자기소개 부탁드려요~",
      reactions: [],
      replyTo: null,
      fileInfo: null,
      isDeleted: false,
      createdAt: "2025-07-20T10:02:00Z",
      updatedAt: "2025-07-20T10:02:00Z",
    },
  ],
};
