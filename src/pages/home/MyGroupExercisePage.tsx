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

  // 프로그램적 slideTo 이후 onSlideChange 무시
  const ignoreNextSlideChange = useRef(false);
  // 오늘 주로 스냅은 최초 1회만
  const hasSnappedToToday = useRef(false);
  // initialSlide는 최초 마운트 1회만 읽히므로 ref에 고정
  const initialSlideRef = useRef<number>(0);

  // 초기 로딩
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const orderType = sortOption === "최신순" ? "LATEST" : "POPULARITY";
        const res = await fetchMyGroupCalendar({
          orderType,
          startDate: null,
          endDate: null,
        });

        // ✅ 빈 주 보정
        const weeks =
          res.weeks && res.weeks.length > 0
            ? res.weeks
            : generateWeeksFromRange(res.startDate, res.endDate);

        setCalendar({
          ...res,
          weeks,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [sortOption]);

  // 주 병합(중복 제거)
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
          const reqStart = addDays(calendar.endDate, 1);
          const reqEnd = addDays(reqStart, 13);
          const res = await fetchMyGroupCalendar({
            orderType,
            startDate: reqStart,
            endDate: reqEnd,
          });

          // ✅ 빈 주 보정 + endDate 갱신 유지
          const weeks =
            res.weeks && res.weeks.length > 0
              ? res.weeks
              : generateWeeksFromRange(res.startDate, res.endDate);

          setCalendar(prev =>
            prev
              ? {
                  startDate: prev.startDate,
                  endDate: res.endDate, // res.endDate로 한 칸 전진
                  weeks: mergeWeeks(prev.weeks, weeks),
                }
              : { ...res, weeks },
          );
        } else {
          // 과거 주 prepend
          const reqEnd = addDays(calendar.startDate, -1);
          const reqStart = addDays(reqEnd, -13);
          const res = await fetchMyGroupCalendar({
            orderType,
            startDate: reqStart,
            endDate: reqEnd,
          });

          // ✅ 빈 주 보정 + startDate 갱신 유지
          const weeks =
            res.weeks && res.weeks.length > 0
              ? res.weeks
              : generateWeeksFromRange(res.startDate, res.endDate);

          // 현재 인덱스/추가 갯수 계산(중복 제외)
          const current = swiperRef.current?.activeIndex ?? 0;
          const added = weeks.filter(
            w => !calendar.weeks.some(x => x.weekStartDate === w.weekStartDate),
          ).length;

          setCalendar(prev =>
            prev
              ? {
                  startDate: res.startDate, // res.startDate로 한 칸 뒤로 확장
                  endDate: prev.endDate,
                  weeks: mergeWeeks(weeks, prev.weeks),
                }
              : { ...res, weeks },
          );

          // 앞에 붙였으면 현재 보던 위치 보정
          if (swiperRef.current && added > 0) {
            setTimeout(() => {
              ignoreNextSlideChange.current = true;
              swiperRef.current!.slideTo(current + added, 0);
            }, 0);
          }
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

  // 빈 주 보정 (초기 상태 전용)
  const processedWeeks = useMemo(() => {
    if (!calendar) return null;
    if (!calendar.weeks || calendar.weeks.length === 0) {
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

  // initialSlide는 최초에만 고정 전달
  useEffect(() => {
    initialSlideRef.current = initialSlideIndex;
  }, [initialSlideIndex]);

  // 첫 데이터 준비되면 오늘 주로 1회 스냅
  useEffect(() => {
    if (!processedWeeks?.length) return;
    if (!swiperRef.current) return;
    if (hasSnappedToToday.current) return;

    hasSnappedToToday.current = true;
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
              initialSlide={initialSlideRef.current}
              onSlideChange={handleSlideChange}
              setSwiperRef={swiper => (swiperRef.current = swiper)}
              onClick={setSelectedDate}
            />
          )}
        </div>

        <div className="flex justify-end w-full h-7">
          <Sort
            label={sortOption}
            isOpen={isSortOpen}
            onClick={() => setIsSortOpen(!isSortOpen)}
          />
        </div>

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
                  imageSrc={ex.profileImageUrl || null}
                  onClick={() => {}}
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
