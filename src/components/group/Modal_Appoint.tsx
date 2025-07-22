import StarYE from "../../assets/icons/star_filled_YE.svg?react";
import Dismiss from "../../assets/icons/dismiss.svg?react";
import GY800_S from "../common/Btn_Static/Text/GY800_S";

interface ModalAppointProps {
  onConfirm: () => void;
  onCancel: () => void;
};

export const Modal_Appoint = ({
  onConfirm,
  onCancel,
}: ModalAppointProps) => {

  return (
    <div className="bg-white w-[21.4375rem] h-[14.25rem] flex flex-col p-3 shadow-ds300 rounded-2xl">
    
        <div className="flex justify-end mb-2">
            <Dismiss className="w-8 h-8" onClick={onCancel} />
        </div>

        <div className="flex flex-col items-center text-center gap-1 mb-4 leading-snug">
            <StarYE className="w-8 h-8" />
            <p className="header-h4">부모임장으로 지정하시겠어요?</p>
            <p className="body-rg-500">'지정하기'를 누르시면, 부모임장에게</p>
            <p className="body-rg-500">모임 운영의 전반적인 권한이 부여돼요.</p>
        </div>

        <div className="flex justify-center">
            <GY800_S
            label="지정하기"
            onClick={onConfirm} 
            />
        </div>
    </div>
  );
};
