import api from "../api";

export const updateExerciseApi = async (
  exerciseId: string | number,
  payload: {
    date: string;
    buildingName: string;
    roadAddress: string;
    latitude: number;
    longitude: number;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    notice: string;
  },
) => {
  const { data } = await api.patch(`/api/exercises/${exerciseId}`, payload);
  return data;
};
