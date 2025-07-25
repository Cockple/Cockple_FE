import type { BtnPreset, SizePreset } from "./types";

export const buttonPresets: Record<string, BtnPreset> = {
  GR400: {
    bgColor: {
      default: "bg-gr-600",
      pressing: "bg-gr-700",
      clicked: "bg-gr-600",
      disabled: "bg-gy-400",
    },
    textColor: {
      default: "text-white",
      pressing: "text-white",
      clicked: "text-white",
      disabled: "text-white",
    },
  },

  GR600: {
    bgColor: {
      default: "bg-white",
      pressing: "bg-gr-600",
      clicked: "bg-white",
      disabled: "bg-white",
    },
    textColor: {
      default: "text-[#0b9a4e]",
      pressing: "text-white",
      clicked: "text-[#0b9a4e]",
      disabled: "text-[#c0c4cd]",
    },
    borderColor: {
      default: "border border-gr-600",
      pressing: "border border-gr-600",
      clicked: "border border-gr-600",
      disabled: "border border-gy-400",
    },
  },

  RD500: {
    bgColor: {
      default: "bg-white",
      pressing: "bg-rd-500",
      clicked: "bg-white",
      disabled: "bg-white",
    },
    textColor: {
      default: "text-[#f62d2d]",
      pressing: "text-white",
      clicked: "text-[#f62d2d]",
      disabled: "text-[#c0c4cd]",
    },
    borderColor: {
      default: "border border-rd-500",
      pressing: "border border-rd-500",
      clicked: "border border-rd-500",
      disabled: "border border-gy-400",
    },
  },

  GY100: {
    bgColor: {
      default: "bg-gy-100",
      pressing: "bg-gy-200",
      clicked: "bg-gy-100",
      disabled: "bg-gy-100",
    },
    textColor: {
      default: "",
      pressing: "",
      clicked: "",
      disabled: "text-[#c0c4cd]",
    },
  },

  GY800: {
    bgColor: {
      default: "bg-white",
      pressing: "bg-gy-800",
      clicked: "bg-white",
      disabled: "bg-white",
    },
    textColor: {
      default: "",
      pressing: "text-white",
      clicked: "",
      disabled: "text-[#c0c4cd]",
    },
    borderColor: {
      default: "border border-gy-800",
      pressing: "border border-gy-800",
      clicked: "border border-gy-800",
      disabled: "border border-gy-400",
    },
  },

  White: {
    bgColor: {
      default: "bg-white",
      pressing: "bg-gy-100",
      clicked: "bg-white",
      disabled: "bg-white",
    },
    textColor: {
      default: "",
      pressing: "",
      clicked: "",
      disabled: "text-[#c0c4cd]",
    },
  },

  GY100_RD500_S: {
    bgColor: {
      default: "bg-gy-100",
      pressing: "bg-gy-200",
      clicked: "bg-gy-100",
      disabled: "bg-gy-100",
    },
    textColor: {
      default: "text-[#f62d2d]",
      pressing: "text-[#f62d2d]",
      clicked: "text-[#f62d2d]",
      disabled: "text-[#c0c4cd]",
    },
  },

  GY100_GR600_S: {
    bgColor: {
      default: "bg-gy-100",
      pressing: "bg-gy-200",
      clicked: "bg-gy-100",
      disabled: "bg-gy-100",
    },
    textColor: {
      default: "text-[#0b9a4e]",
      pressing: "text-[#0b9a4e]",
      clicked: "text-[#0b9a4e]",
      disabled: "text-[#c0c4cd]",
    },
  },
};

export const sizePresets: Record<string, SizePreset> = {
  L: {
    width: "w-[21.4375rem]",
    textSize: "header-h4",
    iconSize: "w-[1.5rem] h-[1.5rem]",
    rounded: "border-round",
    padding: "px-4 py-3",
  },
  L_Thin: {
    width: "w-[21.4375rem]",
    textSize: "body-rg-500",
    iconSize: "w-[1.125rem] h-[1.125rem]",
    rounded: "border-hard",
    padding: "px-4 py-2",
  },
  M: {
    width: "w-[15.875rem]",
    height: "h-[3.25rem]",
    textSize: "header-h4",
    iconSize: "w-[1.5rem] h-[1.5rem]",
    rounded: "border-round",
    padding: "px-4 py-3",
  },
  S: {
    width: "w-[10.3125rem]",
    textSize: "body-rg-500",
    iconSize: "w-[1.125rem] h-[1.125rem]",
    rounded: "border-hard",
    padding: "px-4 py-2",
  },
  XS: {
    width: "w-[10.3125rem]",
    textSize: "body-sm-500",
    iconSize: "w-[0.875rem] h-[0.875rem]",
    rounded: "border-hard",
    padding: "px-4 py-2",
  },
};
