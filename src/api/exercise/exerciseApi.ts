import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { AxiosError } from "axios";
import axios from "axios";

export const joinExercise = async (exerciseId: number) => {
  try {
    await api.post(`/api/exercises/${exerciseId}/participants`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ message: string }>;

      const errorMessage =
        axiosError.response?.data?.message || "운동 신청에 실패했습니다.";

      alert(errorMessage);
      throw err;
    }
  }
};

export const cancelExercise = async (exerciseId: number) => {
  try {
    await api.delete(`/api/exercises/${exerciseId}/participants/my`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ message: string }>;

      const errorMessage =
        axiosError.response?.data?.message || "운동 신청에 실패했습니다.";

      alert(errorMessage);
      throw err;
    }
  }
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
