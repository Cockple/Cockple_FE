import React from "react";
import ArrowDown from "../../assets/icons/arrow_down.svg";
import ArrowDownG from "../../assets/icons/arrow_downG.svg";
import ArrowUp from "../../assets/icons/arrow_up.svg";

interface SortProps {
  label: string;
  disabled?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}

const Sort = ({
  label,
  disabled = false,
  isOpen = false,
  onClick,
}: SortProps) => {
  const icon = disabled ? ArrowDownG : isOpen ? ArrowUp : ArrowDown;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 pl-2 pr-[0.38rem] py-1 border-hard
        body-rg-500 cursor-pointer
        ${disabled ? "text-gray-300 cursor-not-allowed" : "text-black"}
      `}
    >
      <span>{label}</span>
      <img src={icon} alt="정렬 화살표" className="size-4" />
    </button>
  );
};

export default Sort;
