import StarYE from "../../assets/icons/star_filled_YE.svg?react";
import Dismiss from "../../assets/icons/dismiss.svg?react";
import GY800_S from "../common/Btn_Static/Text/GY800_S";

export type AppointModalType = "appoint" | "cancel" | "change";

interface ModalAppointProps {
  onConfirm: () => void;
  onCancel: () => void;
  modalType: AppointModalType; 
}

export const Modal_Appoint = ({
  onConfirm,
  onCancel,
  modalType,
}: ModalAppointProps) => {

  // 모드별 텍스트 설정
  const content = {
    appoint: {
      title: "부모임장으로 지정하시겠어요?",
      desc1: "'지정하기'를 누르시면, 부모임장에게",
      desc2: "모임 운영의 전반적인 권한이 부여돼요.",
      btn: "지정하기",
    },
    cancel: {
      title: "부모임장을 취소하시겠어요?",
      desc1: "모임 운영의 전반적인 권한이 취소돼요.",
      desc2: "", 
      btn: "지정 취소하기",
    },
    change: {
      title: "부모임장을 변경하시겠어요?",
      desc1: "부모임장은 1명만 가능합니다.",
      desc2: "",
      btn: "변경하기",
    }
  }[modalType];

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onCancel}
    >
      <div 
        className="bg-white w-[21.4375rem] h-[14.25rem] flex flex-col p-3 shadow-ds300 rounded-2xl"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-end mb-2">
          <Dismiss className="w-8 h-8 cursor-pointer" onClick={onCancel} />
        </div>

        <div className="flex flex-col items-center text-center gap-1 mb-4 leading-snug">
          <StarYE className="w-8 h-8" />
          <p className="header-h4">{content.title}</p>
          <div className="flex flex-col mt-1">
            <p className="body-rg-500">{content.desc1}</p>
            {content.desc2 && <p className="body-rg-500">{content.desc2}</p>}
          </div>
        </div>

        <div className="flex justify-center mt-auto mb-2">
          <GY800_S
            label={content.btn}
            onClick={onConfirm} 
          />
        </div>
      </div>
    </div>
  );
};