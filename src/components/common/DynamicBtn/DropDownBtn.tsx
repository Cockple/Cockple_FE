import useDynamicStatus from "../../../hooks/useDynamicStatus";
import arrowDown from "@/assets/icons/arrow_down.svg?url";
import arrowDownG from "@/assets/icons/arrow_downG.svg?url";
import type { BaseBtnProps, TextIconStatus } from "../../../types/dynamicBtn";

export default function DropDownBtn({
  children,
  disabled = false,
  onClick,
  type,
}: BaseBtnProps) {
  //상태 관리

  const { status, onMouseDown, onMouseLeave, onMouseUp } = useDynamicStatus(
    disabled,
    false,
  );

  const statusMap: Record<TextIconStatus, { bg?: string; icon: string }> = {
    clicked: {
      icon: arrowDown,
    },
    pressing: {
      bg: "bg-gy-100",
      icon: arrowDown,
    },
    default: {
      icon: arrowDown,
    },
    disabled: {
      bg: "text-gy-400",
      icon: arrowDownG,
    },
  };
  const { bg, icon } = statusMap[status as TextIconStatus];

  return (
    <button
      className={`inline-flex pr-2.5 py-1 pl-3 gap-1 rounded-lg items-center header-h4 active:bg-gy-100  ${bg} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      type={type ? type : "button"}
    >
      {children}
      <img src={icon} alt="지역 선택 메뉴열기" className="size-4.5" />
    </button>
  );
}
