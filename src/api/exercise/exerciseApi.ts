import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const joinExercise = async (exerciseId: number) => {
  await api.post(`/api/exercises/${exerciseId}/participants`);
};

export const cancelExercise = async (exerciseId: number) => {
  await api.delete(`/api/exercises/${exerciseId}/participants/my`);
};

export const getExercise = async (exerciseId: number) => {
  const { data } = await api.get(`/api/exercises/${exerciseId}`);
  return data;
};

//운동 상세 조회
export const useGetExerciseDetail = (exerciseId: number) => {
  return useQuery({
    queryKey: ["exerciseDetail", exerciseId],
    queryFn: () => getExercise(exerciseId),
    select: res => res.data,
  });
};
