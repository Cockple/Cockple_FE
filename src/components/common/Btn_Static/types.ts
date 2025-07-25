// components/common/Btn_Static/types.ts
export type BtnStatus = "default" | "pressing" | "clicked" | "disabled";
export type BtnKind =
  | "GR400"
  | "GR600"
  | "RD500"
  | "GY100"
  | "GY800"
  | "White"
  | "GY100_RD500_S"
  | "GY100_GR600_S";
export type BtnSize = "L" | "L_Thin" | "M" | "S" | "XS";

export interface BtnPreset {
  bgColor: Record<BtnStatus, string>;
  textColor: Record<BtnStatus, string>;
  borderColor?: Record<BtnStatus, string>;
}

export interface SizePreset {
  width: string;
  height?: string;
  textSize: string;
  iconSize?: string;
  rounded: string;
  padding: string;
}
