import type { Week, Day } from "../types/calendar";

// 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환
export const formatDate = (date: Date): string =>
  date.toISOString().split("T")[0];

// N일 전/후 날짜를 계산
export const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

// 요일 이름을 반환 (API 형식과 동일하게)
const getDayOfWeekName = (dayIndex: number): Day["dayOfWeek"] => {
  const days: Day["dayOfWeek"][] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return days[dayIndex];
};

/**
 * 시작일과 종료일로 운동이 없는 빈 Week[] 구조를 생성합니다.
 * API가 weeks: [] 로 응답했을 때 사용됩니다.
 */
export const generateWeeksFromRange = (
  startDateStr: string,
  endDateStr: string,
): Week[] => {
  const weeks: Week[] = [];
  const currentDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // 주의 시작을 일요일로 맞춤
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());

  while (currentDate <= endDate) {
    const days: Day[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentDate);
      dayDate.setDate(dayDate.getDate() + i);
      days.push({
        date: formatDate(dayDate),
        dayOfWeek: getDayOfWeekName(dayDate.getDay()),
        exercises: [],
      });
    }

    weeks.push({
      weekStartDate: days[0].date,
      weekEndDate: days[6].date,
      days,
    });

    currentDate.setDate(currentDate.getDate() + 7);
  }
  return weeks;
};
