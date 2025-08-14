import api from "../api";

export interface Member {
  memberId: number;
  nickname: string;
  profileImageUrl?: string | null;
  role: string;
  gender: 'MALE' | 'FEMALE';
  level: string;
  isMe: boolean;
}

export interface PartyMembersResponse {
  success: boolean;
  message: string;
  data: {
    summary: {
      totalCount: number;
      femaleCount: number;
      maleCount: number;
    };
    members: Member[]; 
  };
}


export const getPartyMembers = async (partyId: number) => {
  const response = await api.get<PartyMembersResponse>(`/api/parties/${partyId}/members`);
  return response.data;
};