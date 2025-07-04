// components/common/Btn_Static/Button.tsx
import React, { useState } from "react";
import type { BtnKind, BtnSize, BtnStatus } from "./types";
import { buttonPresets, sizePresets } from "./presets";

interface Btn_StaticProps {
  kind: BtnKind; //색: GR400, GR600, RD500, GY100, GY800, White
  size: BtnSize; //크기: L, L_Thin, M, S, XS
  label?: string;
  iconMap?: Partial<Record<BtnStatus, string>>; // 상태별 아이콘
  textColorMap?: Partial<Record<BtnStatus, string>>; // 상태별 글자색
  initialStatus?: BtnStatus; //상태: default, pressing, clicked, disabled
  onClick?: () => void;

  // Override (optional), 위의 정형적인 속성 말고 커스텀하고 싶을 때
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
}

const Btn_Static = ({
  kind,
  size,
  label = "Btn",
  iconMap,
  initialStatus = "default",
  onClick,
  bgColor,
  textColor,
  textColorMap,
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
}: Btn_StaticProps) => {
  const [status, setStatus] = useState<BtnStatus>(initialStatus);
  const isDisabled = status === "disabled";

  const preset = buttonPresets[kind];
  const sizePreset = sizePresets[size];

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
    width ?? sizePreset.width,
    height ?? sizePreset.height,
    bgColor ?? preset.bgColor[status],
    textColor ?? currentTextColor ?? preset.textColor[status],
    borderColor ?? preset.borderColor?.[status] ?? "",
    rounded ?? sizePreset.rounded ?? "",
    padding ?? sizePreset.padding ?? "",
    gap ?? "",
    shadow ?? "",
    isDisabled ? "cursor-not-allowed" : "cursor-pointer",
  ].join(" ");

  return (
    <button
      className={classes}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={isDisabled}
    >
      {currentIcon && (
        <img
          src={currentIcon}
          alt="icon"
          className={`${iconSize ?? sizePreset.iconSize ?? "w-5 h-5"} flex-shrink-0 aspect-square`}
        />
      )}
      <span className={textSize ?? sizePreset.textSize}>{label}</span>
    </button>
  );
};

export default Btn_Static;
