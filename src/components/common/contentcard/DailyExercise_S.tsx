import { useState } from "react";
import Clock from "../../../assets/icons/clock.svg?react";
import Vector from "../../../assets/icons/Vector.svg?react";
import RightAngle from "../../../assets/icons/arrow_right.svg?react";

// props 타입 정의(임시)
interface DailyExerciseSProps {
  title: string;
  location: string;
  time: string;
  imageSrc: string;
  onClick?: () => void;
}

export const DailyExercise_S = ({
  title,
  location,
  time,
  imageSrc,
  onClick,
}: DailyExerciseSProps) => {
  const [isPressing, setIsPressing] = useState(false);

  return (
    <div
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => setIsPressing(false)}
      onMouseLeave={() => setIsPressing(false)}
      onTouchStart={() => setIsPressing(true)}
      onTouchEnd={() => setIsPressing(false)}
      className={`p-[0.5rem] w-full h-[5rem] rounded-[0.75rem]
        ${isPressing ? "bg-[#F4F5F6]" : "bg-white"}
        shadow-ds50 flex items-center gap-3 transition-colors duration-150`}
      onClick={onClick}
    >
      {/* 이미지 영역 */}
      <div className="relative">
        <img
          src={imageSrc}
          alt="운동 이미지"
          className="w-[4rem] h-[4rem] rounded-[0.5rem] object-cover"
        />
      </div>

      {/* 텍스트 영역 */}
      <div className="w-[14.1875rem] h-[4rem] flex flex-col gap-[0.5rem] items-start body-sm-400 text-black">
        <p className="body-rg-500 truncate max-w-full">{title}</p>

        <div className="w-full flex flex-col gap-[0.25rem]">
          <div className="flex items-center gap-1 max-w-full overflow-hidden">
            <Vector className="w-[0.875rem] h-[0.875rem] shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1 max-w-full overflow-hidden">
            <Clock className="w-[0.875rem] h-[0.875rem] shrink-0" />
            <span className="truncate">{time}</span>
          </div>
        </div>
      </div>

      {/* 화살표 */}
      <RightAngle className="w-[1rem] h-[1rem]" />
    </div>
  );
};
