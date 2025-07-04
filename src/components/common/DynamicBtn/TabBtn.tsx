import type { BaseBtnProps, TextIconStatus } from "../../../types/DynamicBtn";
import useDynamicStatus from "../../../hooks/useDynamicStatus";

export default function TabBtn({
  children,
  disabled = false,
  onClick,
  type,
}: BaseBtnProps) {
  const { status, onMouseDown, onMouseLeave, onMouseUp } = useDynamicStatus(
    disabled,
    false,
  );

  const statusMap: Record<TextIconStatus, { bg?: string; span?: string }> = {
    clicked: {
      span: "w-full h-[0.125rem] bg-gr-500 ",
    },
    pressing: {
      bg: "bg-gy-100 ",
    },
    default: {
      bg: "py-2 ",
    },
    disabled: {
      bg: "text-gy-400 ",
    },
  };

  const { bg, span } = statusMap[status as TextIconStatus];

  return (
    <button
      className={`header-h5 inline-flex  flex-col justify-center items-start  rounded-lg relative py-2 gap-1 px-3 ${bg}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      type={type ? type : "button"}
    >
      {children}
      <span className={`${span} absolute bottom-0 w-full left-0`}></span>
    </button>
  );
}
