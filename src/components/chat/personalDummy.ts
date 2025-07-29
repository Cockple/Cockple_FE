import ChatImg from "../../assets/images/profile_Image.png";
import type { PersonalChatRoom } from "../../types/chat";

export const personalChats: PersonalChatRoom[] = [
  {
    chatRoomId: 100,
    chatRoomName: "김세익스피어",
    memberCount: 2,
    unreadCount: 12,
    lastMessage: {
      messageId: 1000,
      content: "내일 운동 참석 가능한 분들 손!",
      senderName: "김세익스피어",
      timestamp: "08:00 am",
      messageType: "TEXT",
    },
    otherMember: {
      memberId: 200,
      memberName: "김세익스피어",
      profileImageUrl: ChatImg,
    },
  },
];
