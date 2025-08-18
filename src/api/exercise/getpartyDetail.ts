import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "../../types/common";
import api from "../api";

export interface PartyDetailResponse {
  partyId: number;
  partyName: string;
  memberStatus: "MEMBER" | "NOT_MEMBER"; // 필요 시 enum 확장
  memberRole: string;
  addr1: string;
  addr2: string;
  hasPendingJoinRequest: boolean;
  ownerId: number;
  activityDays: string[];
  activityTime: string;
  femaleLevel: string[];
  maleLevel: string[];
  minBirthYear: number;
  maxBirthYear: number;
  price: number;
  joinPrice: number;
  designatedCock: string;
  content: string;
  keywords: string[];
  partyImgUrl: string | null;
}

export const getPartyDetail = async (partyId: number) => {
  if (!partyId) {
    throw new Error("유효하지 않은 partyId");
  }
  const response = await api.get<CommonResponse<PartyDetailResponse>>(
    `/api/parties/${partyId}`,
  );
  console.log(response.data.data);
  return response.data.data;
};

export const usePartyDetail = (partyId: number) => {
  return useQuery({
    queryKey: ["partyDetail", partyId],
    queryFn: () => getPartyDetail(partyId),
    enabled: !!partyId,
    staleTime: 1000 * 60 * 5,
  });
};
