import { endOfMonth, format, startOfMonth } from "date-fns";
import type { CommonResponse } from "../../types/common";
import api from "../api";
import { useQuery } from "@tanstack/react-query";

export interface CalExercise {
  exerciseId: number;
  isBookmarked: boolean;
  startTime: string;
  endTime: string;
  buildingName: string;
  femaleLevel: string[];
  maleLevel: string[];
  currentParticipants: number;
  maxCapacity: number;
}

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface CalDay {
  date: string;
  dayOfWeek: DayOfWeek;
  exercises: CalExercise[];
}

export interface CalWeek {
  weekStartDate: string;
  weekEndDate: string;
  days: CalDay[];
}

export interface PartyCalendarResponse {
  startDate: string;
  endDate: string;
  isMember: boolean;
  partyName: string;
  weeks: CalWeek[];
}

export const addDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export async function fetchPartyCalendar(params: {
  partyId: number;
  startDate?: string | null;
  endDate?: string | null;
}): Promise<PartyCalendarResponse> {
  const { partyId, startDate = null, endDate = null } = params;
  const { data } = await api.get<CommonResponse<PartyCalendarResponse>>(
    `/api/parties/${partyId}/exercises/calender`,
    {
      params: { startDate, endDate },
    },
  );

  return data.data;
}

export const useMonthlyPartyCalendar = (
  partyId?: number,
  currentMonth?: Date,
) => {
  return useQuery({
    queryKey: [
      "partyCalendar",
      partyId,
      format(currentMonth || new Date(), "yyyy-MM"),
    ],

    queryFn: () => {
      const startDate = format(
        startOfMonth(currentMonth || new Date()),
        "yyyy-MM-dd",
      );
      const endDate = format(
        endOfMonth(currentMonth || new Date()),
        "yyyy-MM-dd",
      );

      return fetchPartyCalendar({
        partyId: partyId!,
        startDate,
        endDate,
      });
    },

    enabled: !!partyId && !!currentMonth,
  });
};
