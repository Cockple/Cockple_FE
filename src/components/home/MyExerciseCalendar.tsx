import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { WorkoutDayEntry } from "./WorkoutDayEntry";
import { addDays, generateWeeksFromRange } from "../../utils/dateUtils";
import type { Swiper as SwiperClass } from "swiper";
import type { CalendarData, Exercise } from "../../types/calendar";
import { getMyExerciseCalendarApi } from "../../api/exercise/getMyExerciseCalendarApi";
import CustomhomeWeekly from "./CustomhomeWeekly";

// 오늘 날짜 생성 헬퍼 함수
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface MyExerciseCalendarProps {
  setCount: (count: number) => void;
}

export const MyExerciseCalendar = ({ setCount }: MyExerciseCalendarProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const swiperRef = useRef<SwiperClass | null>(null);

  // 오늘 날짜 운동 개수 계산
  useEffect(() => {
    if (!calendarData) return;

    const todayStr = getTodayString();
    const allDays = calendarData.weeks.flatMap(w => w.days);
    const todayExercises =
      allDays.find(d => d.date === todayStr)?.exercises ?? [];

    setCount(todayExercises.length);
  }, [calendarData, setCount]);

  // 데이터 로딩 함수
  const fetchAndProcessData = useCallback(
    async (
      startDate: string | null,
      endDate: string | null,
      direction?: "past" | "future",
    ) => {
      const setLoading = direction ? setIsFetchingMore : setIsLoading;
      setLoading(true);
      try {
        const newData = await getMyExerciseCalendarApi(startDate, endDate);

        // API 응답 직후, weeks가 비어있으면 빈 캘린더를 생성해서 채워줌
        if (newData.weeks.length === 0) {
          newData.weeks = generateWeeksFromRange(
            newData.startDate,
            newData.endDate,
          );
        }

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
              setTimeout(() => swiperRef.current?.update(), 0);
              return {
                ...prev,
                endDate: newData.endDate,
                weeks: [...prev.weeks, ...uniqueNewWeeks],
              };
            } else {
              // past
              if (uniqueNewWeeks.length > 0) {
                setTimeout(() => {
                  swiperRef.current?.slideTo(uniqueNewWeeks.length, 0);
                  swiperRef.current?.update();
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

  // 초기 데이터 로딩
  useEffect(() => {
    fetchAndProcessData(null, null);
  }, [fetchAndProcessData]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  // 무한 스크롤 핸들러
  const handleSlideChange = useCallback(
    (swiper: SwiperClass) => {
      if (isFetchingMore || !calendarData) return;
      const buffer = 2;
      if (swiper.activeIndex >= calendarData.weeks.length - buffer) {
        const newStartDate = addDays(calendarData.endDate, 1);
        const newEndDate = addDays(newStartDate, 13);
        fetchAndProcessData(newStartDate, newEndDate, "future");
      }
      if (swiper.activeIndex <= buffer - 1) {
        const newEndDate = addDays(calendarData.startDate, -1);
        const newStartDate = addDays(newEndDate, -13);
        fetchAndProcessData(newStartDate, newEndDate, "past");
      }
    },
    [calendarData, isFetchingMore, fetchAndProcessData],
  );

  const initialSlideIndex = useMemo(() => {
    if (!calendarData?.weeks) return 1;
    const todayStr = getTodayString();
    const todayWeekIndex = calendarData.weeks.findIndex(week =>
      week.days.some(day => day.date === todayStr),
    );

    return todayWeekIndex === 0 ? 1 : todayWeekIndex;
  }, [calendarData]);

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
        {calendarData && (
          <CustomhomeWeekly
            weeks={calendarData.weeks}
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
