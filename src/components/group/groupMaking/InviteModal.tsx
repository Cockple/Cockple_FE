//아이콘
import Dismiss from "../../../assets/icons/dismiss.svg";
import Message from "../../../assets/icons/message.svg";
import Btn_Static from "../../common/Btn_Static/Btn_Static";
import GY800_S from "../../common/Btn_Static/Text/GY800_S";

interface InviteModalProps {
  onClose: () => void;
  onInvite: () => void;
}

const InviteModal = ({ onClose, onInvite }: InviteModalProps) => {
  return (
    <div className="flex flex-col bg-white border-round p-3 w-[21.4375rem] shadow-ds300">
      <div className="flex w-[19.9375rem] justify-between items-center">
        <div className="w-4 h-4 shrink-0 aspect-square"></div>
        <Btn_Static
          iconMap={{
            disabled: Dismiss,
            default: Dismiss,
            pressing: Dismiss,
            clicked: Dismiss,
          }}
          bgColor="bg-white"
          width="w-6"
          height="h-6"
          onClick={onClose}
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <img
          src={Message}
          alt="승인 아이콘"
          className="w-8 h-8 aspect-square"
        />
        <p className="header-h4 text-black">멤버 초대를 보내시겠어요?</p>
        <p className="flex flex-col items-center body-rg-500">
          초대받은 분께서 초대를 수락해주시면
          <br />
          바로 모임 멤버로 추가되요
        </p>
        <GY800_S label="초대보내기" onClick={onInvite} />
      </div>
    </div>
  );
};

export default InviteModal;
