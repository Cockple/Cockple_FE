import api from "../api";

export interface JoinRequestResponse {
  code: string;
  message: string;
  data: {
    imgUrl?: string;
    imgKey?: string;
  };
  errorReason?: {
    code: string;
    message: string;
    httpStatus: string;
  };
  success: boolean;
}
// 연두 : GroupDetailMemberDefault 페이지에서 사용
export const joinParty = async (partyId: number): Promise<JoinRequestResponse> => {
  const response = await api.post<JoinRequestResponse>(`/api/parties/${partyId}/join-requests`);
  return response.data;
};
