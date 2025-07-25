import ArrowDown from "@/assets/icons/arrow_down.svg";

interface SortButtonProps {
  label: string;
  disabled?: false;
  open?: boolean;
  onClick?: () => void;
}

export const SortButton = ({
  label,
  open,
  onClick,
  disabled,
}: SortButtonProps) => {
  return (
    <button
      className="flex items-center gap-2 px-2 py-1 body-rg-500 disabled:text-gy-400 active:bg-gy-100 active:border-hard"
      disabled={disabled}
      onClick={onClick}
    >
      {label}{" "}
      <span
        className={`${open ? "rotate-180" : ""} transition-transform duration-300`}
      >
        <img src={ArrowDown} alt="arrow" className="w-4" />
      </span>
    </button>
  );
};
