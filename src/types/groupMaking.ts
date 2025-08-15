import type { CommonResponse } from "./common";
//그룹 만들기
export type GroupMakingRequestDto = {
  partyName: string;
  partyType: string;
  femaleLevel: string[];
  maleLevel?: string[];
  addr1: string;
  addr2: string;
  activityDay: string[];
  activityTime: string;
  designatedCock: string;
  joinPrice: number;
  price: number;
  minBirthYear: number;
  maxBirthYear: number;
  content?: string;
  imgUrl?: string;
};

export type GroupMaking = {
  partyId: number;
  createdAt: string;
};

export type GroupMakingResponseDTO = CommonResponse<GroupMaking>;
//신규 멤버 추천
export type SuggestParms = {
  // partyId: number;
  levelSearch?: string;
  page?: number;
  size?: number;
  sort?: string[];
};
