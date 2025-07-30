import EmojiSurprise from "../../assets/icons/emoji_surprise.svg?react";
import Dismiss from "../../assets/icons/dismiss.svg?react";
import Btn_Static from "../../components/common/Btn_Static/Btn_Static";

interface ModalCautionProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  location?: string;
  alertText?: string;
}

export const Modal_Caution = ({
  onConfirm,
  onCancel,
  title = "모임 만들기가 이루어지지 않았어요.",
  location = "마이페이지로",
  alertText = "계속 수정하기",
}: ModalCautionProps) => {
  return (
    <div className="bg-white w-[21.4375rem] h-[15.75rem] flex flex-col p-3 shadow-ds300 rounded-2xl">
      <div className="flex justify-end mb-2">
        <Dismiss className="w-8 h-8 cursor-pointer" onClick={onCancel} />
      </div>

      <div className="flex flex-col items-center text-center gap-1 mb-4 leading-snug">
        <EmojiSurprise className="w-8 h-8" />
        <p className="header-h4">정말 떠나시겠어요?</p>
        <p className="body-rg-500">{title}</p>
        <p className="body-rg-500">
          ‘뒤로가기’를 선택하시면, {location} 이동하며
        </p>
        <p className="body-rg-500">변경 사항은 저장되지 않아요.</p>
      </div>

      <div className="flex justify-center gap-2">
        <Btn_Static
          kind="RD500"
          size="S"
          label="뒤로가기"
          textColor="text-[#F62D2D]"
          justify="justify-center"
          onClick={onConfirm}
        />
        <Btn_Static
          kind="GY800"
          size="S"
          label={alertText}
          textColor="text-black"
          justify="justify-center"
          onClick={onCancel}
        />
      </div>
    </div>
  );
};
