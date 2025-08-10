import type { CommonResponse } from "./common";

// 개별 가입 요청 정보
export interface MemberJoinReqeust {
  joinRequestId: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  gender: "MALE" | "FEMALE";
  level: string;
  createdAt: string; //ISO 날짜
  updatedAt?: string;
}

// 페이징된 응답을 위한 구조
export interface MemberJoinReqeustList {
  content: MemberJoinReqeust[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

//공통 응답 타입
export type MemberJoinRequestResponse = CommonResponse<MemberJoinReqeustList>;
