import DeleteRD500 from "../../assets/icons/delete-rd-500.svg?react";
import Dismiss from "../../assets/icons/dismiss.svg?react";
import Btn_Static from "../common/Btn_Static/Btn_Static";

interface ModalCautionNameProps {
  // onConfirm: () => void;
  onCancel: () => void;
}

export const Modal_Caution_Name = ({  onCancel }: ModalCautionNameProps) => {
  return (
    <div className="bg-white w-[21.4375rem] h-[10.75rem] flex flex-col p-3 shadow-ds300 rounded-2xl">
    
        <div className="flex justify-end mb-2">
            <Dismiss className="w-8 h-8" onClick={onCancel} />
        </div>

        <div className="flex flex-col items-center text-center gap-1 mb-4 leading-snug">
            <DeleteRD500 className="w-8 h-8" />
            <p className="body-rg-500">대회명을 입력해주세 요</p>
        </div>

        <div className="flex justify-center">
         <Btn_Static
          kind="GY800"
          size="S"
          label="계속 작성하기"
          textColor="text-black"
          justify="justify-center"
          onClick={onCancel}
        />
        </div>
    </div>
  );
};
