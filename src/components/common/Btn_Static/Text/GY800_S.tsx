import React from "react";
import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";

interface GY800SProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const GY800_S = ({
  initialStatus = "default",
  label = "Btn",
  onClick,
}: GY800SProps) => {
  return (
    <Btn_Static
      kind="GY800"
      size="S"
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
    />
  );
};

export default GY800_S;
