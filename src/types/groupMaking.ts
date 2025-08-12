import type { CommonResponse } from "./common";

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
