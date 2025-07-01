import useDynamicStatus from "../../hooks/useDynamicStatus";
import type { BaseBtnProps, IconTextStatus } from "../../types/DynamicBtn";

export default function TagBtn({
  children,
  disabled = false,
  onClick,
  type,
}: BaseBtnProps) {
  const { status, onMouseDown, onMouseLeave, onMouseUp } = useDynamicStatus(
    disabled,
    true,
  );

  const statusMap: Record<IconTextStatus, { bg: string; icon: string }> = {
    clicked: {
      bg: "bg-white border-gr-500",
      icon: "/src/assets/icons/dismiss.svg",
    },
    CLpressing: {
      bg: "bg-gy-100 border-gr-500",
      icon: "/src/assets/icons/dismiss.svg",
    },
    pressing: {
      bg: "bg-gy-100 border-gr-500",
      icon: "/src/assets/icons/hash.svg",
    },
    default: {
      bg: "bg-white border-gy-200",
      icon: "/src/assets/icons/hash.svg",
    },
    disabled: {
      bg: "bg-white border-gy-200",
      icon: "/src/assets/icons/hash.svg",
    },
  };

  const { bg, icon } = statusMap[status];

  return (
    <button
      className={`inline-flex pr-[0.625rem] py-2 pl-3 gap-1 rounded-2xl items-center body-rg-500 shadow-ds100 ${bg} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      type={type ? type : "button"}
    >
      <img src={icon} alt="태그 설정" className="size-4" />
      {children}
    </button>
  );
}
