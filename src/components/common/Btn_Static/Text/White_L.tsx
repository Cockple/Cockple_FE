import React from "react";
import Btn_Static from "../Btn_Static";
import type { BtnStatus } from "../types";

interface WhiteLProps {
  initialStatus?: BtnStatus;
  label?: string;
  onClick?: () => void;
}

const White_L = ({
  initialStatus = "default",
  label = "Text",
  onClick,
}: WhiteLProps) => {
  return (
    <Btn_Static
      kind="White"
      size="L"
      label={label}
      initialStatus={initialStatus}
      onClick={onClick}
      justify="justify-start"
    />
  );
};

export default White_L;
