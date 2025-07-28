import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";
import PenGY400 from "../../../../assets/icons/pen-gy-400.svg";
import PenGR600 from "../../../../assets/icons/pen-gr-600.svg";

interface GY100GR600SProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const GY100_GR600_S = ({
  initialStatus = "default",
  label = "Text",
  onClick,
}: GY100GR600SProps) => {
  return (
    <Btn_Static
      kind="GY100_GR600_S"
      size="S"
      iconMap={{
        disabled: PenGY400,
        default: PenGR600,
        pressing: PenGR600,
        clicked: PenGR600,
      }}
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
      gap="gap-2"
    />
  );
};

export default GY100_GR600_S;
