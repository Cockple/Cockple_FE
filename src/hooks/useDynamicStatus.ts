import { useState } from "react";
import type { IconTextStatus } from "../types/dynamicBtn";

export default function useDynamicStatus(
  disabled: boolean,
  enableCLPressing: boolean = false,
) {
  const [clicked, setClicked] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const getStatus = (): IconTextStatus => {
    if (disabled) return "disabled";
    if (enableCLPressing && clicked && isPressing) return "CLpressing";
    if (isPressing) return "pressing";
    if (clicked) return "clicked";
    return "default";
  };

  const status = getStatus();

  return {
    status,
    clicked,
    onMouseDown: () => !disabled && setIsPressing(true),
    onMouseUp: () => {
      if (disabled) return;
      setIsPressing(false);
      setClicked(prev => !prev);
    },
    onMouseLeave: () => !disabled && setIsPressing(false),
  };
}
