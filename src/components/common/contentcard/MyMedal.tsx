import { useState } from "react";
import RightAngle from "../../../assets/icons/arrow_right.svg?react";
import { useNavigate } from "react-router-dom";

interface MyMedalProps {
  memberId?: number;
  contentId: number;
  title: string;
  date: string;
  medalImageSrc: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const MyMedal = ({
  memberId,
  contentId,
  title,
  date,
  medalImageSrc,
  disabled = false,
}: MyMedalProps) => {
  const navigate = useNavigate();
  const [isPressing, setIsPressing] = useState(false);
  const handlePressStart = () => {
    if (!disabled) setIsPressing(true);
  };
  const handleClick = () => {
    const idStr = contentId.toString(); 
    if (memberId) {
      navigate(`/mypage/profile/medal/${memberId}/contest/${contentId}`);
    } else {
      navigate(`/mypage/mymedal/${idStr}`);
    }
  };
  const handlePressEnd = () => setIsPressing(false);

  const baseClasses =
    "p-[0.5rem] w-[21.4375rem] h-[4.75rem] rounded-[0.75rem] flex items-center gap-[0.75rem] transition-colors duration-150";

  let bgColor = "bg-white";
  let textColor = "text-black";
  let iconColor = "text-black";
  let cursorStyle = "cursor-pointer";

  if (disabled) {
    bgColor = "bg-white";
    textColor = "text-[#C0C4CD]";
    iconColor = "text-[#C0C4CD]";
    cursorStyle = "cursor-not-allowed pointer-events-none";
  } else if (isPressing) {
    bgColor = "bg-[#F4F5F6]";
  }

  return (
    <div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      className={`${baseClasses} ${bgColor} ${cursorStyle}`}
    >
      <div className="relative">
        <img
          src={medalImageSrc}
          alt="메달 이미지"
          className="w-[3.75rem] h-[3.75rem] rounded-[0.375rem] object-cover"
        />
      </div>

      <div className="w-[13.9375rem] h-[3.25rem] flex flex-col items-start">
        <div className="w-[13.9375rem] h-[3.25rem] flex flex-col gap-[0.25rem]">
          <div className={`flex items-center gap-[0.25rem] header-h4 ${textColor}`}>
            <span className="truncate overflow-hidden whitespace-nowrap">
              {title}
            </span>
          </div>
          <div className={`flex items-center gap-[0.25rem] body-rg-500 ${textColor}`}>
            <span>{date}</span>
          </div>
        </div>
      </div>

     <RightAngle
        className={`w-[1.25rem] h-[1.25rem] ${iconColor}`}
        onClick={handleClick}
      />
    </div>
  );
};
