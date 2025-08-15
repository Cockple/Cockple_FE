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
  imgKey?: string;            // 모임 이미지 key
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

export const updateParty = async (partyId: number, payload: UpdatePartyRequest) => {
  const response = await api.patch<UpdatePartyResponse>(`/api/parties/${partyId}`, payload);
  return response.data;
};