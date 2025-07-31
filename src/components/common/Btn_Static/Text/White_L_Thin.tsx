import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";
import PenGY400 from "../../../../assets/icons/pen-gy-400.svg";
import Pen from "../../../../assets/icons/pen.svg";

interface WhiteLThinProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
  icon?: string;
  className?: string;
}

const White_L_Thin = ({
  initialStatus = "default",
  label = "Text",
  onClick,
  icon,
  className,
}: WhiteLThinProps) => {
  return (
    <Btn_Static
      kind="GY100"
      size="L_Thin"
      iconMap={{
        disabled: icon ?? PenGY400,
        default: icon ?? Pen,
        pressing: icon ?? Pen,
        clicked: icon ?? Pen,
      }}
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
      gap="gap-3"
      className={className}
    />
  );
};

export default White_L_Thin;
