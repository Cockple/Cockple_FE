import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";
import PenGY400 from "../../../../assets/icons/pen-gy-400.svg";
import PenRD500 from "../../../../assets/icons/pen-rd-500.svg";

interface GY100RD500SProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const GY100_RD500_S = ({
  initialStatus = "default",
  label = "Text",
  onClick,
}: GY100RD500SProps) => {
  return (
    <Btn_Static
      kind="GY100_RD500_S"
      size="S"
      iconMap={{
        disabled: PenGY400,
        default: PenRD500,
        pressing: PenRD500,
        clicked: PenRD500,
      }}
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
      gap="gap-2"
    />
  );
};

export default GY100_RD500_S;
