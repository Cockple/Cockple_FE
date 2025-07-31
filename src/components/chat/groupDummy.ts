import type { GroupChatRoom } from "../../types/chat";

export const groupChats: GroupChatRoom[] = [
  {
    chatRoomId: 1,
    partyId: 101,
    partyName: "민턴콕콕",
    memberCount: 10,
    unreadCount: 10,
    lastMessage: {
      messageId: 1,
      content: "오늘 운동 오실래요???오늘 운동 오실래요???오늘 운동 오실래요??",
      senderName: "김철수",
      timestamp: "10:00 am",
      messageType: "TEXT",
    },
  },
  {
    chatRoomId: 2,
    partyId: 102,
    partyName: "민턴콱콱",
    memberCount: 10,
    unreadCount: 10,
    lastMessage: {
      messageId: 2,
      content: "오늘 운동 오실래요???오늘 운동 오실래요???오늘 운동 오실래요??",
      senderName: "이영희",
      timestamp: "10:00 am",
      messageType: "TEXT",
    },
  },
  {
    chatRoomId: 3,
    partyId: 103,
    partyName: "민턴콱콱!",
    memberCount: 10,
    unreadCount: 10,
    lastMessage: {
      messageId: 3,
      content: "오늘 운동 오실래요???오늘 운동 오실래요???오늘 운동 오실래요??",
      senderName: "박민수",
      timestamp: "10:00 am",
      messageType: "TEXT",
    },
  },
];
