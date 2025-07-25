import { useState, useEffect, useRef } from "react";
import ArrowDown from "@/assets/icons/arrow_down.svg?react";
import CheckIcon from "@/assets/icons/check.svg?react";

const sortOptions = ["최신순", "오래된 순"];

interface SortProps {
  selected: string;
  onChange: (option: string) => void;
}

export const MyExerciseSort = ({ selected, onChange }: SortProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-1 px-2"
      >
        <p className="body-rg-500">{selected}</p>
        <ArrowDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <ul className="absolute z-10 top-full mt-2 right-0 w-40 bg-white rounded-xl py-2 shadow-lg">
          {sortOptions.map(option => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <span className={selected === option ? "body-lg-500" : "body-lg-400"}>
                {option}
              </span>
              {selected === option && <CheckIcon className="w-4 h-4" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
