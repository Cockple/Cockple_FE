import Btn_Static from "../../../Btn_Static/Btn_Static";

//아이콘
import Dismiss from "../../../../../assets/icons/dismiss.svg";
import Reject from "../../../../../assets/icons/reject.svg";
import RD500_S from "../../../Btn_Static/Text/RD500_S";

interface RejectModalProps {
  onClose: () => void;
  onReject: () => void;
  memberName?: string; // 이름이 있을 경우만 커스터마이징
}

const RejectModal = ({ onClose, onReject, memberName }: RejectModalProps) => {
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
        <img src={Reject} alt="거절 아이콘" className="w-8 h-8 aspect-square" />
        {/* <p className="header-h4 text-black">모임 초대를 거절하시겠어요?</p> */}
        {memberName ? (
          <p className="header-h4 text-black">
            ‘{memberName}’님을 거절하시겠어요?
          </p>
        ) : (
          <p className="header-h4 text-black">모임 초대를 거절하시겠어요?</p>
        )}
        <p className="flex flex-col items-center body-rg-500">
          '거절하기'를 누르시면, 번복할 수 없으니
          <br />
          신중한 선택 부탁드려요.
        </p>
        <RD500_S label="거절하기" onClick={onReject} />
      </div>
    </div>
  );
};

export default RejectModal;
