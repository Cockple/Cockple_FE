export interface ModalConfig {
  title: string;
  messages: string[];
  confirmLabel: string;
  onConfirm?: () => void; 
}

export const getModalConfig = (
  status: string,
  isLeader: boolean | undefined,
  isMe: boolean,
  name?: string,
  customText?: Partial<ModalConfig>
): ModalConfig | null => {

  // 내가 리더이면서 본인인 경우 -> 이건 질문
  if (isLeader && isMe) {
    return {
      title: "본인이 모임장이라면 삭제할 수 없어요",
      messages: ["다른 리더를 지정한 후 삭제해 주세요."],
      confirmLabel: "확인",
      onConfirm: () => {},
    };
  }

 if (status === "Participating") {
  if (isLeader && !isMe) {
    return {
      title: customText?.title ?? `'${name}'님을 삭제하시겠어요?`,
      messages: customText?.messages ?? [
        "'삭제하기'를 누르시면, 번복할 수 없으니",
        "신중한 선택 부탁드려요.",
      ],
      confirmLabel: customText?.confirmLabel ?? "삭제하기",
      onConfirm: customText?.onConfirm,
    };
  } else if (isMe) {
    return {
      title: customText?.title ?? "운동을 취소하시겠어요?",
      messages: customText?.messages ?? [
        "'취소하기'를 누르시면, 번복할 수 없으니",
        "신중한 선택 부탁드려요.",
      ],
      confirmLabel: customText?.confirmLabel ?? "취소하기",
      onConfirm: customText?.onConfirm,
    };
  }
}


  if (status === "waiting") {
    if (isLeader && !isMe) {
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
