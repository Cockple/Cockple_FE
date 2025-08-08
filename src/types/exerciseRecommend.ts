// src/types/exerciseRecommend.ts

/** 요일 이름 타입 */
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

/**
 * 캘린더 및 운동 목록 API에서 사용하는 표준 운동 정보 타입
 */
export interface Exercise {
  exerciseId: number;
  partyId: number;
  partyName: string;
  date: string;
  dayOfTheWeek?: string; // 목록 API에만 존재할 수 있음
  startTime: string;
  endTime: string;
  buildingName: string;
  imageUrl?: string;
  profileImageUrl?: string;
  isBookmarked: boolean;
}

/**
 * 추천 운동 목록 API의 'data' 필드 전체 타입
 */
export interface RecommendedExerciseData {
  totalExercises: number;
  exercises: Exercise[];
}

/** 캘린더의 하루 정보 타입 */
export interface Day {
  date: string;
  dayOfWeek: DayOfWeek;
  exercises: Exercise[]; // 이제 캘린더 API도 운동 정보를 포함
}

/** 캘린더의 한 주 정보 타입 */
export interface Week {
  weekStartDate: string;
  weekEndDate: string;
  days: Day[];
}

/** 캘린더 API 응답의 'data' 필드 타입 */
export interface RecommendCalendarData {
  startDate: string;
  endDate: string;
  weeks: Week[];
}
