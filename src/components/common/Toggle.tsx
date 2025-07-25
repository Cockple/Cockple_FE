import { useState } from "react";
import Clear_XS from "../common/Btn_Static/Icon_Btn/Clear_XS";
import ArrowDown from "@/assets/icons/arrow_down.svg";
import ArrowUp from "@/assets/icons/arrow_up.svg";

interface ToggleProps {
  title: string;
  children: React.ReactNode;
}

export const Toggle = ({ title, children }: ToggleProps) => {
  const [open, setOpen] = useState(false);
  const icon = open ? ArrowUp : ArrowDown;
  return (
    <div className="w-full flex flex-col px-1 gap-vertical-section-s">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="header-h5">{title}</span>
          <Clear_XS
            iconMap={{
              disabled: icon,
              default: icon,
              pressing: icon,
              clicked: icon,
            }}
            onClick={() => setOpen(!open)}
          />
        </div>
        {open && <div className="mt-4">{children}</div>}
      </div>

      <span className="h-px w-full border-1 border-gy-200"></span>
    </div>
  );
};
