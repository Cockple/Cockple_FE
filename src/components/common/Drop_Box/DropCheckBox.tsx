import { useState } from "react";
import CheckBoxBtn from "../DynamicBtn/CheckBoxBtn";

interface DropBoxCheckBoxProps {
  title: string;
  options: string[];
  defaultValue?: string;
  disabledText?: string;
  checkLabel: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  checked?: boolean;
}

export default function DropCheckBox({
  title,
  options,
  checkLabel = "Text",
  value,
  onChange,
}: DropBoxCheckBoxProps) {
  const [open, setOpen] = useState(false);

  const disabled = value === "disabled";

  const handleOptionClick = (option: string) => {
    onChange?.(option);
    setOpen(false);
  };
  const toggleDropdown = () => {
    if (!disabled) setOpen(prev => !prev);
  };

  const handleDisableToggle = () => {
    if (disabled) {
      onChange?.("");
    } else {
      onChange?.("disabled");
    }
  };

  return (
    <div className="flex gap-2 flex-col">
      <div className="flex">
        <p
          className={`ml-1 header-h5 ${disabled ? "text-gy-500" : "text-block"}`}
        >
          {title}
        </p>
        <img src="/src/assets/icons/cicle_s_red.svg" alt="" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative inline-block w-40 ">
          <button
            className="border px-3 py-[0.625rem] flex justify-between gap-2 rounded-xl border-gy-200 w-40  h-11  cursor-pointer active:bg-gy-100"
            onClick={toggleDropdown}
          >
            <span className={disabled ? "text-gy-500" : "text-black"}>
              {value && value !== "disabled" ? value : ""}
            </span>
            <img
              src={
                disabled
                  ? "/src/assets/icons/arrow_down_gy.svg"
                  : open
                    ? "/src/assets/icons/arrow_up.svg"
                    : "/src/assets/icons/arrow_down.svg"
              }
              alt="Dropdown arrow"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 "
            />
          </button>
          {open && !disabled && (
            <div className="absolute mt-1">
              <ul className=" border rounded-xl border-gy-200 max-h-32 overflow-y-auto w-40 overflow-x-hidden">
                {options.map((item, idx) => {
                  return (
                    <li
                      key={idx} //추후 key값 수정 예정
                      onClick={() => {
                        handleOptionClick(item);
                      }}
                      className=" cursor-pointer w-40 rounded-xl px-3 py-[0.625rem] "
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <CheckBoxBtn
          children={checkLabel}
          onClick={handleDisableToggle}
          checked={value === "disabled"}
        />
      </div>
    </div>
  );
}
