import React from "react";
import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";

interface GradGR400LProps {
  label?: string;
  initialStatus?: BtnStatus;
  onClick?: () => void;
}

const Grad_GR400_L = ({
  label = "Btn",
  initialStatus = "default",
  onClick,
}: GradGR400LProps) => {
  return (
    <div
      className={`
        flex justify-center
        w-full h-[6rem]
        pt-2 pr-4 pb-9 pl-4
        gap-[0.625rem]
        bg-gradient-to-b
        from-[rgba(252,252,255,0)] via-[rgba(252,252,255,0.8)] to-[#FCFCFF]
      `}
    >
      <Btn_Static
        kind="GR400"
        size="L"
        label={label}
        shadow="shadow-ds100"
        initialStatus={initialStatus}
        onClick={onClick}
      />
    </div>
  );
};

export default Grad_GR400_L;
