import { useState, useEffect, useMemo, useCallback } from "react";
import CustomWeekly from "./CustomWeekly";
import { WorkoutDayEntry } from "./WorkoutDayEntry";

import { addDays, generateWeeksFromRange } from "../../utils/dateUtils";
import type { Swiper as SwiperClass } from "swiper";
import type { CalendarData, Exercise, Week } from "../../types/calendar";
import { getMyExerciseCalendarApi } from "../../api/exercise/getMyExerciseCalendarApi";

// 타임존 문제를 해결하기 위한 '오늘 날짜' 생성 헬퍼 함수
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const MyExerciseCalendar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const fetchAndProcessData = useCallback(
    async (
      startDate: string | null,
      endDate: string | null,
      direction?: "past" | "future",
      swiper?: SwiperClass,
    ) => {
      const setLoading = direction ? setIsFetchingMore : setIsLoading;
      setLoading(true);
      try {
        const newData = await getMyExerciseCalendarApi(startDate, endDate);
        if (direction === "future") {
          setCalendarData(prev => {
            if (!prev) return newData;
            const existingStarts = new Set(
              prev.weeks.map(w => w.weekStartDate),
            );
            const uniqueNewWeeks = newData.weeks.filter(
              w => !existingStarts.has(w.weekStartDate),
            );
            return {
              ...prev,
              endDate: newData.endDate,
              weeks: [...prev.weeks, ...uniqueNewWeeks],
            };
          });
        } else if (direction === "past") {
          setCalendarData(prev => {
            if (!prev) return newData;
            const existingStarts = new Set(
              prev.weeks.map(w => w.weekStartDate),
            );
            const uniqueNewWeeks = newData.weeks.filter(
              w => !existingStarts.has(w.weekStartDate),
            );
            if (uniqueNewWeeks.length > 0) {
              setTimeout(() => swiper?.slideTo(uniqueNewWeeks.length, 0), 0);
            }
            return {
              ...prev,
              startDate: newData.startDate,
              weeks: [...uniqueNewWeeks, ...prev.weeks],
            };
          });
        } else {
          setCalendarData(newData);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchAndProcessData(null, null);
  }, [fetchAndProcessData]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  // 단순화된 무한 스크롤 로직
  const handleSlideChange = useCallback(
    (swiper: SwiperClass) => {
      if (isFetchingMore || !calendarData) return;

      if (swiper.isEnd) {
        const newStartDate = addDays(calendarData.endDate, 1);
        const newEndDate = addDays(newStartDate, 20); // 3주치
        fetchAndProcessData(newStartDate, newEndDate, "future", swiper);
      }

      if (swiper.isBeginning) {
        const newEndDate = addDays(calendarData.startDate, -1);
        const newStartDate = addDays(newEndDate, -20); // 3주치
        fetchAndProcessData(newStartDate, newEndDate, "past", swiper);
      }
    },
    [calendarData, isFetchingMore, fetchAndProcessData],
  );

  const processedWeeks = useMemo<Week[] | null>(() => {
    if (!calendarData) return null;
    if (calendarData.weeks.length === 0) {
      return generateWeeksFromRange(
        calendarData.startDate,
        calendarData.endDate,
      );
    }
    return calendarData.weeks;
  }, [calendarData]);

  const initialSlideIndex = useMemo(() => {
    if (!processedWeeks) return 0;
    const todayStr = getTodayString();
    const todayWeekIndex = processedWeeks.findIndex(week =>
      week.days.some(day => day.date === todayStr),
    );
    return todayWeekIndex > -1 ? todayWeekIndex : 1;
  }, [processedWeeks]);

  const exerciseDays = useMemo(() => {
    if (!calendarData) return [];
    const days = new Set<string>();
    calendarData.weeks.forEach(w =>
      w.days.forEach(d => {
        if (d.exercises.length > 0) days.add(d.date);
      }),
    );
    return Array.from(days);
  }, [calendarData]);

  const selectedDayExercises = useMemo<Exercise[] | null>(() => {
    if (!calendarData) return null;
    const allDays = calendarData.weeks.flatMap(w => w.days);
    return allDays.find(d => d.date === selectedDate)?.exercises ?? [];
  }, [selectedDate, calendarData]);

  if (isLoading) return <div>캘린더를 불러오는 중입니다...</div>;
  if (error) return <div>오류가 발생했습니다: {error.message}</div>;

  return (
    <>
      <div className="w-full h-17">
        {processedWeeks && (
          <CustomWeekly
            weeks={processedWeeks}
            selectedDate={selectedDate}
            exerciseDays={exerciseDays}
            onClick={handleDateClick}
            onSlideChange={handleSlideChange}
            initialSlide={initialSlideIndex}
          />
        )}
      </div>
      <WorkoutDayEntry exerciseData={selectedDayExercises} />
    </>
  );
};
