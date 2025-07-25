// components/Btn_Static/Text/RD500_M.tsx
import React, { useState } from "react";
import Pen from "../../../../assets/icons/pen.svg";
import PenGY400 from "../../../../assets/icons/pen-gy-400.svg";

type BtnStatus = "disabled" | "default" | "pressing" | "clicked";

interface WhiteLTestProps {
  initialStatus?: BtnStatus;
  label?: string;
  icon?: string;
}

const White_L_Test = ({
  initialStatus = "default",
  label = "Btn",
  icon,
}: WhiteLTestProps) => {
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
    if (status == "pressing") return "bg-gy-100";
    return "bg-white";
  };

  const getIconBoxBg = () => {
    if (status === "pressing") return "bg-gy-200";
    return "bg-gy-100";
  };

  const getIcon = () => {
    switch (status) {
      case "disabled":
        return PenGY400;
      default:
        return Pen;
    }
  };

  const getTextColor = () => {
    if (status === "disabled") return "text-gy-400";
    return "text-black";
  };

  return (
    <button
      className={`flex flex-col w-[6rem] h-[9rem] p-2 justify-center items-center gap-2 border-hard flex-shrink-0 ${getBg()} ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      disabled={status === "disabled"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div
        className={`flex w-[5rem] h-[5rem] justify-center items-center gap-[0.625rem] border-hard ${getIconBoxBg()}`}
      >
        <img
          src={icon ?? getIcon()}
          alt="작성"
          className="w-[1.125rem] h-[1.125rem] flex-shrink-0 aspect-square"
        />
      </div>
      <span className={`body-rg-500 ${getTextColor()}`}>{label}</span>
    </button>
  );
};

export default White_L_Test;
