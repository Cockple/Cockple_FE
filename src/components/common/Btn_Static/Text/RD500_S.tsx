import React from "react";
import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";

interface RD500SProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const RD500_S = ({
  initialStatus = "default",
  label = "Btn",
  onClick,
}: RD500SProps) => {
  return (
    <Btn_Static
      kind="RD500"
      size="S"
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
    />
  );
};

export default RD500_S;
