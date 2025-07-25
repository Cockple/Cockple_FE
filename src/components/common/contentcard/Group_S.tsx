import { useState } from "react";
interface GroupSProps {
  title: string;
  location: string;
  imageSrc: string;
  disabled?: boolean; 
}

export const Group_S = ({
  title,
  location,
  imageSrc,
  disabled = false, 
}: GroupSProps) => {
  const [isPressing, setIsPressing] = useState(false);

  const handlePressStart = () => {
    if (!disabled) {
      setIsPressing(true);
    }
  };
  const handlePressEnd = () => {
    setIsPressing(false);
  };

  const bgColor = disabled ? "bg-white" : (isPressing ? "bg-[#F4F5F6]" : "bg-white");
  const textColorClass = disabled ? "text-[#C0C4CD]" : "text-black";
  const cursorStyle = disabled ? "cursor-not-allowed" : "cursor-pointer";

  return (
    <div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      className={`p-[0.5rem] w-[6rem] h-[9rem] rounded-[0.75rem] 
        ${bgColor} 
        ${cursorStyle}
        ${disabled ? 'pointer-events-none' : ''} 
        flex flex-col items-center gap-[0.75rem] transition-colors duration-150`}
    >
      {/* 이미지 영역 */}
      <div>
        <img
          src={imageSrc} 
          alt={title} 
          className="w-[5rem] h-[5rem] rounded-[0.5rem] object-cover"
        />
      </div>

      {/* 글/정보 영역 */}
      <div className="flex flex-col gap-[0.25rem] items-start max-w-full overflow-hidden">
        <p className={`body-rg-500 truncate w-full ${textColorClass}`} title={title}>
          {title}
        </p> 
        <p className={`body-sm-300 truncate w-full ${textColorClass}`} title={location}>
          {location}
        </p> 
      </div>

    </div>
  );
};