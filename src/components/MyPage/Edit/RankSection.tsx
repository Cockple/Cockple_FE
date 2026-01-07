import { useState } from "react";
import CicleSRED from "@/assets/icons/cicle_s_red.svg?react";
import CheckCircled from "@/assets/icons/check_circled.svg?react";
import CheckCircledFilled from "@/assets/icons/check_circled_filled.svg?react";
import ArrowDown from "@/assets/icons/arrow_down.svg?url";
import { LEVEL_OPTIONS } from "./constants";

interface Props {
  selectedLevel: string;
  disabled: boolean;
  onLevelChange: (level: string) => void;
  onToggleDisabled: (disabled: boolean) => void;
}

export const RankSection = ({ selectedLevel, disabled, onLevelChange, onToggleDisabled }: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggle = () => {
    const newState = !disabled;
    onToggleDisabled(newState);
    if (newState) {
      setDropdownOpen(false);
      onLevelChange("");
    }
  };

  return (
    <div className="mb-8">
      <label className="flex items-center text-left header-h5 mb-1">
        전국 급수 <CicleSRED />
      </label>
      <div className="flex items-center gap-4">
        <div className="relative w-40">
          <button
            className="border px-3 py-[0.625rem] flex justify-between gap-2 rounded-xl border-gy-200 w-40 h-11 cursor-pointer"
            onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
          >
            <span className={disabled ? "text-gy-500" : "text-black"}>
              {disabled ? "" : selectedLevel}
            </span>
            <img
              src={ArrowDown}
              alt="Dropdown arrow"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4"
            />
          </button>
          {dropdownOpen && !disabled && (
            <ul className="absolute mt-1 z-10 w-40 border rounded-xl border-gy-200 bg-white shadow max-h-36 overflow-y-auto">
              {LEVEL_OPTIONS.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    onLevelChange(item);
                    setDropdownOpen(false);
                  }}
                  className="text-start cursor-pointer w-full px-3 py-[0.625rem] hover:bg-gy-100 rounded-xl"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-1"
        >
          {disabled ? (
            <CheckCircledFilled className="w-4 h-4 text-[#FF4D4F]" />
          ) : (
            <CheckCircled className="w-4 h-4 text-gray-400" />
          )}
          급수 없음
        </button>
      </div>
    </div>
  );
};