import medal1 from "@/assets/icons/medal_1.svg";
import medal2 from "@/assets/icons/medal_2.svg";
import medal3 from "@/assets/icons/medal_3.svg";

import OnboardingImg1 from "@/assets/images/onboarding1.png?url";
import OnboardingImg2 from "@/assets/images/onboarding2.png?url";
import OnboardingImg3 from "@/assets/images/onboarding3.png?url";

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

export const TEXT_MAP = [
  {
    title: "내 급수에 맞는 모임과 함께 운동해요",
    text1: "급수 정보와 지역을 기반으로,",
    text2: "나와 잘 맞는 운동 모임을 추천해드려요.",
    img: OnboardingImg1,
  },
  {
    title: "내가 원하는 모임을 만들어보세요",
    text1: "급수 정보와 지역을 기반으로,",
    text2: "모임 구성원을 추천해드려요",
    img: OnboardingImg2,
  },
  {
    title: "운동 기록부터 대회 입상까지,",
    title2: "한 눈에 정리해보세요 ",
    text1: "꾸준히 쌓이는 기록으로",
    text2: "성장을 눈으로 확인해보세요",
    img: OnboardingImg3,
  },
];
