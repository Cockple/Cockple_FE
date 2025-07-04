import type { BaseBtnProps, IconTextStatus } from "../../../types/DynamicBtn";
import useDynamicStatus from "../../../hooks/useDynamicStatus";

export default function FilterBtn({
  children,
  disabled = false,
  onClick,
  type,
}: BaseBtnProps) {
  //상태 관리

  const { status, onMouseDown, onMouseUp, onMouseLeave } = useDynamicStatus(
    disabled,
    true,
  );

  const statusMap: Record<IconTextStatus, { bg: string; icon: string }> = {
    clicked: {
      bg: "bg-white text-gr-600",
      icon: "/src/assets/icons/filter_fill.svg",
    },
    CLpressing: {
      bg: "bg-gy-100 text-gr-600",
      icon: "/src/assets/icons/filter_fill.svg",
    },
    pressing: {
      bg: "bg-gy-100",
      icon: "/src/assets/icons/filter.svg",
    },
    default: {
      bg: "bg-white",
      icon: "/src/assets/icons/filter.svg",
    },
    disabled: {
      bg: "bg-white text-gy-400",
      icon: "/src/assets/icons/filterG.svg",
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
      <img src={icon} alt="필터 설정" className="size-4" />
      {children}
    </button>
  );
}
