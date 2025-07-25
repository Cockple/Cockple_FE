import Btn_Static from "../../../Btn_Static/Btn_Static";

//아이콘
import Dismiss from "../../../../../assets/icons/dismiss.svg";
import Success from "../../../../../assets/icons/success.svg";
import GR600_S from "../../../Btn_Static/Text/GR600_S";

interface ApproveModalProps {
  onClose: () => void;
  onApprove: () => void;
}

const ApproveModal = ({ onClose, onApprove }: ApproveModalProps) => {
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
          src={Success}
          alt="승인 아이콘"
          className="w-8 h-8 aspect-square"
        />
        <p className="header-h4 text-black">모임 초대를 승인하시겠어요?</p>
        <p className="flex flex-col items-center body-rg-500">
          모임 초대를 승인하고
          <br />
          다같이 배드민턴 모임을 즐겨봐요!
        </p>
        <GR600_S label="승인하기" onClick={onApprove} />
      </div>
    </div>
  );
};

export default ApproveModal;
