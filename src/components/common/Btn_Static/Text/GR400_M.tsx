import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";

interface GR400MProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const GR400_M = ({
  initialStatus = "default",
  label = "Btn",
  onClick,
}: GR400MProps) => {
  return (
    <Btn_Static
      kind="GR400"
      size="M"
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
    />
  );
};

export default GR400_M;
