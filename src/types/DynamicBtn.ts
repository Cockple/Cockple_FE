export type TextIconStatus = "clicked" | "pressing" | "default" | "disabled";

export type IconTextStatus = TextIconStatus | "CLpressing";

export type BaseBtnProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
  imgSrc?: string;
};
