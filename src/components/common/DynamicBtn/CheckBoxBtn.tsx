import type { BaseBtnProps, IconTextStatus } from "../../../types/DynamicBtn";
import useDynamicStatus from "../../../hooks/useDynamicStatus";

export default function CheckBoxBtn({
  children,
  disabled = false,
  onClick,
  type,
}: BaseBtnProps) {
  //상태 관리

  const { status, onMouseDown, onMouseLeave, onMouseUp } = useDynamicStatus(
    disabled,
    true,
  );

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
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      type={type ? type : "button"}
    >
      <img src={icon} alt="체크박스 선택" className=" size-4" />
      {children}
    </button>
  );
}
