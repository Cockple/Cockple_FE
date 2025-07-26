export interface ModalConfig {
  title: string;
  messages: string[];
  confirmLabel: string;
}

export const getModalConfig = (
  status: string,
  isLeader: boolean,
  isMe: boolean,
  customText?: Partial<ModalConfig>  
): ModalConfig | null => {
  if (status === "Participating") {
    if (isLeader) {
      return {
        title: "참여자를 삭제하시겠어요?",
        messages: [
          "삭제한 참여자는 다시 초대하거나",
          "신청을 받아야만 다시 참여할 수 있어요.",
        ],
        confirmLabel: "삭제하기",
        ...customText,
      };
    } else if (isMe) {
      return {
        title: "운동을 취소하시겠어요?",
        messages: [
          "'취소하기'를 누르시면, 번복할 수 없으니",
          "신중한 선택 부탁드려요.",
        ],
        confirmLabel: "취소하기",
        ...customText,
      };
    }
  }

  if (status === "waiting") {
    if (isLeader) {
      return {
        title: "가입 신청을 취소하시겠어요?",
        messages: [
          "이 사용자의 신청을 취소하면",
          "다시 신청해야만 참여할 수 있어요.",
        ],
        confirmLabel: "취소하기",
        ...customText,
      };
    } else if (isMe) {
      return {
        title: "가입 신청을 취소하시겠어요?",
        messages: ["가입 신청을 취소하면 다시 신청해야 해요."],
        confirmLabel: "신청 취소",
        ...customText,
      };
    }
  }

  return null;
};
