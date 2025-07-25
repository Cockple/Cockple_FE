import { useState } from "react";
import ArrowDown from "@/assets/icons/arrow_down.svg?react";
import ArrowUP from "@/assets/icons/arrow_up.svg?react";
import CheckIcon from "@/assets/icons/check.svg?react"; 

const sortOptions = ["왕초심", "초심", "D조", "C조", "B조", "A조", "준자강", "자강"];

interface SelectProps {
  selected: string;
  onSelect: (grade: string) => void;
}

export const Select = ({ selected, onSelect }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center w-full pl-3 pr-2.5 py-2.5 gap-2 border-1 border-gy-200 bg-white body-md-500 border-soft disabled:text-gy-400"
        // className="w-[10.3125rem] py-2 flex items-center justify-between border border-[#E4E7EA] rounded-xl px-2"
      >
        <p className="body-rg-500">{selected}</p>
        {isOpen ? <ArrowUP className="w-4 h-4 shrink-0" /> : <ArrowDown className="w-4 h-4 shrink-0" />}
      </button>

      {isOpen && (
        <ul className="body-lg-400 absolute z-10 top-full mt-2 w-[165px] bg-white rounded-xl py-2 shadow-md">
          {sortOptions.map(option => ( 
           <li
            key={option}
            onClick={() => handleSelect(option)}
            className="flex justify-between items-center px-4 py-2 body-lg-500 hover:bg-gray-100 cursor-pointer"
          >
            <span>{option}</span>
            <span className="w-4 h-4 flex items-center justify-center shrink-0">
              {selected === option && <CheckIcon className="w-4 h-4" />}
            </span>
          </li>
          ))}
        </ul>
      )}
    </div>
  );
};