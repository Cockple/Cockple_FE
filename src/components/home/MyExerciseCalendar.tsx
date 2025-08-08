import { useState, useEffect, useMemo, useCallback } from "react";
import CustomWeekly from "./CustomWeekly";
import { WorkoutDayEntry } from "./WorkoutDayEntry";
import { addDays, generateWeeksFromRange } from "../../utils/dateUtils";
import type { Swiper as SwiperClass } from "swiper";
import type { CalendarData, Exercise, Week } from "../../types/calendar";
import { getMyExerciseCalendarApi } from "../../api/exercise/getMyExerciseCalendarApi";

// 오늘 날짜 생성 헬퍼 함수
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

        if (direction) {
          setCalendarData(prev => {
            if (!prev) return newData;
            const existingStarts = new Set(
              prev.weeks.map(w => w.weekStartDate),
            );
            const uniqueNewWeeks = newData.weeks.filter(
              w => !existingStarts.has(w.weekStartDate),
            );
            if (direction === "future") {
              const updatedWeeks = [...prev.weeks, ...uniqueNewWeeks];
              setTimeout(() => swiper?.update(), 0);
              return { ...prev, endDate: newData.endDate, weeks: updatedWeeks };
            } else {
              if (uniqueNewWeeks.length > 0) {
                setTimeout(() => {
                  swiper?.slideTo(uniqueNewWeeks.length, 0);
                  swiper?.update();
                }, 0);
              }
              return {
                ...prev,
                startDate: newData.startDate,
                weeks: [...uniqueNewWeeks, ...prev.weeks],
              };
            }
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

  // 초기 데이터 로딩 useEffect
  useEffect(() => {
    fetchAndProcessData(null, null);
  }, [fetchAndProcessData]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  //  handleSlideChange의 useCallback 의존성 배열에 fetchAndProcessData를 추가합니다.
  const handleSlideChange = useCallback(
    (swiper: SwiperClass) => {
      if (isFetchingMore || !calendarData) return;
      const buffer = 2;
      if (swiper.activeIndex >= calendarData.weeks.length - buffer) {
        const newStartDate = addDays(calendarData.endDate, 1);
        const newEndDate = addDays(newStartDate, 13);
        fetchAndProcessData(newStartDate, newEndDate, "future", swiper);
      }
      if (swiper.activeIndex <= buffer - 1) {
        const newEndDate = addDays(calendarData.startDate, -1);
        const newStartDate = addDays(newEndDate, -13);
        fetchAndProcessData(newStartDate, newEndDate, "past", swiper);
      }
    },
    [calendarData, isFetchingMore, fetchAndProcessData],
  );

  // --- 렌더링을 위한 데이터 가공 (이전과 동일) ---
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
            shadow={true}
          />
        )}
      </div>
      <WorkoutDayEntry exerciseData={selectedDayExercises} />
    </>
  );
};
