import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { useState } from "react";
import MonthNum from "./MonthNum";
import ArrowLeft from "@/assets/icons/arrow_left.svg?url";
import ArrowRight from "@/assets/icons/arrow_right.svg?url";

interface MonthlyCalendarProps {
  selectedDate?: number | string;
  onClick?: (date: number | string) => void;
  exerciseDays?: string[]; //날짜 문자열 기반
}

export default function MonthlyCalendar({
  exerciseDays = [],
  onClick,
}: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

  const allDates = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
  });

  const weeks = [];
  for (let i = 0; i < allDates.length; i += 7) {
    weeks.push(allDates.slice(i, i + 7));
  }

  return (
    <div className="w-86 px-4 flex-col items-center gap-4">
      {/* 상단 네비게이션 */}
      <div className="flex justify-between items-center w-full">
        <img
          src={ArrowLeft}
          alt=""
          className="size-4 cursor-pointer"
          onClick={() => setCurrentDate(pre => subMonths(pre, 1))}
        />
        <p className="body-rg-600">{format(currentDate, "yyyy.MM")}</p>
        <img
          src={ArrowRight}
          alt=""
          className="size-4 cursor-pointer"
          onClick={() => setCurrentDate(pre => addMonths(pre, 1))}
        />
      </div>

      {/* 요일 */}
      <div className="flex justify-between mt-4">
        {weekDays.map(day => (
          <div key={day} className="w-11 text-center body-rg-500 text-black">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="flex flex-col mt-2">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex justify-between">
            {week.map((date, dIdx) => {
              const day = format(date, "d");
              const full = format(date, "yyyy-MM-dd");
              const isCurrent = isSameMonth(date, currentDate);
              const isSunday = date.getDay() === 0;
              const hasDot = exerciseDays.includes(full);

              return (
                <MonthNum
                  key={dIdx}
                  day={day}
                  color={isSunday ? "red" : "black"}
                  disabled={!isCurrent}
                  hasDot={hasDot}
                  date={day}
                  status={selected === full ? "clicked" : "default"}
                  onClick={() => {
                    setSelected(full);
                    onClick?.(full);
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
