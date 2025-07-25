import { useNavigate } from "react-router-dom";
import Logo from "../../assets/icons/Logo_Typo.svg?react";
import GR400_M from "../common/Btn_Static/Text/GR400_M";

export const MyExercise_None = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center w-full px-4 py-8">
      <div className="flex flex-col items-center gap-8">
        {/* 텍스트 */}
        <div className="flex flex-col gap-[0.5rem] text-center">
          <p className="header-h5">참여중인 운동이 없어요!</p>
          <p className="header-h5">운동을 찾아 배드민턴을 즐겨볼까요?</p>
        </div>

        {/* 로고 */}
        <Logo className="w-44 h-44" />

        {/* 버튼 */}
        <GR400_M
          label="모임 둘러보기"
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
};
