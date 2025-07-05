import { useState } from "react";
import Arrow_right_GY from "../../../assets/icons/arrow_right_GY.svg?react"; 
import Arrow_right from "../../../assets/icons/arrow_right.svg?react";

// props 타입 정의
interface MyPageProps {
  textLabel?: string; 
  numberValue?: number; 
  totalMedalsCount?: number; 
  goldMedals?: number; 
  silverMedals?: number; 
  bronzeMedals?: number; 
  disabled?: boolean; 
}

export const MyPage = ({
  textLabel = "Text",
  numberValue = 0,
  totalMedalsCount = 0,
  goldMedals = 0,
  silverMedals = 0,
  bronzeMedals = 0,
  disabled = false,
}: MyPageProps) => {
  const [isPressing, setIsPressing] = useState(false);

  const handlePressStart = () => {
    if (!disabled) {
      setIsPressing(true);
    }
  };
  const handlePressEnd = () => {
    setIsPressing(false);
  };

  const bgColor = disabled ? "bg-white" : (isPressing ? "bg-[#F4F5F6]" : "bg-white");
  const textColor = disabled ? "text-[#C0C4CD]" : "text-black"; 
  const numberColor = disabled ? "text-[#C0C4CD]" : "text-[#0A7456]"; 
  const cursorStyle = disabled ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"; 
  const ArrowIcon = disabled ? Arrow_right_GY : Arrow_right;

  return (
    <div className="flex flex-col gap-[1rem]"> 
      <div
        className={`w-[21.4375rem] h-[3rem] px-[0.75rem] py-[1rem] shadow-ds100 rounded-[1rem] flex items-center justify-between ${bgColor} ${cursorStyle} transition-colors duration-150`}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <div className="flex items-center gap-[0.5rem]"> 
          <p className={`header-h5 ${textColor}`}>{textLabel}</p> 
          <p className={`header-h5 ${numberColor}`}>{numberValue}</p>
        </div>
        <ArrowIcon className={`w-[1rem] h-[1rem] ${disabled ? 'text-[#C0C4CD]' : 'text-black'}`} />
      </div>

      {/* 내 메달 섹션 */}
      <div className="w-[21.4375rem] h-[13.5rem] px-[1rem] py-[0.75rem] shadow-ds100 rounded-[1rem] flex flex-col justify-between gap-[1rem]"> 
        <div className="flex items-center justify-between w-full">
          <p className="header-h5">내 메달</p>

        <ArrowIcon className={`w-[1rem] h-[1rem] ${disabled ? 'text-[#C0C4CD]' : 'text-black'}`} />
        </div>

        <div className="w-[13.5rem] h-[1.75rem] shadow-ds200-gr rounded-[0.5rem] mx-auto flex items-center justify-center"> 
          <p className="body-rg-500 text-center">
            지금까지 {totalMedalsCount}개의 메달을 모았어요
          </p> 
        </div>

        <div className="flex flex-row justify-center gap-[1.25rem]"> 
          {/* 금메달 */}
          <div className="flex flex-col items-center gap-[0.5rem]"> 
            <div className="w-[3.75rem] h-[3.75rem] bg-[#E4E7EA] rounded-[0.5rem]" /> 

            <div className="flex flex-row items-center justify-center gap-[0.25rem]"> 
              <p className="body-rg-500 text-center">금메달</p>
              <p className="body-rg-500 text-center">{goldMedals}</p>
            </div>
          </div>

          {/* 은메달 */}
          <div className="flex flex-col items-center gap-[0.5rem]">
            <div className="w-[3.75rem] h-[3.75rem] bg-[#E4E7EA] rounded-[0.5rem]" />

            <div className="flex flex-row items-center justify-center gap-[0.25rem]">
              <p className="body-rg-500 text-center">은메달</p>
              <p className="body-rg-500 text-center">{silverMedals}</p> 
            </div>
          </div>

          {/* 동메달 */}
          <div className="flex flex-col items-center gap-[0.5rem]">
            <div className="w-[3.75rem] h-[3.75rem] bg-[#E4E7EA] rounded-[0.5rem]" />

            <div className="flex flex-row items-center justify-center gap-[0.25rem]">
              <p className="body-rg-500 text-center">동메달</p>
              <p className="body-rg-500 text-center">{bronzeMedals}</p> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};