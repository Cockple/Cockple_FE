import React from "react";
import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";

interface RD500XSProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const RD500_XS = ({
  initialStatus = "default",
  label = "Text",
  onClick,
}: RD500XSProps) => {
  return (
    <Btn_Static
      kind="RD500"
      size="XS"
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
    />
  );
};

export default RD500_XS;
