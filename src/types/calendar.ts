/** 운동 정보 타입 */
export interface Exercise {
  exerciseId: number;
  partyId: number;
  partyName: string;
  buildingName: string;
  startTime: string;
  endTime: string;
  profileImageUrl: string;
}

/** 요일 이름 타입 */
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

/** 하루 정보 타입 */
export interface Day {
  date: string; // "YYYY-MM-DD"
  dayOfWeek: DayOfWeek;
  exercises: Exercise[];
}

/** 한 주 정보 타입 */
export interface Week {
  weekStartDate: string;
  weekEndDate: string;
  days: Day[];
}

/** API 응답의 'data' 필드 전체 타입 */
export interface CalendarData {
  startDate: string;
  endDate: string;
  weeks: Week[];
}
