// 파티ID -> 룸ID
import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { CommonResponse } from "../../types/common";

export async function getRoomIdByPartyId(partyId: number): Promise<number> {
  const { data } = await api.get<CommonResponse<{ roomId: number }>>(
    `/api/chats/parties/${partyId}`,
  );
  return data.data.roomId;
}

export function useRoomIdByPartyId(partyId: number, enabled = true) {
  return useQuery({
    queryKey: ["roomIdByParty", partyId],
    queryFn: () => getRoomIdByPartyId(partyId),
    enabled: enabled && Number.isFinite(partyId),
    staleTime: 60_000,
  });
}
