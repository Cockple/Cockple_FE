import api from "../api";

export interface CreateExercisePayload {
  date: string;
  buildingName: string;
  roadAddress: string;
  latitude: number;
  longitude: number;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  allowMemberGuestsInvitation: boolean;
  allowExternalGuests: boolean;
  notice?: string;
}

export const createExerciseApi = async (
  partyId: string,
  payload: CreateExercisePayload,
) => {
  const response = await api.post(`/api/parties/${partyId}/exercises`, payload);
  return response.data;
};
