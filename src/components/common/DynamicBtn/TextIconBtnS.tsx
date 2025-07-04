import type { BaseBtnProps, TextIconStatus } from "../../../types/DynamicBtn";
import useDynamicStatus from "../../../hooks/useDynamicStatus";

export default function TextIconBtnS({
  children,
  disabled = false,
  onClick,
  type,
}: BaseBtnProps) {
  const { status, onMouseDown, onMouseLeave, onMouseUp } = useDynamicStatus(
    disabled,
    false,
  );
  const statusMap: Record<TextIconStatus, { bg?: string; icon: string }> = {
    clicked: {
      icon: "/src/assets/icons/arrow_right.svg",
    },
    pressing: {
      bg: "bg-gy-100 ",
      icon: "/src/assets/icons/arrow_right.svg",
    },
    default: {
      icon: "/src/assets/icons/arrow_right.svg",
    },
    disabled: {
      bg: "text-gy-400",
      icon: "/src/assets/icons/arrow_rightG.svg",
    },
  };

  const { bg, icon } = statusMap[status as TextIconStatus];

  return (
    <button
      className={`inline-flex pl-2 py-1 pr-1 gap-1 rounded-lg items-center  body-rg-400 ${bg} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      type={type ? type : "button"}
    >
      {children}
      <img src={icon} alt="버튼" className="size-4" />
    </button>
  );
}
