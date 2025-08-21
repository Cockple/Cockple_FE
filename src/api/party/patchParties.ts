//모임 정보 수정
import api from "../api";

export interface UpdatePartyRequest {
  activityDay: string[];      // 필수
  activityTime: string;       // 필수
  designatedCock?: string;    // 선택
  joinPrice?: number;         // 선택
  price?: number;             // 선택
  keyword?: string[];         // 선택
  content?: string;           // 선택
  imgKey?: string;            // 선택, 단일 이미지 key
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