import api from "../api";

export interface ContestRecord {
  partyId: number;
  createdAt: string;
}

export interface ApiResponse {
  code: string;
  message: string;
  data: ContestRecord[];
  errorReason?: {
    code: string;
    message: string;
    httpStatus: string;
  };
  success: boolean;
}
//다른 회원 메달 조회
export const getOtherUserMedals = async (memberId: number) => {
  const response = await api.get(`/api/members/${memberId}/medals`);
  console.log(response);
  return response.data.data;
};

//다른 회원 대회 리스트
export const getMemberContests = async (memberId: number, medalType?: 'NONE' | '전체') => {
  try {
    const params: any = {};
    if (medalType) params.medalType = medalType;

    const response = await api.get<ApiResponse>(`/api/members/${memberId}/contests`, {
      params,
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('API error:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('Request failed:', error);
    return [];
  }
};

