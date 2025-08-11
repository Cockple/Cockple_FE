import type { BaseBtnProps, TextIconStatus } from "../../../types/dynamicBtn";
import useDynamicStatus from "../../../hooks/useDynamicStatus";

export default function TextIconBtnM({
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
      bg: "text-gr-700",
      icon: "/src/assets/icons/arrow_right_fill.svg",
    },
    pressing: {
      bg: "bg-gr-200 text-gr-700",
      icon: "/src/assets/icons/arrow_right_fill.svg",
    },
    default: {
      bg: "text-gr-700",
      icon: "/src/assets/icons/arrow_right_fill.svg",
    },
    disabled: {
      bg: "border-gy-200 ",
      icon: "/src/assets/icons/arrow_right.svg",
    },
  };

  const { bg, icon } = statusMap[status as TextIconStatus];

  return (
    <button
      className={`inline-flex pr-[0.625rem]  py-2 pl-4 gap-1 rounded-2xl items-center body-sm-500 border-1 border-gr-500 shadow-ds100  ${bg} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
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
