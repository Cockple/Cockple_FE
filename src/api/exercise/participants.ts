import api from "../api";
import type { CancelSelfResponse } from "./exercises"; 

export const cancelByLeader = async (
  exerciseId: number,
  participantId: number,
  isGuest: boolean = false
): Promise<CancelSelfResponse> => {
  const response = await api.delete<CancelSelfResponse>(
    `/api/exercises/${exerciseId}/participants/${participantId}`,
    { data: { isGuest } }
  );
  return response.data;
};
