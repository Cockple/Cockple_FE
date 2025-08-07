import type { CommenResponse } from "./common";

//카카오 로그인
export type KakaoLoginResponseDTO = {
  accessToken: string;
  refreshToken: string;
  memberId: number;
  nickname: string;
  isNewMember: boolean;
};

//회원정보 상세 추가
export type OnBoarding = {
  memberName: string;
  gender: string;
  birth: string;
  level: string;
  imgKey?: string;
  keywords: string;
};
export type onBoardingRequestDto = CommenResponse<OnBoarding[]>;
