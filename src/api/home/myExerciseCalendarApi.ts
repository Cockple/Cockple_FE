// src/api/myExerciseCalendarApi.ts

import type { CalendarData } from "../../types/calendar";
import type { CommenResponse } from "../../types/common";
import api from "../api";

/**
 * 내 운동 캘린더 데이터를 서버에서 가져옵니다.
 */
export const fetchMyCalendar = async (
  startDate: string | null,
  endDate: string | null,
): Promise<CalendarData> => {
  try {
    const response = await api.get<CommenResponse<CalendarData>>(
      "/api/exercises/my/calender",
      {
        params: { startDate, endDate },
      },
    );

    console.log(response);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "캘린더 데이터를 가져오지 못했습니다.",
      );
    }
  } catch (error) {
    console.error("내 캘린더 API 호출 중 에러 발생:", error);
    throw error;
  }
};
