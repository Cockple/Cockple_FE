import { useState } from "react";
import Arrow_right_GY from "../../../assets/icons/arrow_right_GY.svg?react"; 
import Arrow_right from "../../../assets/icons/arrow_right.svg?react";
// 내 메달만 볼 수 있는 컴포넌트로 수정했습니다.
// 내 메달이 있는 경우 내 메달 클릭 시 화면 전환
interface MyPageProps {
  myMedalTotal?: number;
  goldCount?: number;
  silverCount?: number;
  bronzeCount?: number;
  disabled?: boolean; 
  onClick?: () => void;
}

export const MyPage_Medal = ({
  myMedalTotal = 0,
  goldCount = 0,
  silverCount = 0,
  bronzeCount = 0,
  disabled = false,
  onClick,
}: MyPageProps) => {
  const [isPressing, setIsPressing] = useState(false);
  const ArrowIcon = disabled ? Arrow_right_GY : Arrow_right;

  return (
    <div className="flex flex-col gap-[1rem]"> 
      <div
        className={`w-[21.4375rem] h-[13.5rem] px-[1rem] py-[0.75rem] shadow-ds100 rounded-[1rem] flex flex-col justify-between gap-[1rem]
          ${disabled ? "cursor-default" : "cursor-pointer"}`}
        onClick={() => {
          if (!disabled && onClick) onClick();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!disabled && onClick && (e.key === "Enter" || e.key === " ")) {
            onClick();
          }
        }}
      >
        <div className="flex items-center justify-between w-full">
          <p className="header-h5">내 메달</p>
          <ArrowIcon className={`w-[1rem] h-[1rem] ${disabled ? "text-[#C0C4CD]" : "text-black"}`} />
        </div>

        <div className="w-[13.5rem] h-[1.75rem] shadow-ds200-gr rounded-[0.5rem] mx-auto flex items-center justify-center"> 
          <p className="body-rg-500 text-center">
            지금까지 {myMedalTotal}개의 메달을 모았어요
          </p> 
        </div>

        <div className="flex flex-row justify-center gap-[1.25rem]"> 
          {/* 금메달 */}
          <div className="flex flex-col items-center gap-[0.5rem]"> 
            <div className="w-[3.75rem] h-[3.75rem] bg-[#E4E7EA] rounded-[0.5rem]" /> 
            <div className="flex flex-row items-center justify-center gap-[0.25rem]"> 
              <p className="body-rg-500 text-center">금메달</p>
              <p className="body-rg-500 text-center">{goldCount}</p>
            </div>
          </div>

          {/* 은메달 */}
          <div className="flex flex-col items-center gap-[0.5rem]">
            <div className="w-[3.75rem] h-[3.75rem] bg-[#E4E7EA] rounded-[0.5rem]" />
            <div className="flex flex-row items-center justify-center gap-[0.25rem]">
              <p className="body-rg-500 text-center">은메달</p>
              <p className="body-rg-500 text-center">{silverCount}</p> 
            </div>
          </div>

          {/* 동메달 */}
          <div className="flex flex-col items-center gap-[0.5rem]">
            <div className="w-[3.75rem] h-[3.75rem] bg-[#E4E7EA] rounded-[0.5rem]" />
            <div className="flex flex-row items-center justify-center gap-[0.25rem]">
              <p className="body-rg-500 text-center">동메달</p>
              <p className="body-rg-500 text-center">{bronzeCount}</p> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
