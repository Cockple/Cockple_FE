// // 내 메달에 대화가 없는 경우 "대화 기록 추가하기" 버튼을 누르면 이동하는 화면입니다.
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/icons/Logo_Typo.svg?react";
import GR400_M from "../common/Btn_Static/Text/GR400_M";

export const MyMedal_None = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center w-full grow px-4 py-8">
      <div className="flex flex-col items-center gap-8">
        {/* 텍스트 */}
        <div className="flex flex-col gap-[0.5rem] text-center">
           <p className="header-h5">대회 기록이 없어요!</p>
           <p className="header-h5">대회 기록을 추가하고 메달을 가져볼까요?</p>
        </div>

        {/* 로고 */}
        <Logo className="w-44 h-44" />

        {/* 버튼 */}
        <GR400_M
         label="대회 기록 추가하기"
          onClick={() => navigate("/mypage/mymedal/add")}
        />
      </div>
    </div>
  );
};
