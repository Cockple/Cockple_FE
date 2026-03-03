import RD500_S from "@/components/common/Btn_Static/Text/RD500_S";
import Emoji from "@/assets/icons/emoji_surprise.svg";

interface ChatOwnerWithDrawnModalProps {
  onClose: () => void;
  owner: string;
}

export const ChatOwnerWithDrawnModal = ({
  onClose,
  owner,
}: ChatOwnerWithDrawnModalProps) => {
  return (
    <div className="flex justify-center items-center fixed bottom-0 bg-black/20 -mx-4 w-full max-w-[444px] h-full z-50">
      <div className="w-86 h-58 p-3 bg-white shadow-ds200 border-round flex flex-col justify-end">
        {/* <ModalBar onClick={onClose} /> */}
        <div className="flex flex-col   gap-vertical-section-s">
          <div className="flex flex-col justify-center items-center gap-2">
            <img src={Emoji} alt="emogi_surprise" className="w-8 h-8" />
            <div className="header-h4 text-black">탈퇴가 불가능 합니다.</div>
            <div className="flex flex-col gap-1 body-rg-500">
              <span>{`${owner}  콕플 탈퇴가 불가능합니다.`}</span>
              <span>모임 멤버들이 기다리고있어요.</span>
            </div>
          </div>

          {/* 버튼 */}
          <div className="w-full">
            <RD500_S label="확인" onClick={onClose} isChat={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
