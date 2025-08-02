import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";
import PenGY400 from "../../../../assets/icons/pen-gy-400.svg";
import Pen from "../../../../assets/icons/pen.svg";

interface WhiteXSProps {
  initialStatus?: BtnStatus;
  icon?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
}

const White_XS = ({
  initialStatus = "default",
  label = "Text",
  onClick,
  icon,
  className,
}: WhiteXSProps) => {
  return (
    <Btn_Static
      kind="White"
      size="XS"
      label={label}
      iconMap={{
        disabled: icon ?? PenGY400,
        default: icon ?? Pen,
        pressing: icon ?? Pen,
        clicked: icon ?? Pen,
      }}
      initialStatus={initialStatus}
      onClick={onClick}
      gap="gap-2"
      className={className}
    />
  );
};

export default White_XS;
