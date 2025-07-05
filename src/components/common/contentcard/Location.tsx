import { useState, useEffect } from "react"; 
import CheckCircled from "../../../assets/icons/check_circled.svg?react";
import Check_circled_filled from "../../../assets/icons/check_circled_filled.svg?react";

interface LocationProps {
  mainAddress: string;
  subAddress: string;
  disabled?: boolean; 
  initialClicked?: boolean; 
  onClick?: (clicked: boolean) => void;
}

export const Location = ({
  mainAddress,
  subAddress,
  disabled = false,
  initialClicked = false,
  onClick,
}: LocationProps) => {
  const [isPressing, setIsPressing] = useState(false);
  const [isClicked, setIsClicked] = useState(initialClicked);

  useEffect(() => {
    setIsClicked(initialClicked);
  }, [initialClicked]);

  const handlePressStart = () => {
    if (!disabled) setIsPressing(true);
  };
  const handlePressEnd = () => setIsPressing(false);

  const handleClick = () => {
    if (!disabled) {
      const newClickedState = !isClicked;
      setIsClicked(newClickedState);
      onClick?.(newClickedState); 
    }
  };

  const baseClasses = "w-[21.4375rem] h-[4.5rem] rounded-[0.75rem] flex items-center justify-between px-[1rem] py-[0.75rem] transition-colors duration-150 border";

  let bgClass = "bg-white";
  let borderClass = "border-[#E4E7EA]";
  let textColor = "text-black";
  let icon = <CheckCircled className="w-[1.5rem] h-[1.5rem]" />;
  let cursorStyle = "cursor-pointer";

  // disabled 상태 처리
  if (disabled) {
    bgClass = "bg-white"; 
    borderClass = "border-[#E4E7EA]"; 
    textColor = "text-[#C0C4CD]"; 
    icon = <CheckCircled className="w-[1.5rem] h-[1.5rem]" />; 
    cursorStyle = "cursor-not-allowed pointer-events-none"; 
  } else {
    // 활성화 상태에서 pressing 및 clicked 로직 
    if (isPressing) {
      bgClass = "bg-[#F4F5F6]"; 
    } else {
      bgClass = "bg-white"; 
    }

    if (isClicked) {
      icon = <Check_circled_filled className="w-[1.5rem] h-[1.5rem]" />; 
    } else {
      icon = <CheckCircled className="w-[1.5rem] h-[1.5rem]" />; 
    }
  }

  return (
    <div
      className={`${baseClasses} ${bgClass} ${borderClass} ${cursorStyle}`}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={handleClick}
    >
    <div className={`w-[16.9375rem] h-[3rem] flex flex-col justify-center items-start overflow-hidden ${textColor}`}>
      <p className="body-md-500 truncate w-full" title={mainAddress}>
        {mainAddress}
      </p>
      <p className="body-rg-500 truncate w-full" title={subAddress}>
        {subAddress}
      </p>
    </div>
    {icon}
    </div>
  );
};