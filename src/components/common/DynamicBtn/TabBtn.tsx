import { useState } from "react";
import type { BaseBtnProps, TextIconStatus } from "../../../types/dynamicBtn";

interface TabBtnProps extends BaseBtnProps {
  isSelected: boolean;
}

export default function TabBtn({
  children,
  disabled = false,
  onClick,
  type,
  isSelected,
}: TabBtnProps) {
  const [isPressing, setIsPressing] = useState(false);

  const status: TextIconStatus = disabled
    ? "disabled"
    : isPressing
      ? "pressing"
      : isSelected
        ? "clicked"
        : "default";

  // console.log(isSelected);
  const statusMap: Record<TextIconStatus, { bg?: string; span?: string }> = {
    //clicked
    clicked: {
      bg: "",
      span: "w-full h-[0.125rem] bg-gr-500 ", //click했을 때.
    },
    pressing: {
      bg: "bg-gy-100 ",
    },
    default: {
      bg: "",
    },
    disabled: {
      bg: "text-gy-400 ",
    },
  };

  const { bg, span } = statusMap[status as TextIconStatus];

  return (
    <button
      className={`w-[76px] h-10 header-h5 flex flex-col justify-center items-center rounded-lg relative cursor-pointer ${bg || ""}`}
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => setIsPressing(false)}
      onMouseLeave={() => setIsPressing(false)}
      onClick={onClick}
      disabled={disabled}
      type={type ? type : "button"}
    >
      {children}
      <span
        className={`${span || ""} absolute bottom-0 w-full left-0 z-10`}
      ></span>
    </button>
  );
}
