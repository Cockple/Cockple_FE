import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";
import PenGY400 from "../../../../assets/icons/pen-gy-400.svg";
import Pen from "../../../../assets/icons/pen.svg";

interface GY100SProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const GY100_S = ({
  initialStatus = "default",
  label = "Text",
  onClick,
}: GY100SProps) => {
  return (
    <Btn_Static
      kind="GY100"
      size="S"
      iconMap={{
        disabled: PenGY400,
        default: Pen,
        pressing: Pen,
        clicked: Pen,
      }}
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
      gap="gap-2"
    />
  );
};

export default GY100_S;
