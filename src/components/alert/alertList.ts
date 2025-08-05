// 알림 더미데이터

import type { AlertItem } from "../../types/alert";

export const alertList: AlertItem[] = [
  {
    notificationId: 1,
    partyId: 1,
    title: "민턴클로버",
    content: "07.03 (월) 운동이 수정되었습니다.",
    type: "change",
    isRead: false,
    imgKey: "src/assets/images/kitty.png",
    data: {
      exerciseId: 101,
      exerciseDate: "2025-07-03",
    },
  },
  {
    notificationId: 2,
    partyId: 2,
    title: "민턴클로버",
    content: "07.03 (월) 운동이 삭제되었어요!",
    type: "simple",
    isRead: false,
    imgKey: "src/assets/images/kitty.png",
  },
  {
    notificationId: 3,
    partyId: 103,
    title: "새로운 모임",
    content: "'민턴클로버' 모임에 초대받았습니다.",
    type: "invite",
    isRead: false,
    imgKey: "src/assets/images/kitty.png",
  },
  {
    notificationId: 4,
    partyId: 104,
    title: "민턴클로버",
    content: "모임 가입이 승인되었어요!",
    type: "change",
    isRead: false,
    imgKey: "src/assets/images/kitty.png",
  },
  {
    notificationId: 5,
    partyId: 105,
    title: "민턴클로버",
    content: "운동 참석으로 변경되었어요!",
    type: "change",
    isRead: false,
    imgKey: "src/assets/images/kitty.png",
    data: {
      exerciseId: 105,
      exerciseDate: "2025-07-06",
    },
  },
  {
    notificationId: 6,
    partyId: 106,
    title: "민턴클로버",
    content: "모임이 삭제되었어요!",
    type: "simple",
    isRead: false,
    imgKey: "src/assets/images/kitty.png",
  },
  {
    notificationId: 7,
    partyId: 107,
    title: "민턴클로버",
    content: "모임 정보가 수정되었어요!",
    type: "change",
    isRead: false,
    imgKey: "src/assets/images/kitty.png",
  },
];
