// components/Btn_Static/Text/RD500_M.tsx
import React, { useState } from "react";
import Camera from "../../../../assets/icons/camera.svg";
import CameraGY400 from "../../../../assets/icons/camera_gy_400.svg";

type BtnStatus = "disabled" | "default" | "pressing" | "clicked";

interface WhiteMRoundProps {
  initialStatus?: BtnStatus;
}

const White_M_Round = ({ initialStatus = "default" }: WhiteMRoundProps) => {
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
        return "bg-white";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "disabled":
        return CameraGY400;
      default:
        return Camera;
    }
  };

  return (
    <button
      className={`
        flex justify-center items-center shrink-0 w-[2rem] h-[2rem] gap-3 border-round shadow-ds100
        ${getBg()} 
        ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      disabled={status === "disabled"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <img
        src={getIcon()}
        alt="삭제"
        className="w-[1.25rem] h-[1.25rem] shrink-0 aspect-1/1"
      />
    </button>
  );
};

export default White_M_Round;
