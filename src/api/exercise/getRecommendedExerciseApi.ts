import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "../../types/common";

import api from "../api";
import type {
  RecommendCalendarData,
  RecommendedExerciseData,
} from "../../types/exerciseRecommend";
interface FetchCalendarParams {
  startDate: string | null;
  endDate: string | null;
  isCockpleRecommend?: boolean;
  addr1?: string;
  addr2?: string;
  levels?: string[];
  participationTypes?: string[];
  activityTimes?: string[];
  sortType?: string;
}

export const fetchRecommendedCalendar = async (
  params: FetchCalendarParams,
): Promise<RecommendCalendarData> => {
  const res = await api.get<CommonResponse<RecommendCalendarData>>(
    "/api/exercises/recommendations/calendar",
    { params },
  );
  return res.data.data;
};
// --- 2. 추천 운동 '목록' 조회 ---

// API 호출 함수
export const getRecommendedExercise = async () => {
  const res = await api.get<CommonResponse<RecommendedExerciseData>>(
    "/api/exercises/recommendations",
  );
  return res.data.data;
};

// React Query 커스텀 훅
export const useRecommendedExerciseApi = () =>
  useQuery({
    queryKey: ["recommended-exercise"],
    queryFn: getRecommendedExercise,
  });
