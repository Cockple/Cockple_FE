import type { BaseBtnProps, IconTextStatus } from "../../../types/DynamicBtn";
import { useState } from "react";

interface CheckBtnProps extends BaseBtnProps {
  checked?: boolean; // 외부에서 상태를 강제 지정할 수 있도록
}
export default function CheckBoxBtn({
  children,
  disabled = false,
  checked = false,
  onClick,
  type,
}: CheckBtnProps) {
  //상태 관리
  const [isPressing, setIsPressing] = useState(false);

  const status: IconTextStatus = disabled
    ? "disabled"
    : isPressing
      ? checked
        ? "CLpressing"
        : "pressing"
      : checked
        ? "clicked"
        : "default";

  const statusMap: Record<IconTextStatus, { bg: string; icon: string }> = {
    clicked: {
      bg: "bg-white",
      icon: "/src/assets/icons/check_circled_filled.svg",
    },
    CLpressing: {
      bg: "bg-gy-100",
      icon: "/src/assets/icons/check_circled_filled.svg",
    },
    pressing: {
      bg: "bg-gy-100",
      icon: "/src/assets/icons/check_circled.svg",
    },
    default: {
      bg: "bg-white",
      icon: "/src/assets/icons/check_circled.svg",
    },
    disabled: {
      bg: "bg-white text-gy-400",
      icon: "/src/assets/icons/check_circledG.svg",
    },
  };

  const { bg, icon } = statusMap[status];

  return (
    <button
      className={`inline-flex pr-2 py-1 pl-[0.375rem] gap-2 rounded-lg items-center body-rg-500  ${bg} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => setIsPressing(false)}
      onMouseLeave={() => setIsPressing(false)}
      onClick={onClick}
      disabled={disabled}
      type={type ? type : "button"}
    >
      <img src={icon} alt="체크박스 선택" className=" size-4" />
      {children}
    </button>
  );
}
