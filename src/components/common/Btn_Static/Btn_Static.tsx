// components/common/Btn_Static/Button.tsx

import { useState, useEffect } from "react";
import type { BtnKind, BtnSize, BtnStatus } from "./types";
import { buttonPresets, sizePresets } from "./presets";
import clsx from "clsx";

interface Btn_StaticProps {
  kind?: BtnKind;
  size?: BtnSize;
  label?: string;
  iconMap?: Partial<Record<BtnStatus, string>>;
  textColorMap?: Partial<Record<BtnStatus, string>>;
  initialStatus?: BtnStatus;
  onClick?: () => void;

  // Custom style overrides
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  iconSize?: string;
  textSize?: string;
  width?: string;
  height?: string;
  rounded?: string;
  padding?: string;
  gap?: string;
  shadow?: string;
  justify?: string;
  className?: string;
}

const Btn_Static = ({
  kind,
  size,
  label,
  iconMap,
  textColorMap,
  initialStatus = "default",
  onClick,
  bgColor,
  textColor,
  borderColor,
  iconSize,
  textSize,
  width,
  height,
  rounded,
  padding,
  gap,
  shadow,
  justify = "justify-center",
  className,
}: Btn_StaticProps) => {
  const [status, setStatus] = useState<BtnStatus>(initialStatus);

  // 외부에서 initialStatus가 바뀌면 내부 상태도 업데이트
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const isDisabled = status === "disabled";

  const preset = kind ? buttonPresets[kind] : undefined;
  const sizePreset = size ? sizePresets[size] : undefined;

  const currentIcon = iconMap?.[status];
  const currentTextColor = textColorMap?.[status];

  const handleMouseDown = () => {
    if (!isDisabled) setStatus("pressing");
  };

  const handleMouseUp = () => {
    if (!isDisabled && status === "pressing") {
      setStatus("clicked");
      onClick?.();
    }
  };

  const classes = [
    "flex items-center",
    justify,
    width ?? sizePreset?.width,
    height ?? sizePreset?.height,
    bgColor ?? preset?.bgColor[status],
    textColor ?? currentTextColor ?? preset?.textColor[status],
    borderColor ?? preset?.borderColor?.[status] ?? "",
    rounded ?? sizePreset?.rounded ?? "",
    padding ?? sizePreset?.padding ?? "",
    gap ?? "",
    shadow ?? "",
    isDisabled ? "cursor-not-allowed" : "cursor-pointer",
  ].join(" ");

  return (
    <button
      className={clsx(classes, className)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={isDisabled}
    >
      {currentIcon && (
        <img
          src={currentIcon}
          alt="icon"
          className={`${iconSize ?? sizePreset?.iconSize ?? "w-5 h-5"} flex-shrink-0 aspect-square`}
        />
      )}
      <span className={textSize ?? sizePreset?.textSize}>{label}</span>
    </button>
  );
};

export default Btn_Static;
