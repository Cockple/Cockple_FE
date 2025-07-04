// components/Btn_Static/Text/RD500_M.tsx
import React, { useState } from "react";
import ArrowRight from "../../../../assets/icons/arrow_right.svg";
import ArrowRightGY400 from "../../../../assets/icons/arrow_right_gy_400.svg";

type BtnStatus = "disabled" | "default" | "pressing" | "clicked";

interface ClearXSProps {
  initialStatus?: BtnStatus;
}

const Clear_XS = ({ initialStatus = "default" }: ClearXSProps) => {
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
        return ArrowRightGY400;
      default:
        return ArrowRight;
    }
  };

  return (
    <button
      className={`
        flex p-1 items-center w-[1.5rem] h-[1.5rem] gap-1 border-hard shrink-0
        ${getBg()} 
        ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      disabled={status === "disabled"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <img
        src={getIcon()}
        alt="삭제"
        className="w-[1rem] h-[1rem] shrink-0 aspect-square"
      />
    </button>
  );
};

export default Clear_XS;
