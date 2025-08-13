import api from "../api";

export interface ContestRecord {
  contestId: number;
  contestName: string;
  type: string;
  level: string;
  date?: string;
  medalImgUrl: string;
}

export interface ApiResponse<T = any> {
  code: string;
  message: string;
  data: T;
  errorReason?: {
    code: string;
    message: string;
    httpStatus: string;
  };
  success: boolean;
}

// interface ContestDetailResponse {
//   imgUrl: string;
//   imgKey: string;
// }
// member.ts
export interface ContestDetailResponse {
  contestName: string;
  date: string;
  type: string;
  level: string;
  content: string;
  contestImgs?: string[];
  contestVideos?: string[];
}

// 다른 회원 메달 조회
export const getOtherUserMedals = async (memberId: number) => {
  const response = await api.get(`/api/members/${memberId}/medals`, {
    params: { memberId },
  });
  return response.data.data;
};

// 다른 회원 대회 리스트
export const getMemberContests = async (memberId: number, medalType?: 'NONE' | '전체') => {
  try {
    const params: any = {};
    if (medalType) params.medalType = medalType;

    const response = await api.get<ApiResponse<ContestRecord[]>>(
      `/api/members/${memberId}/contests`,
      { params: { memeberId: memberId } } //서버측...오타...그냥 프론트에서 바꿀게욤
    );


    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('다른 회원 API error:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('다른 회원 Request failed:', error);
    return [];
  }
};

//다른 회원 대회 기록 상세 조회
export const getMemberContestDetail = async (memberId: number, contestId: number) => {
  try {
    const response = await api.get<{
      code: string;
      message: string;
      data: ContestDetailResponse;
      success: boolean;
      errorReason?: any;
    }>(`/api/members/${memberId}/contests/${contestId}`);

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error("API error:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
};
