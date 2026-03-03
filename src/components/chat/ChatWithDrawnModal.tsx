import GY800_S from "../../components/common/Btn_Static/Text/GY800_S";
import Emoji from "@/assets/icons/emoji_surprise.svg";

interface ChatWithDrawnModalProps {
  onClose: () => void;
}

export const ChatWithDrawnModal = ({ onClose }: ChatWithDrawnModalProps) => {
  return (
    <div className="flex justify-center items-center fixed bottom-0 bg-black/20 -mx-4 w-full max-w-[444px] h-full z-50">
      <div className="w-86 h-45 p-3 bg-white shadow-ds200 border-round flex flex-col justify-end">
        {/* <ModalBar onClick={onClose} /> */}
        <div className="flex flex-col   gap-vertical-section-s">
          <div className="flex flex-col justify-center items-center gap-2">
            <img src={Emoji} alt="emogi_surprise" className="w-8 h-8" />
            <div className="header-h4 text-black">
              찾을 수 없는 사용 멤버입니다.
            </div>
          </div>

          {/* 버튼 */}
          <div className="w-full">
            <GY800_S label="확인" onClick={onClose} isChat={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
