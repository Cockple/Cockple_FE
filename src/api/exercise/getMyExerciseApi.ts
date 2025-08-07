import { useQuery } from "@tanstack/react-query";
import type { CommenResponse } from "../../types/common";
import api from "../api";
import type { RecommendedExerciseData } from "./type";

export const getMyExerciseApi = async () => {
  const res = await api.get<CommenResponse<RecommendedExerciseData>>(
    "/api/exercises/parties/my",
  );

  return res.data.data;
};

export const useMyExerciseApi = () =>
  useQuery({
    queryKey: ["myexercise-list"],
    queryFn: getMyExerciseApi,
  });
