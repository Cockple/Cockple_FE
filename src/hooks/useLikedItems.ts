import { useQuery } from "@tanstack/react-query";
import {
  fetchLikedGroupIds,
  fetchLikedExerciseIds,
} from "../api/bookmark/bookmark";

export const useLikedGroupIds = () => {
  return useQuery({
    queryKey: ["likedGroupIds"],
    queryFn: fetchLikedGroupIds,
  });
};

export const useLikedExerciseIds = () => {
  return useQuery({
    queryKey: ["likedExerciseIds"],
    queryFn: fetchLikedExerciseIds,
  });
};
