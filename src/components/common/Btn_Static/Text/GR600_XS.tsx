import React from "react";
import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";

interface GR600XSProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const GR600_XS = ({
  initialStatus = "default",
  label = "Text",
  onClick,
}: GR600XSProps) => {
  return (
    <Btn_Static
      kind="GR400"
      size="XS"
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
    />
  );
};

export default GR600_XS;
