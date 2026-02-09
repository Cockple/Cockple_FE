import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { WorkoutDayEntry } from "@/components/home/WorkoutDayEntry";
import { addDays } from "@/utils/dateUtils";
import type { Swiper as SwiperClass } from "swiper";
import type { CalendarData, Exercise, Week, DayOfWeek } from "@/types/calendar";
import { getMyExerciseCalendarApi } from "@/api/exercise/getMyExerciseCalendarApi";
import CustomhomeWeekly from "@/components/home/CustomhomeWeekly";
import { useNavigate } from "react-router-dom";

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

// 월요일 시작 주 생성 헬퍼 함수
const generateMondayBasedWeeks = (
  startDate: string,
  endDate: string,
  exercisesMap: Record<string, Exercise[]> = {},
): Week[] => {
  const weeks: Week[] = [];
  // 로컬 시간 기준 파싱
  const parseDate = (str: string) => {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  // 시작일을 이전 월요일로 조정 (0: 일요일, 1: 월요일)
  const startDay = start.getDay();
  const diffToMon = startDay === 0 ? -6 : 1 - startDay;
  start.setDate(start.getDate() + diffToMon);

  // 종료일을 다음 일요일로 조정
  const endDay = end.getDay();
  const diffToSun = endDay === 0 ? 0 : 7 - endDay;
  end.setDate(end.getDate() + diffToSun);

  const current = new Date(start);
  const dayOfWeekMap = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  while (current <= end) {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const year = current.getFullYear();
      const month = (current.getMonth() + 1).toString().padStart(2, "0");
      const day = current.getDate().toString().padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      weekDays.push({
        date: dateStr,
        dayOfWeek: dayOfWeekMap[current.getDay()] as DayOfWeek,
        exercises: exercisesMap[dateStr] || [],
      });
      current.setDate(current.getDate() + 1);
    }

    weeks.push({
      weekStartDate: weekDays[0].date,
      weekEndDate: weekDays[6].date,
      days: weekDays,
    });
  }
  return weeks;
};

// 초기 빈 캘린더 값 (2주 전 ~ 2주 후)
const buildInitialCalendar = () => {
  const today = getTodayString();

  const startDate = addDays(today, -14);
  const endDate = addDays(today, 14);

  return {
    startDate,
    endDate,
    weeks: generateMondayBasedWeeks(startDate, endDate),
  };
};

export const MyExerciseCalendar = ({ setCount }: MyExerciseCalendarProps) => {
  const navigate = useNavigate();
  const [calendarData, setCalendarData] = useState<CalendarData>(() =>
    buildInitialCalendar(),
  );
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const swiperRef = useRef<SwiperClass | null>(null);
  const inFlightRef = useRef(false);

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
      baseIndex?: number,
    ) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      try {
        const newData = await getMyExerciseCalendarApi(startDate, endDate);

        // API 데이터를 월요일 기준으로 재가공 (Flatten -> Regroup)
        const exercisesMap: Record<string, Exercise[]> = {};
        newData.weeks.forEach(w =>
          w.days.forEach(d => {
            if (d.exercises.length > 0) {
              exercisesMap[d.date] = d.exercises;
            }
          }),
        );

        newData.weeks = generateMondayBasedWeeks(
          newData.startDate,
          newData.endDate,
          exercisesMap,
        );

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
                  swiperRef.current?.update();
                  swiperRef.current?.slideTo(
                    (baseIndex ?? 0) + uniqueNewWeeks.length,
                    0,
                  );
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
          // API 데이터 로드 후 오늘 날짜가 있는 위치로 슬라이드 이동
          const todayStr = getTodayString();
          const todayIndex = newData.weeks.findIndex(w =>
            w.days.some(d => d.date === todayStr),
          );
          if (todayIndex !== -1) {
            setTimeout(() => swiperRef.current?.slideTo(todayIndex, 0), 0);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        inFlightRef.current = false;
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
      if (inFlightRef.current) return;
      const buffer = 2;
      if (swiper.activeIndex >= calendarData.weeks.length - buffer) {
        const newStartDate = addDays(calendarData.endDate, 1);
        const newEndDate = addDays(newStartDate, 13);
        fetchAndProcessData(newStartDate, newEndDate, "future");
      }
      if (swiper.activeIndex <= buffer - 1) {
        const newEndDate = addDays(calendarData.startDate, -1);
        const newStartDate = addDays(newEndDate, -13);
        fetchAndProcessData(
          newStartDate,
          newEndDate,
          "past",
          swiper.activeIndex,
        );
      }
    },
    [calendarData, fetchAndProcessData],
  );

  const [initialSlideIndex] = useState(() => {
    const { weeks } = buildInitialCalendar();
    const todayStr = getTodayString();
    const todayWeekIndex = weeks.findIndex(week =>
      week.days.some(day => day.date === todayStr),
    );
    return todayWeekIndex === 0 ? 1 : todayWeekIndex;
  });

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

  const handleExerciseClick = (partyId: number) => {
    navigate(`/group/${partyId}?date=${selectedDate}`);
  };

  return (
    <>
      <div className="w-full h-17">
        <CustomhomeWeekly
          weeks={calendarData.weeks}
          selectedDate={selectedDate}
          exerciseDays={exerciseDays}
          onClick={handleDateClick}
          onSlideChange={handleSlideChange}
          initialSlide={initialSlideIndex}
          onSwiper={swiper => (swiperRef.current = swiper)}
        />
      </div>
      <WorkoutDayEntry
        exerciseData={selectedDayExercises}
        onExerciseClick={handleExerciseClick}
      />
    </>
  );
};
