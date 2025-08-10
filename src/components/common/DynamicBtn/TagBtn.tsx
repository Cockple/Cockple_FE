import useDynamicStatus from "../../../hooks/useDynamicStatus";
import type { BaseBtnProps, IconTextStatus } from "../../../types/DynamicBtn";
import DissMissIcon from "@/assets/icons/dismiss_fill.svg?url";
import HashIcon from "@/assets/icons/hash.svg?url";

interface TagBtnProps extends BaseBtnProps {
  isSelected?: boolean;
}

export default function TagBtn({
  children,
  disabled = false,
  onClick,
  type,
  isSelected = false,
}: TagBtnProps) {
  const { status, onMouseDown, onMouseLeave, onMouseUp } = useDynamicStatus(
    disabled,
    true,
  );

  const statusMap: Record<IconTextStatus, { bg: string }> = {
    clicked: {
      bg: "bg-white border-gr-500",
    },
    CLpressing: {
      bg: "bg-gy-100 border-gr-500",
    },
    pressing: {
      bg: "bg-gy-100 border-gr-500",
    },
    default: {
      bg: "bg-white border-gy-200",
    },
    disabled: {
      bg: "bg-white border-gy-200",
    },
  };

  const computedStatus: IconTextStatus = isSelected ? "clicked" : status;
  const { bg } = statusMap[computedStatus];

  return (
    <button
      className={`inline-flex pr-[0.625rem] py-2 pl-3 gap-1 rounded-2xl items-center body-rg-500 shadow-ds100 border ${bg}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      type={type || "button"}
    >
      <div className={`${isSelected ? "order-2" : "order-1"}`}>
        <div className="relative size-4">
          <img
            src={HashIcon}
            alt="해시"
            className={`absolute top-0 left-0   ${
              isSelected ? "opacity-0" : "opacity-100"
            }`}
          />
          <img
            src={DissMissIcon}
            alt="삭제"
            className={`absolute top-0 left-0   ${
              isSelected ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
      <span className={`${isSelected ? "order-1" : "order-2"}`}>
        {children}
      </span>
    </button>
  );
}
