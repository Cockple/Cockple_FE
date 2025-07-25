import React from "react";
import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";
import RefreshGY400 from "../../../../assets/icons/refresh-gy-400.svg";
import Refresh from "../../../../assets/icons/refresh.svg";
import RefreshWhite from "../../../../assets/icons/refresh-white.svg";

interface GY800MProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const GY800_M = ({
  initialStatus = "default",
  label = "Btn",
  onClick,
}: GY800MProps) => {
  return (
    <Btn_Static
      kind="GY800"
      size="M"
      iconMap={{
        disabled: RefreshGY400,
        default: Refresh,
        pressing: RefreshWhite,
        clicked: Refresh,
      }}
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
      gap="gap-3"
    />
  );
};

export default GY800_M;
