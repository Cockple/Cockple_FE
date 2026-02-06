import { useState } from "react";
import RightAngle from "../../../assets/icons/arrow_right.svg?react";
import { useNavigate } from "react-router-dom";
import Medal_1 from "../../../assets/icons/medal_1.svg?react";
import Medal_2 from "../../../assets/icons/medal_2.svg?react";
import Medal_3 from "../../../assets/icons/medal_3.svg?react";
import CockMedal from "../../../assets/icons/cockmedal.svg?react";

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

  // w-full로 변경하여 부모 컨테이너 너비에 맞추거나, 기존 고정 너비 유지
  // flex items-center justify-between 등을 활용하기 위해 flex 구조 최적화
  const baseClasses =
    "p-[0.5rem] w-full h-[4.75rem] rounded-[0.75rem] flex items-center gap-[0.75rem] transition-colors duration-150";
    // 만약 카드의 고정 너비를 유지해야 한다면 w-[21.4375rem] 그대로 두셔도 됩니다.
    // 하지만 리스트 형태라면 w-full이 더 자연스럽습니다.

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

  const getMedalComponent = (medalImageSrc?: string) => {
    if (!medalImageSrc || medalImageSrc.trim() === "") return <CockMedal />;
    if (medalImageSrc.includes("b0ac9ac7-169a-40de-aeb3-a8572bc91506")) return <Medal_1 />;
    if (medalImageSrc.includes("c0a3b94c-bf46-4aa0-934f-0c427475bc0b")) return <Medal_2 />;
    if (medalImageSrc.includes("3f9778a5-479a-44cf-bfb0-bea187a839c5")) return <Medal_3 />;
    if (medalImageSrc.includes("84e4dd20-7989-4871-954b-7363213b941e")) return <CockMedal />;
    return <img src={medalImageSrc} alt="메달 이미지" className="w-full h-full object-contain" />;
  };

  return (
    <div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      className={`${baseClasses} ${bgColor} ${cursorStyle}`}
    >
      <div className="relative w-[3.75rem] h-[3.75rem] rounded-[0.375rem] object-cover flex justify-center items-center shrink-0 [&>svg]:w-full [&>svg]:h-full">
        {getMedalComponent(medalImageSrc)}
      </div>

      <div className="flex-1 min-w-0 flex flex-col items-start justify-center h-full">
        <div className="flex flex-col gap-[0.25rem] w-full">
          <div className={`flex items-center gap-[0.25rem] header-h4 ${textColor}`}>
            <span className="truncate w-full text-left">
              {title}
            </span>
          </div>
          <div className={`flex items-center gap-[0.25rem] body-rg-500 ${textColor}`}>
            <span>{date}</span>
          </div>
        </div>
      </div>

      <RightAngle
        className={`w-[1.25rem] h-[1.25rem] shrink-0 ${iconColor}`}
        onClick={handleClick}
      />
    </div>
  );
};