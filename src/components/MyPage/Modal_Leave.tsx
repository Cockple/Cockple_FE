import { useDeleteAccount } from "@/api/member/my";
import GY800_S from "../../components/common/Btn_Static/Text/GY800_S";
import RD500_S from "../../components/common/Btn_Static/Text/RD500_S";
import { ModalBar } from "../../components/common/system/ModalBar";
import Emoji from "@/assets/icons/emoji_surprise.svg";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/useUserStore";

interface ModalLeaveProps {
  onClose: () => void;
}

export const ModalLeave = ({ onClose }: ModalLeaveProps) => {
  const navigate = useNavigate();
  const { resetUser } = useUserStore();
  const onSucess = () => {
    navigate("/login");
    resetUser();
    localStorage.removeItem("accessToken");
  };
  const { mutate: handleDeleteAccount } = useDeleteAccount(onSucess);

  return (
    <div className="flex justify-center items-center fixed bottom-0 bg-black/20 -mx-4 w-full max-w-[444px] h-full z-50">
      <div className="w-86 h-63 p-3 bg-white shadow-ds200 border-round">
        <ModalBar onClick={onClose} />
        <div className="flex flex-col gap-vertical-section-s">
          <div className="flex flex-col justify-center items-center gap-2">
            <img src={Emoji} alt="emogi_surprise" className="w-8 h-8" />
            <div className="header-h4 text-black">정말 탈퇴하시겠어요?</div>
            <div className="flex flex-col gap-1 body-rg-500">
              <span>탈퇴 시 모든 정보는 복구가 불가능하며,</span>
              <span>가입된 모임에서도 자동으로 탈퇴됩니다.</span>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <RD500_S label="뒤로가기" onClick={onClose} />
            <GY800_S label="탈퇴하기" onClick={() => handleDeleteAccount()} />
          </div>
        </div>
      </div>
    </div>
  );
};
