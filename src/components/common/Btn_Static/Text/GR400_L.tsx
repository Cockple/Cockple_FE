import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";

interface GR400LProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const GR400_L = ({
  initialStatus = "default",
  label = "Btn",
  onClick,
}: GR400LProps) => {
  return (
    <Btn_Static
      kind="GR400"
      size="L"
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
    />
  );
};

export default GR400_L;
