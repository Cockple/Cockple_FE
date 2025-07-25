import React from "react";
import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";

interface GR600SProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const GR600_S = ({
  initialStatus = "default",
  label = "Btn",
  onClick,
}: GR600SProps) => {
  return (
    <Btn_Static
      kind="GR600"
      size="S"
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
    />
  );
};

export default GR600_S;
