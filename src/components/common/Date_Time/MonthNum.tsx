import clsx from "clsx";
import { useState } from "react";
import circleImg from "@/assets/icons/cicle_s_fill.svg?url";

type ColorType = "black" | "red";
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
  // 쉐도우 없는
  black: {
    default: "bg-white text-black",
    pressing: "bg-gy-100 text-black",
    clicked: "!bg-gr-100 text-black",
  },
  red: {
    default: "bg-white text-rd-500",
    pressing: "bg-gy-100 text-rd-500",
    clicked: "bg-gr-100 text-rd-500",
  },
  disabled: "bg-white-40 text-gy-400",
};
export default function MonthNum({
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
        "flex flex-col items-center rounded-xl  body-rg-500 py-2 min-w-11  size-11 relative ",
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
      <div className="min-w-11 relative min-h-8 flex flex-col items-center justify-center">
        <p className="pb-[2px]">{date}</p>
        {hasDot && (
          <img
            src={circleImg}
            alt=""
            className="size-3 absolute pl-[2px]  -bottom-0.5 left-1/2 -translate-x-1/2"
          />
        )}
      </div>
    </div>
  );
}
