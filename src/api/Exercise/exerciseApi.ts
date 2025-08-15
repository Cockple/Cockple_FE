import api from "../api";

export const joinExercise = async (exerciseId: number) => {
  await api.post(`/api/exercises/${exerciseId}/participants`);
};

export const cancelExercise = async (exerciseId: number) => {
  await api.delete(`/api/exercises/${exerciseId}/participants/my`);
};
