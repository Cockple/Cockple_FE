import useDynamicStatus from "../../../hooks/useDynamicStatus";
import type { TextIconStatus } from "../../../types/DynamicBtn";

interface DynamicBtnProps {
  children: string;
  disabled?: boolean;
  onClick?: () => void;
  size: "sm" | "md" | "default";
  type?: "button" | "reset" | "submit";
}

export default function DynamicBtn({
  children,
  disabled = false,
  onClick,
  size,
  type,
}: DynamicBtnProps) {
  const { status, onMouseDown, onMouseLeave, onMouseUp } = useDynamicStatus(
    disabled,
    true,
  );

  const sizeMap = {
    default: {
      base: "body-rg-500 py-[0.375rem] px-4 justify-center gap2",
      state: {
        default: "bg-gy-100",
        clicked: "bg-white",
        pressing: "bg-gy-200",
        disabled: "bg-white text-gy-400",
      },
    },
    sm: {
      base: "body-sm-400 py-1 px-2 gap-1  underline decoration-solid decoration-auto underline-offset-auto ",
      state: {
        default: "text-gy-500",
        clicked: "text-gy-500 ",
        pressing: "text-gy-700 bg-gy-100",
        disabled: "text-gy-300",
      },
    },
    md: {
      base: "body-rg-400 py-1 px-3 gap-1  underline decoration-solid decoration-auto underline-offset-auto ",
      state: {
        default: "text-gy-700",
        clicked: "text-gy-700 ",
        pressing: "text-gy-700 bg-gy-100",
        disabled: "text-gy-400",
      },
    },
  };

  const { base, state } = sizeMap[size];
  const stateClass = state[status as TextIconStatus];

  return (
    <button
      className={`rounded-lg inline-flex items-center 
          ${stateClass} ${base} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      type={type ? type : "button"}
    >
      {children}
    </button>
  );
}
