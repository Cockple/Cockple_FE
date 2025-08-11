import "swiper/css";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import Sort from "../../components/common/Sort";
import CustomWeekly from "../../components/home/CustomWeekly";
import { Exercise_M } from "../../components/common/contentcard/Exercise_M";
import {
  fetchMyGroupCalendar,
  type CalExercise,
  type CalWeek,
  type MyGroupCalendarResponse,
} from "../../api/exercise/getMyGroupCalendar";
import type { Swiper as SwiperClass } from "swiper";
import { generateWeeksFromRange } from "../../utils/dateUtils";

const getTodayString = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const addDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const MyGroupExercisePage = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"최신순" | "인기순">("최신순");

  const [calendar, setCalendar] = useState<MyGroupCalendarResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const swiperRef = useRef<SwiperClass | null>(null);

  // onSlideChange에서 첫 1회 무시용(프로그램적으로 slideTo 했을 때)
  const ignoreNextSlideChange = useRef(false);

  // 초기 로딩
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const orderType = sortOption === "최신순" ? "LATEST" : "POPULARITY";
        const data = await fetchMyGroupCalendar({
          orderType,
          startDate: null,
          endDate: null,
        });
        setCalendar(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [sortOption]);

  // 주 병합
  const mergeWeeks = (base: CalWeek[], incoming: CalWeek[]) => {
    const seen = new Set(base.map(w => w.weekStartDate));
    const uniq = incoming.filter(w => !seen.has(w.weekStartDate));
    return [...base, ...uniq];
  };

  // 더 불러오기
  const loadMore = useCallback(
    async (direction: "past" | "future") => {
      if (!calendar) return;
      setFetchingMore(true);
      try {
        const orderType = sortOption === "최신순" ? "LATEST" : "POPULARITY";
        if (direction === "future") {
          const newStart = addDays(calendar.endDate, 1);
          const newEnd = addDays(newStart, 13);
          const data = await fetchMyGroupCalendar({
            orderType,
            startDate: newStart,
            endDate: newEnd,
          });
          setCalendar(prev =>
            prev
              ? {
                  startDate: prev.startDate,
                  endDate: data.endDate,
                  weeks: mergeWeeks(prev.weeks, data.weeks),
                }
              : data,
          );
        } else {
          const newEnd = addDays(calendar.startDate, -1);
          const newStart = addDays(newEnd, -13);
          const data = await fetchMyGroupCalendar({
            orderType,
            startDate: newStart,
            endDate: newEnd,
          });
          setCalendar(prev =>
            prev
              ? {
                  startDate: data.startDate,
                  endDate: prev.endDate,
                  weeks: mergeWeeks(data.weeks, prev.weeks),
                }
              : data,
          );

          // 앞에 주를 붙였으니 인덱스 보정
          setTimeout(() => {
            if (swiperRef.current) {
              const added = data.weeks.length;
              ignoreNextSlideChange.current = true;
              swiperRef.current.slideTo(added, 0);
            }
          }, 0);
        }
      } finally {
        setFetchingMore(false);
      }
    },
    [calendar, sortOption],
  );

  const handleSlideChange = useCallback(
    (swiper: SwiperClass) => {
      if (ignoreNextSlideChange.current) {
        ignoreNextSlideChange.current = false;
        return;
      }
      if (!calendar || fetchingMore) return;
      const buffer = 1;
      if (swiper.activeIndex >= calendar.weeks.length - 1 - buffer) {
        loadMore("future");
      } else if (swiper.activeIndex <= buffer) {
        loadMore("past");
      }
    },
    [calendar, fetchingMore, loadMore],
  );

  // 빈 주 보정
  const processedWeeks = useMemo(() => {
    if (!calendar) return null;
    if (calendar.weeks.length === 0) {
      return generateWeeksFromRange(calendar.startDate, calendar.endDate);
    }
    return calendar.weeks;
  }, [calendar]);

  // 오늘 포함 주 index
  const initialSlideIndex = useMemo(() => {
    if (!processedWeeks) return 0;
    const today = getTodayString();
    const idx = processedWeeks.findIndex(w =>
      w.days.some(d => d.date === today),
    );
    return idx >= 0 ? idx : 0;
  }, [processedWeeks]);

  // ✅ 데이터가 준비되면 강제로 오늘 주로 1회 맞춰주기(초기 위치 튐 방지)
  useEffect(() => {
    if (!processedWeeks?.length) return;
    if (!swiperRef.current) return;
    ignoreNextSlideChange.current = true;
    swiperRef.current.slideTo(initialSlideIndex, 0);
  }, [processedWeeks, initialSlideIndex]);

  // 점 표시용 날짜들
  const exerciseDays = useMemo(() => {
    if (!processedWeeks) return [];
    const s = new Set<string>();
    processedWeeks.forEach(w =>
      w.days.forEach(d => d.exercises.length && s.add(d.date)),
    );
    return Array.from(s);
  }, [processedWeeks]);

  // 선택 날짜의 운동 목록
  const selectedDayExercises: CalExercise[] = useMemo(() => {
    if (!processedWeeks) return [];
    const found = processedWeeks
      .flatMap(w => w.days)
      .find(d => d.date === selectedDate);
    // Ensure exercises are of type CalExercise[]
    return (found?.exercises ?? []) as CalExercise[];
  }, [processedWeeks, selectedDate]);

  if (loading) return <div>캘린더를 불러오는 중입니다...</div>;

  return (
    <div className="flex flex-col -mx-4 px-4 bg-white">
      <PageHeader title="내 모임 운동" />
      <div className="flex flex-col gap-3 my-2">
        <div className="h-17">
          {processedWeeks && (
            <CustomWeekly
              shadow={false}
              weeks={processedWeeks}
              selectedDate={selectedDate}
              exerciseDays={exerciseDays}
              initialSlide={initialSlideIndex}
              onSlideChange={handleSlideChange}
              setSwiperRef={swiper => (swiperRef.current = swiper)}
              onClick={setSelectedDate}
            />
          )}
        </div>

        {/* 정렬 UI */}
        <div className="flex justify-end w-full h-7">
          <Sort
            label={sortOption}
            isOpen={isSortOpen}
            onClick={() => setIsSortOpen(!isSortOpen)}
          />
        </div>

        {/* 선택 날짜의 운동 목록 */}
        <div className="flex flex-col gap-3">
          {selectedDayExercises.length > 0 ? (
            selectedDayExercises.map(ex => (
              <div
                className="flex flex-col pb-3 border-b-[1px] border-gy-200"
                key={ex.exerciseId}
              >
                <Exercise_M
                  id={ex.exerciseId}
                  title={ex.partyName}
                  date={selectedDate}
                  time={`${ex.startTime} ~ ${ex.endTime}`}
                  location={ex.buildingName}
                  imageSrc={ex.profileImageUrl ?? ""}
                  onClick={() => {
                    /* 상세 이동 등 */
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              해당 날짜에 내 모임 운동이 없습니다.
            </div>
          )}
        </div>
      </div>

      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selected={sortOption}
        onSelect={opt => setSortOption(opt as "최신순" | "인기순")}
      />
    </div>
  );
};
