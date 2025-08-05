import { useState } from "react";
import Vector from "../../../assets/icons/Vector.svg?react";

interface ExerciseSProps {
  title: string;
  date: string;
  time: string;
  location: string;
  imageSrc: string;
  onClick?: () => void;
}

export const Exercise_S = ({
  title,
  date,
  time,
  location,
  imageSrc,
  onClick,
}: ExerciseSProps) => {
  const [isPressing, setIsPressing] = useState(false);

  return (
    <div
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => setIsPressing(false)}
      onMouseLeave={() => setIsPressing(false)}
      onTouchStart={() => setIsPressing(true)}
      onTouchEnd={() => setIsPressing(false)}
      className={`p-[0.5rem] w-[8rem] h-[10.25rem] rounded-[1rem] 
        ${isPressing ? "bg-[#F4F5F6]" : "bg-white"} 
        shadow-ds50 flex flex-col items-center gap-[0.75rem] transition-colors duration-150`}
      onClick={onClick}
    >
      {/* 이미지 영역 */}
      <div>
        <img
          src={imageSrc}
          alt={title}
          className="w-[7rem] h-[5.25rem] rounded-[0.5rem] object-cover"
        />
      </div>

      {/* 글/정보 영역 */}
      <div className="flex flex-col gap-[0.25rem] items-start body-sm-400 text-black w-full">
        <p className="body-sm-500 truncate w-full">{title}</p>
        <p className="body-sm-500 truncate w-full">{`${date} ${time}`}</p>

        <div className="flex items-center gap-[0.25rem] w-full overflow-hidden">
          <Vector className="w-[0.875rem] h-[0.875rem] shrink-0" />
          <p className="truncate body-sm-400 w-full">{location}</p>
        </div>
      </div>
    </div>
  );
};
