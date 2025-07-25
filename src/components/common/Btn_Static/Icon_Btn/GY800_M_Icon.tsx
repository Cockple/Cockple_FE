// components/Btn_Static/Text/RD500_M.tsx
import { useState } from "react";
import ArrowLeftWhite from "../../../../assets/icons/arrow_left_white.svg";
import ArrowLeftGY400 from "../../../../assets/icons/arrow_left-gy-400.svg";

type BtnStatus = "disabled" | "default" | "pressing" | "clicked";

interface GY800MIconProps {
  initialStatus?: BtnStatus;
  onClick?: () => void;
  iconMap?: Partial<Record<BtnStatus, string>>; // 상태별 아이콘
}

const GY800_M_Icon = ({
  initialStatus = "default",
  onClick,
  iconMap,
}: GY800MIconProps) => {
  const [status, setStatus] = useState<BtnStatus>(initialStatus);
  const currentIcon = iconMap?.[status];

  const isDisabled = status === "disabled";

  const handleMouseDown = () => {
    if (!isDisabled) setStatus("pressing");
  };

  const handleMouseUp = () => {
    if (!isDisabled && status === "pressing") {
      setStatus("clicked");
      onClick?.();
    }
  };

  const getBg = () => {
    switch (status) {
      case "pressing":
        return "bg-black-60";
      case "disabled":
      case "default":
      case "clicked":
      default:
        return "bg-black-20";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "disabled":
        return ArrowLeftGY400;
      default:
        return ArrowLeftWhite;
    }
  };

  return (
    <button
      className={`
        inline-flex p-1 items-center gap-3 border-hard 
        ${getBg()} 
        ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      disabled={status === "disabled"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <img
        src={`${currentIcon ? currentIcon : getIcon()}`}
        alt="삭제"
        className="w-[1.5rem] h-[1.5rem] aspect-square"
      />
    </button>
  );
};

export default GY800_M_Icon;
