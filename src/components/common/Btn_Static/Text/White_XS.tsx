import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";
import PenGY400 from "../../../../assets/icons/pen-gy-400.svg";
import Pen from "../../../../assets/icons/pen.svg";

interface WhiteXSProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const White_XS = ({
  initialStatus = "default",
  label = "Text",
  onClick,
}: WhiteXSProps) => {
  return (
    <Btn_Static
      kind="White"
      size="XS"
      label={label}
      iconMap={{
        disabled: PenGY400,
        default: Pen,
        pressing: Pen,
        clicked: Pen,
      }}
      initialStatus={initialStatus}
      onClick={onClick}
      gap="gap-2"
    />
  );
};

export default White_XS;
