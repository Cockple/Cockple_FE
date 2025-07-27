import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowRight from "../../../assets/icons/arrow_right.svg?react";

interface LocationListProps {
  id: number;
  isMainAddr: string;
  streetAddr: string;
  x?: string;
  y?: string;
  showOnMapText?: string;
  disabled?: boolean;
  initialClicked?: boolean;
  onClick?: (id: number, clicked: boolean) => void;
}

export const LocationList = ({
  id,
  isMainAddr,
  streetAddr,
  x,
  y,
  showOnMapText = "지도에서 보기",
  disabled = false,
  initialClicked = false,
  onClick,
}: LocationListProps) => {
  const navigate = useNavigate();
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

  const handleCardClick = () => {
    if (!disabled) {
      const newClickedState = !isClicked;
      setIsClicked(newClickedState);
      onClick?.(id, newClickedState);
    }
  };

  const handleViewOnMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      // navigate("/mypage/edit/location/address");
      navigate(
        `/location/map?x=${x}&y=${y}&place=${encodeURIComponent(isMainAddr)}&address=${encodeURIComponent(streetAddr)}`,
      );
      console.log(`지도에서 보기 클릭: ${isMainAddr}, ${streetAddr}`);
    }
  };

  const baseClasses =
    "w-[21.4375rem] h-[6.75rem] p-[0.75rem] rounded-[0.75rem] flex flex-col gap-[0.5rem] transition-colors duration-150";

  let borderClass = "";
  let bgClass = "";
  let textColor = "text-black";
  let cursorStyle = "cursor-pointer";

  if (disabled) {
    borderClass = "border border-[#E4E7EA]";
    bgClass = "bg-white";
    textColor = "text-[#C0C4CD]";
    cursorStyle = "cursor-not-allowed pointer-events-none";
  } else {
    if (isClicked) {
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
      onClick={handleCardClick}
      className={`${baseClasses} ${borderClass} ${bgClass} ${cursorStyle}`}
    >
      <div className="flex flex-col items-start w-full overflow-hidden">
        <p
          className={`body-md-500 truncate w-full text-left ${textColor}`}
          title={isMainAddr}
        >
          {isMainAddr}
        </p>
        <p
          className={`body-rg-500 truncate w-full text-left ${textColor}`}
          title={streetAddr}
        >
          {streetAddr}
        </p>
      </div>

      <div className="flex justify-end w-full cursor-pointer">
        <div
          className="w-[6.6875rem] h-[1.75rem] flex items-center gap-[0.625rem] overflow-hidden"
          onClick={handleViewOnMapClick}
        >
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
