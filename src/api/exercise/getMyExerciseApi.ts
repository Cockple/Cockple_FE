import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "../../types/common";
import api from "../api";
import type { RecommendedExerciseData } from "../../types/exerciseRecommend";

export const getMyExerciseApi = async () => {
  const res = await api.get<CommonResponse<RecommendedExerciseData>>(
    "/api/exercises/parties/my",
  );

  return res.data.data;
};

export const useMyExerciseApi = () =>
  useQuery({
    queryKey: ["myexercise-list"],
    queryFn: getMyExerciseApi,
  });
