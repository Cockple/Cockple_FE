import React from "react";
import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";
import DeleteGY400 from "../../../../assets/icons/delete-gy-400.svg";
import DeleteRD500 from "../../../../assets/icons/delete-rd-500.svg";
import DeleteWhite from "../../../../assets/icons/delete-white.svg";

interface RD500MProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const RD500_M = ({
  initialStatus = "default",
  label,
  onClick,
}: RD500MProps) => {
  return (
    <Btn_Static
      kind="RD500"
      size="M"
      iconMap={{
        disabled: DeleteGY400,
        default: DeleteRD500,
        pressing: DeleteWhite,
        clicked: DeleteRD500,
      }}
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
      gap="gap-3"
    />
  );
};

export default RD500_M;
