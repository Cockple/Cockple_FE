import { useQuery } from "@tanstack/react-query";
import type { CommenResponse } from "../../types/common";
import api from "../api";

export interface Exercise {
  exerciseId: number;
  partyId: number;
  partyName: string;
  date: string; // "YYYY-MM-DD"
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  startTime: string; // "HH:mm:ss"
  endTime: string; // "HH:mm:ss"
  buildingName: string;
  profileImageUrl: string;
  isBookmarked: boolean;
}

export interface RecommendedExerciseData {
  totalExercises: number;
  exercises: Exercise[];
}

export const getRecommendedExercise = async () => {
  const res = await api.get<CommenResponse<RecommendedExerciseData>>(
    "/api/exercises/recommendations",
  );
  return res.data.data;
};

export const useRecommendedExerciseApi = () =>
  useQuery({
    queryKey: ["recommended-exercise"],
    queryFn: getRecommendedExercise,
  });
