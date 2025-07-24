import Btn_Static from "../common/Btn_Static/Btn_Static";

//아이콘
import Dismiss from "../../assets/icons/dismiss.svg";
import Delete from "../../assets/icons/delete-rd-500.svg";
import RD500_S from "../common/Btn_Static/Text/RD500_S";
import GY800_S from "../common/Btn_Static/Text/GY800_S";

interface DeleteGroupModalProps {
  onClose: () => void;
  onDelete: () => void;
  memberName?: string; // 이름이 있을 경우만 커스터마이징
}
const DeleteGroupModal = ({
  onClose,
  onDelete,
  memberName,
}: DeleteGroupModalProps) => {
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
        <img src={Delete} alt="삭제 아이콘" className="w-8 h-8 aspect-square" />
        {/* <p className="header-h4 text-black">모임 초대를 거절하시겠어요?</p> */}
        {memberName ? (
          <p className="header-h4 text-black">
            ‘{memberName}’님을 거절하시겠어요?
          </p>
        ) : (
          <p className="header-h4 text-black">정말 모임을 삭제하시겠어요?</p>
        )}
        <p className="flex flex-col items-center body-rg-500">
          모임에 대한 모든 정보가 사라져요.
          <br />
          '삭제하기'를 누르시면, 번복할 수 없으니
          <br />
          신중한 선택 부탁드려요.
        </p>
        <div className="flex gap-[0.5625rem] self-stretch">
          <RD500_S label="삭제하기" onClick={onDelete} />
          <GY800_S label="유지하기" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default DeleteGroupModal;
