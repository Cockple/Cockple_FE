import { useState } from "react";
import type { BaseBtnProps, TextIconStatus } from "../../../types/DynamicBtn";

interface TextBoxProps extends BaseBtnProps {
  isSelected: boolean;
  className?: string;
}

export default function TextBox({
  children,
  disabled = false,
  onClick,
  type,
  isSelected,
  className,
}: TextBoxProps) {
  const [isPressing, setIsPressing] = useState(false);

  const status: TextIconStatus = disabled
    ? "disabled"
    : isPressing
      ? "pressing"
      : isSelected
        ? "clicked"
        : "default";

  const statusMap: Record<TextIconStatus, { bg?: string }> = {
    clicked: {
      bg: "shadow-ds200-gr border-gr-600 bg-white",
    },
    pressing: {
      bg: "shadow-ds100 bg-gy-100 border-gy-100",
    },
    default: {
      bg: "border-gy-100 bg-white shadow-ds100 ",
    },
    disabled: {
      bg: "border-gy-100 bg-white ",
    },
  };

  const { bg } = statusMap[status as TextIconStatus];
  return (
    <button
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => setIsPressing(false)}
      onMouseLeave={() => setIsPressing(false)}
      onClick={onClick}
      disabled={disabled}
      type={type ? type : "button"}
      className={`border p-2 flex items-center justify-center rounded-lg ${bg} ${className}`}
    >
      {children}
    </button>
  );
}
