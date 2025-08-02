import { useState, useRef, useEffect } from "react";
import ArrowDown from "@/assets/icons/arrow_down.svg";
import ArrowDownGray from "@/assets/icons/arrow_down_gray.svg";
import ArrowUp from "@/assets/icons/arrow_up.svg";
import clsx from "clsx";

interface DropBoxProps {
  options: { value: string; enabled?: boolean }[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const DropBox = ({
  options,
  value,
  onChange,
  placeholder = "선택",
  className = "",
  disabled,
}: DropBoxProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-41 h-11 border-soft  ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center w-full pl-3 pr-2.5 py-2.5 gap-2 border-1 border-gy-200 bg-white body-md-500 border-soft disabled:text-gy-400"
        disabled={disabled}
      >
        <span className="flex items-center flex-1 text-start">
          {" "}
          {value || placeholder}
        </span>
        <img
          src={open ? ArrowUp : disabled ? ArrowDownGray : ArrowDown}
          alt="arrow"
          className="w-4 h-4"
        />
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 max-h-31 w-full overflow-auto rounded border-1 border-gy-200 border-soft bg-white scrollbar-hide">
          {options.map(opt => {
            const isEnabled = opt.enabled ?? true;
            return (
              <li
                key={opt.value}
                className={clsx(
                  "px-2 py-1.5 text-sm cursor-pointer text-start body-rg-400",
                  !isEnabled
                    ? "text-gy-400 cursor-not-allowed"
                    : "active:bg-gy-100",
                  value === opt.value ? "bg-gray-100 font-semibold" : "",
                )}
                onClick={() => {
                  if (!isEnabled) return;
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.value}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
