import React from "react";
import Btn_Static from "../Btn_Static";

const Grad_GR400_L = () => {
  return (
    <div
      className={`
        w-[23.4375rem] h-[6rem]
        pt-2 pr-4 pb-9 pl-4
        gap-[0.625rem]
        bg-gradient-to-b
        from-[rgba(252,252,255,0)] via-[rgba(252,252,255,0.8)] to-[#FCFCFF]
      `}
    >
      <Btn_Static kind="GR400" size="L" label="Btn" shadow="shadow-ds100" />
    </div>
  );
};

export default Grad_GR400_L;
