import {
  startOfWeek,
  endOfWeek,
  addDays,
  eachDayOfInterval,
  format,
  isToday,
} from "date-fns";
import { ko } from "date-fns/locale";

interface WeekDayT {
  dateObj: Date;
  day: string;
  date: string;
  full: string;
  isToday: boolean;
  dayNumber: number;
}

export function generateInfiniteDates(centerDate: Date, range = 90) {
  const start = startOfWeek(addDays(centerDate, -range), { weekStartsOn: 1 }); // 월요일 기준
  const end = endOfWeek(addDays(centerDate, range), { weekStartsOn: 1 });

  const allDates = eachDayOfInterval({ start, end });

  // 주 단위로 나누기
  const weeks: WeekDayT[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    const week = allDates.slice(i, i + 7).map(d => ({
      dateObj: d,
      day: format(d, "E", { locale: ko }), //요일, '월', '화', ...
      date: format(d, "d"), // 일, '1', '2', ...
      full: format(d, "yyyy-MM-dd"),
      isToday: isToday(d),
      dayNumber: d.getDay(), //요일번호, 0~6 (일~토)
    }));
    weeks.push(week);
  }

  return weeks;
}
