import { useState } from "react";
import RD500_S_Icon from "../Btn_Static/Icon_Btn/RD500_S_Icon";
import Calendar from "../../../assets/icons/calendar.svg?react";
import Clock from "../../../assets/icons/clock.svg?react";
import Vector from "../../../assets/icons/Vector.svg?react";

interface ExerciseMProps {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  imageSrc: string;
  isFavorite?: boolean; 
  onToggleFavorite?: (id: number) => void;
};

export const Exercise_M = ({
  id,
  title,
  date,
  time,
  location,
  imageSrc,
  isFavorite = false, 
  onToggleFavorite,
}: ExerciseMProps) => {
  // pressing 상태 관리 
  const [isPressing, setIsPressing] = useState(false);

  const [favorite, setFavorite] = useState(isFavorite);

  const handleToggleFavorite = () => {
    const newFavorite = !favorite;
    setFavorite(newFavorite);
    onToggleFavorite?.(id);
  };

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
        <div style={{ position: "absolute", bottom: "0.25rem", right: "0.25rem" }}>
          <RD500_S_Icon
            isActive={favorite} 
            onClick={() => handleToggleFavorite?.(id)}        
            />
          </div>
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