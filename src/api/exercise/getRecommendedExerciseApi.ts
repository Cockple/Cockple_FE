import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "../../types/common";
import qs from "qs";

import api from "../api";
import type {
  RecommendCalendarData,
  RecommendedExerciseData,
} from "../../types/exerciseRecommend";

// 📌 필터 파라미터 타입
export interface FetchCalendarParams {
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

// ✅ 1. 추천 운동 '달력' API
export const fetchRecommendedCalendar = async (
  rawParams: FetchCalendarParams,
): Promise<RecommendCalendarData> => {
  const {
    startDate,
    endDate,
    isCockpleRecommend,
    addr1,
    addr2,
    levels,
    participationTypes,
    activityTimes,
    sortType,
  } = rawParams;

  const params = {
    startDate,
    endDate,
    isCockpleRecommend,
    addr1: addr1 || undefined,
    addr2: addr2 || undefined,
    levels,
    participationTypes,
    activityTimes,
    sortType,
  };

  const res = await api.get<CommonResponse<RecommendCalendarData>>(
    "/api/exercises/recommendations/calendar",
    {
      params,
      paramsSerializer: {
        serialize: params => qs.stringify(params, { arrayFormat: "repeat" }), // ✅ levels=A&levels=B 형식
      },
    },
  );
  return res.data.data;
};

// ✅ 2. 추천 운동 '목록' API
export const getRecommendedExercise =
  async (): Promise<RecommendedExerciseData> => {
    const res = await api.get<CommonResponse<RecommendedExerciseData>>(
      "/api/exercises/recommendations",
    );
    return res.data.data;
  };

// ✅ 2-1. 추천 운동 목록용 React Query 훅
export const useRecommendedExerciseApi = () =>
  useQuery({
    queryKey: ["recommended-exercise"],
    queryFn: getRecommendedExercise,
  });
