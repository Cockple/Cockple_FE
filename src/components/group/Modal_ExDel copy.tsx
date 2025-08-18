import Dismiss from "../../assets/icons/dismiss.svg?react";
import Btn_Static from "../common/Btn_Static/Btn_Static";
import Del_rd from "../../assets/icons/delete-rd-500.svg?react";
interface ModalCautionProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const Modal_ExDel  = ({ onConfirm, onCancel }: ModalCautionProps) => {
  return (
    <div className="bg-white w-[21.4375rem] h-[15.75rem] flex flex-col p-3 shadow-ds300 rounded-2xl">
      <div className="flex justify-end mb-2">
        <Dismiss className="w-8 h-8 cursor-pointer" onClick={onCancel} />
      </div>

      <div className="flex flex-col items-center text-center gap-1 mb-4 leading-snug">
        <Del_rd className="w-8 h-8" />
        <p className="header-h4">정말 모임을 삭제하시겠어요?</p>
        <p className="body-rg-500">모임에 대한 모든 정보가 사라져요.</p>
        <p className="body-rg-500">‘삭제하기’를 누르시면, 번복할 수 없으니</p>
        <p className="body-rg-500">신중한 선택 부탁드려요.</p>
      </div>

      <div className="flex justify-center gap-2">
        <Btn_Static
          kind="RD500"
          size="S"
          label="삭제하기"
          textColor="text-[#F62D2D]"
          justify="justify-center"
          onClick={onConfirm}
        />
        <Btn_Static
          kind="GY800"
          size="S"
          label="유지하기"
          textColor="text-black"
          justify="justify-center"
          onClick={onCancel}
        />
      </div>
    </div>
  );
};
