import medal1 from "@/assets/icons/medal_1.svg";
import medal2 from "@/assets/icons/medal_2.svg";
import medal3 from "@/assets/icons/medal_3.svg";

export const MEDAL = [
  { label: "금메달", icon: medal1 },
  {
    label: "은메달",
    icon: medal2,
  },
  {
    label: "동메달",
    icon: medal3,
  },
];

export const keywordMap: Record<string, string> = {
  "브랜드 스폰": "BRAND",
  "가입비 무료": "FREE",
  친목: "FRIENDSHIP",
  "운영진이 게임을 짜드려요": "MANAGER_MATCH",
};
