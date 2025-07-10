import React, { useState } from "react";
import HeartGY400 from "../../../../assets/icons/heart_GY400.svg";
import HeartGY300 from "../../../../assets/icons/heart_GY300.svg";
import HeartFilledGY300 from "../../../../assets/icons/heart_filled_GY300.svg";
import HeartSystemError from "../../../../assets/icons/heart_filled_systemError.svg";

type BtnStatus = "disabled" | "default" | "pressing" | "clicked";

interface RD500SProps {
  initialStatus?: BtnStatus;
  onClick?: () => void;
  iconMap?: Partial<Record<BtnStatus, string>>; // 상태별 아이콘
}

const RD500_S_Icon = ({
  initialStatus = "default",
  onClick,
  iconMap,
}: RD500SProps) => {
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

  const getIcon = () => {
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
    }
  };

  return (
    <button
      className={`
        inline-flex p-1 items-center gap-1 border-hard
        ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      disabled={status === "disabled"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <img
        src={`${currentIcon ? currentIcon : getIcon()}`}
        alt="삭제"
        className="w-[1.125rem] h-[1.125rem] aspect-square"
      />
    </button>
  );
};

export default RD500_S_Icon;
