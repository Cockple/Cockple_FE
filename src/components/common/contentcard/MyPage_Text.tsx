import { useState } from "react";
import Arrow_right_GY from "../../../assets/icons/arrow_right_GY.svg?react"; 
import Arrow_right from "../../../assets/icons/arrow_right.svg?react";

// props 타입 정의
interface MyPageProps {
  textLabel?: string; 
  numberValue?: number; 
  disabled?: boolean; 
  onClick: () => void;
}

export const MyPage_Text = ({
  textLabel = "Text",
  numberValue,
  disabled = false,
  onClick,
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
  const handleClick = () => {
      if (!disabled && onClick) {
        onClick();
      }
  };
  const bgColor = disabled ? "bg-white" : (isPressing ? "bg-[#F4F5F6]" : "bg-white");
  const textColor = disabled ? "text-[#C0C4CD]" : "text-black"; 
  const numberColor = disabled ? "text-[#C0C4CD]" : "text-[#0A7456]"; 
  const cursorStyle = disabled ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"; 
  const ArrowIcon = disabled ? Arrow_right_GY : Arrow_right;

  return (
    <div
      className={`w-[21.4375rem] h-[3rem] px-[0.75rem] py-[1rem] shadow-ds100 rounded-[1rem] flex items-center justify-between ${bgColor} ${cursorStyle} transition-colors duration-150`}
      onClick={handleClick}
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
  );
};
