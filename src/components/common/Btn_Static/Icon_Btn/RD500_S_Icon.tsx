import React from "react";
import HeartGY400 from "../../../../assets/icons/heart_GY400.svg";
import HeartGY300 from "../../../../assets/icons/heart_GY300.svg";
import HeartFilledGY300 from "../../../../assets/icons/heart_filled_GY300.svg";
import HeartSystemError from "../../../../assets/icons/heart_filled_systemError.svg";

type BtnStatus = "disabled" | "default" | "pressing" | "clicked";

interface RD500SProps {
  isActive: boolean;
  disabled?: boolean;
  onClick?: () => void;
  iconMap?: Partial<Record<BtnStatus, string>>; // 상태별 아이콘
}

const RD500_S_Icon = ({
  isActive,
  disabled = false,
  onClick,
  iconMap,
}: RD500SProps) => {
  const [isPressing, setIsPressing] = React.useState(false);

  // 상태 계산 (외부 prop 기반)
  const status: BtnStatus = disabled
    ? "disabled"
    : isPressing
      ? "pressing"
      : isActive
        ? "clicked"
        : "default";

  const getIcon = (): string => {
    if (iconMap && iconMap[status]) return iconMap[status]!;
    switch (status) {
      case "disabled":
        return HeartGY400;
      case "default":
        return HeartGY300;
      case "pressing":
        return HeartFilledGY300;
      case "clicked":
        return HeartSystemError;
      default:
        return HeartGY300;
    }
  };

  return (
    <button
      className={`inline-flex p-1 items-center gap-1 border-hard
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      disabled={disabled}
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => {
        setIsPressing(false);
        onClick?.();
      }}
      onMouseLeave={() => setIsPressing(false)}
    >
      <img
        src={getIcon()}
        alt="하트"
        className="w-[1.125rem] h-[1.125rem] aspect-square"
      />
    </button>
  );
};

export default RD500_S_Icon;
