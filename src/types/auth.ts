import type { CommonResponse } from "./common";

//카카오 로그인
export type KakaoLoginResponseDTO = {
  accessToken: string;
  refreshToken: string;
  memberId: number;
  nickname: string;
  isNewMember: boolean;
  needsOnboarding: boolean;
};

//신규 앱 부팅
export type onboardingStatu = {
  needsOnboarding: boolean;
};

export type onboardingStatusDTO = CommonResponse<onboardingStatu>;

//회원정보 상세 추가
export type OnBoardingRequest = {
  memberName: string;
  gender: string;
  birth: string;
  level: string;
  imgKey?: string;
  keywords: string[];
};

export type OnBoardingResponseDto = CommonResponse<string>;
