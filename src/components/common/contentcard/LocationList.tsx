import { useState, useEffect } from "react";
import ArrowRight from "../../../assets/icons/Arrow_right.svg?react";

interface LocationListProps {
  mainAddress: string;
  subAddress: string;
  showOnMapText?: string; 
  disabled?: boolean; 
  initialClicked?: boolean; 
  onClick?: (clicked: boolean) => void; 
}

export const LocationList = ({
  mainAddress,
  subAddress,
  showOnMapText = "지도에서 보기", 
  disabled = false,
  initialClicked = false,
  onClick,
}: LocationListProps) => {
  const [isPressing, setIsPressing] = useState(false);
  const [isClicked, setIsClicked] = useState(initialClicked); 

  useEffect(() => {
    setIsClicked(initialClicked);
  }, [initialClicked]);

  const handlePressStart = () => {
    if (!disabled) setIsPressing(true);
  };
  const handlePressEnd = () => {
    setIsPressing(false);
  };
  const handleClick = () => {
    if (!disabled) {
      const newClickedState = !isClicked;
      setIsClicked(newClickedState);
      onClick?.(newClickedState); 
    }
  };

  const baseClasses = "w-[21.4375rem] h-[6.75rem] p-[0.75rem] rounded-[0.75rem] flex flex-col gap-[0.5rem] transition-colors duration-150";

  let borderClass = "";
  let bgClass = "";
  let textColor = "text-black"; 
  let cursorStyle = "cursor-pointer"; 

  if (disabled) {
    // disabled 상태일 때의 스타일
    borderClass = "border border-[#E4E7EA]"; 
    bgClass = "bg-white"; 
    textColor = "text-[#C0C4CD]"; 
    cursorStyle = "cursor-not-allowed pointer-events-none"; 
  } else {
    if (isPressing || isClicked) {
      borderClass = "border border-[#1ABB65]"; 
    } else {
      borderClass = "border border-transparent"; 
    }

    if (isPressing) {
      bgClass = "bg-[#F4F5F6]"; 
    } else {
      bgClass = "bg-white"; 
    }
  }

  return (
    <div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={handleClick}
      className={`${baseClasses} ${borderClass} ${bgClass} ${cursorStyle}`}
    >
     <div className="flex flex-col items-start w-full overflow-hidden">
        <p className={`body-md-500 truncate w-full ${textColor}`} title={mainAddress}>
          {mainAddress}
        </p> 
        <p className={`body-rg-500 truncate w-full ${textColor}`} title={subAddress}>
          {subAddress}
        </p>
      </div>

      <div className="flex justify-end w-full">
        <div className="w-[6.6875rem] h-[1.75rem] flex items-center gap-[0.625rem] overflow-hidden">
          <p
            className={`body-rg-400 truncate ${textColor} w-full`}
            title={showOnMapText}
          >
            {showOnMapText}
          </p>
          <ArrowRight
            className={`w-[1rem] h-[1rem] shrink-0 ${
              disabled ? "text-[#C0C4CD]" : "text-black"
            }`}
          />
        </div>
      </div>

    </div>
  );
};