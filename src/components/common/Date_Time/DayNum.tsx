import clsx from "clsx";
import { useState } from "react";
import Circle_Fill from "@/assets/icons/cicle_s_fill.svg?url";

type ColorType = "black" | "red" | "blue" | "Nblack" | "Nred" | "Nblue";
type StatusType = "default" | "pressing" | "clicked";

type DayNumProps = {
  day?: string; // 요일
  date?: number | string; // 날짜
  color?: ColorType; // 텍스트 색
  status?: StatusType; // 상태
  hasDot?: boolean; // 점
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const statusMap: Record<ColorType, Record<StatusType, string>> & {
  disabled: string;
} = {
  black: {
    default: "shadow-ds50-is50 bg-white-50 text-black",
    pressing: "shadow-ds50 bg-gy-100 text-black",
    clicked: "bg-white shadow-ds50 text-black",
  },
  red: {
    default: "shadow-ds50-is50 bg-white-50 text-rd-500",
    pressing: "shadow-ds50 bg-gy-100 text-rd-500",
    clicked: "bg-white shadow-ds50 text-rd-500",
  },
  blue: {
    default: "shadow-ds50-is50 bg-white-50 text-bl-500",
    pressing: "shadow-ds50 bg-gy-100 text-bl-500",
    clicked: "bg-white shadow-ds50 text-bl-500",
  },
  // 쉐도우 없는
  Nblack: {
    default: "bg-white text-black",
    pressing: "bg-gy-100 text-black",
    clicked: "!bg-gr-100 text-black",
  },
  Nred: {
    default: "bg-white text-rd-500",
    pressing: "bg-gy-100 text-rd-500",
    clicked: "bg-gr-100 text-rd-500",
  },
  Nblue: {
    default: "bg-white text-bl-500",
    pressing: "bg-gy-100 text-bl-500",
    clicked: "bg-gr-100 text-bl-500",
  },
  disabled: "bg-white-40 text-gy-400",
};
export default function DayNum({
  day = "Day",
  date = "00",
  color = "black",
  status = "default",
  hasDot = false,
  disabled = false,
  className,
  onClick,
}: DayNumProps) {
  const [isPressing, setIsPressing] = useState(false);
  // const [isClicked, setIsClicked] = useState(false);

  const effectiveStatus: StatusType = isPressing ? "pressing" : status;

  const appliedClass = disabled
    ? statusMap.disabled
    : statusMap[color][effectiveStatus];
  return (
    <div
      className={clsx(
        "flex flex-col items-center rounded-lg  body-rg-500  gap-2 pt-2 pb-[0.625rem] w-11  max-h-17 relative ",
        appliedClass,
        className,
      )}
      onPointerDown={() => setIsPressing(true)}
      onPointerUp={() => {
        setIsPressing(false);
        // setIsClicked(prev => !prev);
      }}
      onPointerLeave={() => setIsPressing(false)}
      onClick={onClick}
    >
      <p>{day}</p>
      <div className="min-w-11 relative min-h-8">
        <p>{date}</p>
        {hasDot && (
          <img
            src={Circle_Fill}
            alt=""
            className="size-3 absolute bottom-0.5 left-4"
          />
        )}
      </div>
    </div>
  );
}
