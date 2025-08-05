//카카오 로그인
export type KakaoLoginResponseDTO = {
  accessToken: string;
  refreshToken: string;
  memberId: number;
  nickname: string;
  isNewMember: boolean;
};
