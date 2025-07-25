import useDynamicStatus from "../../../hooks/useDynamicStatus";
import type { BaseBtnProps, TextIconStatus } from "../../../types/DynamicBtn";

export default function SearchFieldBtn({
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
      bg: "bg-gy-100",
      icon: "/src/assets/icons/mylocation.svg",
    },
    pressing: {
      bg: "bg-gy-200",
      icon: "/src/assets/icons/mylocation.svg",
    },
    default: {
      bg: "bg-gy-100",
      icon: "/src/assets/icons/mylocation.svg",
    },
    disabled: {
      bg: "bg-gy-100 text-gy-400",
      icon: "/src/assets/icons/mylocation_g.svg",
    },
  };

  const { bg, icon } = statusMap[status as TextIconStatus];
  return (
    <button
      className={`w-full flex px-4 py-2 items-center justify-center gap-3 body-rg-500 rounded-lg cursor-pointer ${bg}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      type={type ? type : "button"}
    >
      <img src={icon} alt="현재 위치" className="size-4" />
      {children || "현재 위치 불러오기"}
    </button>
  );
}
