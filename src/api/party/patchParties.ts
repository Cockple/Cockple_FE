//모임 정보 수정
import api from "../api";

export interface UpdatePartyRequest {
  activityDay: string[];      // 활동 요일 배열
  activityTime: string;       // 활동 시간
  designatedCock?: string;    // 지정콕
  joinPrice?: number;         // 가입비
  price?: number;             // 회비
  keyword?: string[];         // 키워드
  content?: string;           // 소개 내용
  imgKeys?: string[]; // 여러 장
}
export interface PartyDetail {
  partyId: number;
  partyName: string;
  status: "MEMBER" | "NOT_MEMBER";
  role?: string;
  addr1: string;
  addr2: string;
  activityDays: string[];
  activityTime: string;
  maleLevel: string[];
  femaleLevel: string[];
  minBirthYear?: number;
  maxBirthYear?: number;
  price: number;
  joinPrice: number;
  designatedCock: string;
  keywords: string[];
  content?: string;
  partyImgUrls?: string[];
}

export interface UpdatePartyResponse {
  code: string;
  message: string;
  data: object;
  errorReason?: {
    code: string;
    message: string;
    httpStatus: string;
  };
  success: boolean;
}

//모임 수정
export const updateParty = async (partyId: number, payload: UpdatePartyRequest) => {
  const response = await api.patch<UpdatePartyResponse>(`/api/parties/${partyId}`, payload);
  return response.data;
};

//모임 상세 조회
export const getPartyDetail = async (partyId: number) => {
  const res = await api.get<{ success: boolean; data: PartyDetail }>(
    `/api/parties/${partyId}`
  );
  return res.data.data;
};

//모임장 모임 삭제
export const deleteParty = async (partyId: number) => {
  try {
    const response = await api.patch(`/api/parties/${partyId}/status`);
    return response.data; 
  } catch (error: any) {
    console.error("모임 삭제 API 호출 실패:", error);
    throw error.response?.data || error;
  }
};