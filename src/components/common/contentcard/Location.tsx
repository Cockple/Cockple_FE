import { useState, useEffect } from "react";
import CheckCircled from "../../../assets/icons/check_circled.svg?react";
import Check_circled_filled from "../../../assets/icons/check_circled_filled.svg?react";
import Dismiss from "../../../assets/icons/dismiss.svg?react";
import Dismiss_GY from "../../../assets/icons/dismiss_GY.svg?react";
import clsx from "clsx";

interface LocationProps {
  isMainAddr: string;
  streetAddr: string;
  disabled?: boolean;
  initialClicked?: boolean;
  editMode?: boolean;
  onClick?: (clicked: boolean) => void;
  onDelete?: () => void;
  className?: string;
}

export const Location = ({
  isMainAddr,
  streetAddr,
  disabled = false,
  initialClicked = false,
  editMode = false,
  onClick,
  onDelete,
  className,
}: LocationProps) => {
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

  const baseClasses =
    "w-[21.4375rem] h-[4.5rem] rounded-[0.75rem] flex items-center justify-between px-[1rem] py-[0.75rem] transition-colors duration-150 border";

  const bgClass = isPressing && !disabled ? "bg-[#F4F5F6]" : "bg-white";
  const borderClass = "border-[#E4E7EA]";
  const textColor = disabled ? "text-[#C0C4CD]" : "text-black";
  const cursorStyle = disabled
    ? "cursor-not-allowed pointer-events-none"
    : "cursor-pointer";

  let rightIcon = null;
  if (editMode && !disabled) {
    rightIcon = (
      <Dismiss
        onClick={e => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="text-[#FF4D4F] text-lg"
        aria-label="삭제"
      />
    );
  } else if (disabled) {
    rightIcon = <Dismiss_GY className="w-[1.5rem] h-[1.5rem]" />;
  } else {
    rightIcon = isClicked ? (
      <Check_circled_filled className="w-[1.5rem] h-[1.5rem]" />
    ) : (
      <CheckCircled className="w-[1.5rem] h-[1.5rem]" />
    );
  }

  return (
    <div
      className={clsx(
        `${baseClasses} ${bgClass} ${borderClass} ${cursorStyle}`,
        className,
      )}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={handleClick}
    >
      <div
        className={`w-[16.9375rem] h-[3rem] flex flex-col justify-center items-start overflow-hidden ${textColor}`}
      >
        <p className="body-md-500 truncate w-full text-left" title={isMainAddr}>
          {isMainAddr}
        </p>
        <p className="body-rg-500 truncate w-full text-left" title={streetAddr}>
          {streetAddr}
        </p>
      </div>
      <div className="ml-auto">{rightIcon}</div>
    </div>
  );
};
