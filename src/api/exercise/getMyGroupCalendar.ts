import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { CommonResponse } from "../../types/common";

// 서버 enum에 맞춰 포맷
export type OrderType = "LATEST" | "POPULARITY";

export interface CalExercise {
  exerciseId: number;
  partyId: number;
  partyName: string;
  buildingName: string;
  startTime: string; // "18:00:00"
  endTime: string; // "20:00:00"
  profileImageUrl: string | null;
  isBookmarked: boolean;
  nowCapacity: number;
}

export interface CalDay {
  date: string; // "YYYY-MM-DD"
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  exercises: CalExercise[];
}

export interface CalWeek {
  weekStartDate: string; // "YYYY-MM-DD"
  weekEndDate: string; // "YYYY-MM-DD"
  days: CalDay[];
}

export interface MyGroupCalendarResponse {
  startDate: string;
  endDate: string;
  weeks: CalWeek[];
}

// 단건 호출 함수
export async function fetchMyGroupCalendar(params: {
  orderType: OrderType;
  startDate: string | null; // null이면 서버에서 기본 범위 처리 가능(백엔드 규칙에 맞게)
  endDate: string | null;
}) {
  const { orderType, startDate, endDate } = params;

  const { data } = await api.get<CommonResponse<MyGroupCalendarResponse>>(
    "/api/exercises/parties/my/calendar",
    {
      params: {
        orderType,
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
      },
    },
  );

  console.log(data.data);
  return data.data;
}

// 초기 범위용 간단 훅 (필요하면 이거 말고 페이지 컴포넌트에서 직접 fetchMyGroupCalendar를 호출해 누적 관리)
export function useMyGroupCalendar(
  orderType: OrderType,
  startDate: string | null,
  endDate: string | null,
) {
  return useQuery({
    queryKey: ["myGroupCalendar", { orderType, startDate, endDate }],
    queryFn: () => fetchMyGroupCalendar({ orderType, startDate, endDate }),
  });
}
