// components/Btn_Static/Text/RD500_M.tsx
import React, { useState } from "react";
import ArrowLeft from "../../../../assets/icons/arrow_left.svg";
import ArrowLeftGY400 from "../../../../assets/icons/arrow_left-gy-400.svg";

type BtnStatus = "disabled" | "default" | "pressing" | "clicked";

interface ClearMProps {
  initialStatus?: BtnStatus;
}

const Clear_M = ({ initialStatus = "default" }: ClearMProps) => {
  const [status, setStatus] = useState<BtnStatus>(initialStatus);

  const isDisabled = status === "disabled";

  const handleMouseDown = () => {
    if (!isDisabled) setStatus("pressing");
  };

  const handleMouseUp = () => {
    if (!isDisabled && status === "pressing") {
      setStatus("clicked");
    }
  };

  const getBg = () => {
    switch (status) {
      case "pressing":
        return "bg-gy-100";
      case "disabled":
      case "default":
      case "clicked":
      default:
    }
  };

  const getIcon = () => {
    switch (status) {
      case "disabled":
        return ArrowLeftGY400;
      default:
        return ArrowLeft;
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
        src={getIcon()}
        alt="삭제"
        className="w-[1.5rem] h-[1.5rem] aspect-square"
      />
    </button>
  );
};

export default Clear_M;
