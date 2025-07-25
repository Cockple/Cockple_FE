export type AlertType = "invite" | "change" | "simple";

export interface AlertItem {
  id: number;
  type: AlertType;
  groupName: string;
  alertText: string;
  imageSrc: string;
}

export const alertList: AlertItem[] = [
  {
    id: 1,
    type: "invite",
    groupName: "민턴클로버",
    alertText: "‘민턴클로버’ 모임에 초대받았습니다.",
    imageSrc: "src/assets/images/image.png",
  },
  {
    id: 2,
    type: "change",
    groupName: "민턴클로버",
    alertText: "07.03 (월) 운동이 수정되었습니다.",
    imageSrc: "src/assets/images/image.png",
  },
  {
    id: 3,
    type: "simple",
    groupName: "민턴클로버",
    alertText: "07.03 (월) 운동이 삭제되었어요!",
    imageSrc: "src/assets/images/image.png",
  },
  {
    id: 4,
    type: "change",
    groupName: "민턴클로버",
    alertText: "운동 참석으로 변경되었어요!",
    imageSrc: "src/assets/images/image.png",
  },
  {
    id: 5,
    type: "simple",
    groupName: "민턴클로버",
    alertText: "모임이 삭제되었어요!",
    imageSrc: "src/assets/images/image.png",
  },
];
