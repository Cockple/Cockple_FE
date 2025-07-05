import { useState } from "react";
import Heart_GY from "../../../assets/icons/heart_GY.svg?react";
import Calendar from "../../../assets/icons/calendar.svg?react";
import Clock from "../../../assets/icons/clock.svg?react";
import Vector from "../../../assets/icons/Vector.svg?react";

interface ExerciseMProps {
  title: string;
  date: string;
  time: string;
  location: string;
  imageSrc: string;
  isFavorite?: boolean; 
}

export const Exercise_M = ({
  title,
  date,
  time,
  location,
  imageSrc,
  isFavorite = false, 
}: ExerciseMProps) => {
  // pressing 상태 관리 
  const [isPressing, setIsPressing] = useState(false);

  return (
    <div
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => setIsPressing(false)}
      onMouseLeave={() => setIsPressing(false)}
      onTouchStart={() => setIsPressing(true)}
      onTouchEnd={() => setIsPressing(false)}
      className={`p-[0.5rem] w-[21.4375rem] h-[6.5rem] rounded-[0.75rem] 
        ${isPressing ? "bg-[#F4F5F6]" : "bg-white"} 
        shadow-ds50 flex items-center gap-[0.75rem] transition-colors duration-150`}
    >
      {/* 이미지 영역 */}
      <div className="relative">
        <img
          src={imageSrc}
          alt="운동 이미지" 
          className="w-[5.5rem] h-[5.5rem] rounded-[0.5rem] object-cover"
        />
        {/* isFavorite이 true일 때만 하트 아이콘을 보여줌 */}
        {isFavorite && (
          <Heart_GY className="w-[1.625rem] h-[1.625rem] absolute bottom-[0.25rem] right-[0.25rem]" />
        )}
      </div>

      {/* 글/정보 영역 */}
      <div className="w-[14.1875rem] h-[5.5rem] flex flex-col gap-[0.5rem] items-start body-sm-400 text-black">
        <p className="body-rg-500 truncate max-w-full">{title}</p>

        <div className="w-[14.1875rem] h-[3.75rem] flex flex-col gap-[0.375rem]">
          <div className="flex items-center gap-[0.25rem] max-w-full overflow-hidden">
            <Calendar className="w-[0.875rem] h-[0.875rem] shrink-0" />
            <span className="truncate">{date}</span>
          </div>
          <div className="flex items-center gap-[0.25rem] max-w-full overflow-hidden">
            <Clock className="w-[0.875rem] h-[0.875rem] shrink-0" />
            <span className="truncate">{time}</span>
          </div>
          <div className="flex items-center gap-[0.25rem] max-w-full overflow-hidden">
            <Vector className="w-[0.875rem] h-[0.875rem] shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

    </div>
  );
};