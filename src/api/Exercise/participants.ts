import api from "../api";

// interface CancelParticipantRequest {
//   isGuest: boolean;
// }

//특정 참가자 삭제 
export const cancelByLeader = async (
  exerciseId: number,
  participantId: number,
  isGuest: boolean = false
) => {
  return api.delete(`/api/exercises/${exerciseId}/participants/${participantId}`, {
    data: { isGuest },
  });
};