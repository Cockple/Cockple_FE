import clsx from "clsx";
import type { ReactNode } from "react";

interface TextBoxMProps {
  children: ReactNode;
  selected: boolean;
  className?: string;
  onClick?: () => void;
}

export const TextBoxM = ({
  children,
  className,
  selected,
  onClick,
}: TextBoxMProps) => {
  return (
    <div
      className={clsx(
        "h-10 p-2 border-hard bg-white shadow-ds100 active:shadow-ds200-gr active:border-1 active:border-gr-600 body-md-500",
        selected ? "border-gr-600 shadow-ds200-g border-1" : "",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
