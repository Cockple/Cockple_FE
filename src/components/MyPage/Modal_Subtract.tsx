import SubtractPerson from "../../assets/icons/subtract_person.svg?react";
import Dismiss from "../../assets/icons/dismiss.svg?react";
import Btn_Static from "../common/Btn_Static/Btn_Static";

export const Modal_Subtract = () => {
  return (
    <div className="bg-white w-[21.4375rem] h-[14.25rem] flex flex-col p-3 shadow-ds300 rounded-2xl">
    
        <div className="flex justify-end mb-2">
            <Dismiss className="w-8 h-8" />
        </div>

        <div className="flex flex-col items-center text-center gap-1 mb-4 leading-snug">
            <SubtractPerson className="w-8 h-8" />
            <p className="header-h4">운동을 취소하시겠어요?</p>
            <p className="body-rg-500">'취소하기'를 누르시면, 번복할 수 없으니</p>
            <p className="body-rg-500">신중한 선택 부탁드려요.</p>
        </div>

        <div className="flex justify-center">
            <Btn_Static
            kind="RD500"
            size="S"
            label="취소하기"
            textColor="text-[#F62D2D]"
            justify="justify-center"
            />
        </div>
    </div>
  );
};
