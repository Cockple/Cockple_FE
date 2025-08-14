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
import type { Week } from "../../types/calendar";

/* --------- 유틸 --------- */
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

/** Week[](UI) → CalWeek[](API) 로 변환 (빈 주 채우기에 사용) */
function uiWeeksToCalWeeks(ui: Week[]): CalWeek[] {
  return ui.map(w => ({
    weekStartDate: w.weekStartDate,
    weekEndDate: w.weekEndDate,
    days: w.days.map(d => ({
      date: d.date,
      dayOfWeek: d.dayOfWeek, // Day["dayOfWeek"]가 API enum과 동일하다고 가정
      exercises: [] as CalExercise[], // 빈 주 생성이므로 빈 배열
    })),
  }));
}

/** CalWeek[](API) → Week[](UI) 로 변환 (CustomWeekly에 내려줄 때 사용) */
function calWeeksToUiWeeks(cal: CalWeek[]): Week[] {
  return cal.map(w => ({
    weekStartDate: w.weekStartDate,
    weekEndDate: w.weekEndDate,
    days: w.days.map(d => ({
      date: d.date,
      dayOfWeek: d.dayOfWeek,
      exercises: d.exercises.map(ex => ({
        ...ex,
        profileImageUrl: ex.profileImageUrl ?? "",
      })),
    })),
  }));
}

/** API 응답에 weeks가 비어있으면 Week[]로 채운 뒤 CalWeek[]로 변환해 넣어주는 보정 */
function ensureCalWeeks(res: MyGroupCalendarResponse): MyGroupCalendarResponse {
  if (res.weeks && res.weeks.length > 0) return res;
  const uiWeeks = generateWeeksFromRange(res.startDate, res.endDate); // Week[]
  const calWeeks = uiWeeksToCalWeeks(uiWeeks); // CalWeek[]
  return { ...res, weeks: calWeeks };
}

export const MyGroupExercisePage = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"최신순" | "인기순">("최신순");

  /** ✅ 상태에는 항상 API 타입만 */
  const [calendar, setCalendar] = useState<MyGroupCalendarResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const swiperRef = useRef<SwiperClass | null>(null);

  const ignoreNextSlideChange = useRef(false);
  const hasSnappedToToday = useRef(false);
  const initialSlideRef = useRef<number>(0);

  /* 초기 로딩 */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const orderType = sortOption === "최신순" ? "LATEST" : "POPULARITY";
        const raw = await fetchMyGroupCalendar({
          orderType,
          startDate: null,
          endDate: null,
        });
        setCalendar(ensureCalWeeks(raw)); // ✅ 상태 보관은 CalWeek[]
      } finally {
        setLoading(false);
      }
    })();
  }, [sortOption]);

  /* 주 병합(중복 제거) - 모두 CalWeek[] */
  const mergeWeeks = (base: CalWeek[], incoming: CalWeek[]) => {
    const seen = new Set(base.map(w => w.weekStartDate));
    const uniq = incoming.filter(w => !seen.has(w.weekStartDate));
    return [...base, ...uniq];
  };

  /* 추가 로딩 */
  const loadMore = useCallback(
    async (direction: "past" | "future") => {
      if (!calendar) return;
      setFetchingMore(true);
      try {
        const orderType = sortOption === "최신순" ? "LATEST" : "POPULARITY";

        if (direction === "future") {
          const reqStart = addDays(calendar.endDate, 1);
          const reqEnd = addDays(reqStart, 13);
          const raw = await fetchMyGroupCalendar({
            orderType,
            startDate: reqStart,
            endDate: reqEnd,
          });
          const res = ensureCalWeeks(raw); // ✅ 보정
          setCalendar(prev =>
            prev
              ? {
                  startDate: prev.startDate,
                  endDate: res.endDate,
                  weeks: mergeWeeks(prev.weeks, res.weeks),
                }
              : res,
          );
        } else {
          const reqEnd = addDays(calendar.startDate, -1);
          const reqStart = addDays(reqEnd, -13);
          const raw = await fetchMyGroupCalendar({
            orderType,
            startDate: reqStart,
            endDate: reqEnd,
          });
          const res = ensureCalWeeks(raw); // ✅ 보정

          const current = swiperRef.current?.activeIndex ?? 0;
          const added = res.weeks.filter(
            w => !calendar.weeks.some(x => x.weekStartDate === w.weekStartDate),
          ).length;

          setCalendar(prev =>
            prev
              ? {
                  startDate: res.startDate,
                  endDate: prev.endDate,
                  weeks: mergeWeeks(res.weeks, prev.weeks),
                }
              : res,
          );

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

  /** ✅ UI에 내려줄 주 = 항상 Week[] 로 변환 */
  const processedWeeks: Week[] | null = useMemo(() => {
    if (!calendar) return null;
    return calWeeksToUiWeeks(calendar.weeks);
  }, [calendar]);

  const initialSlideIndex = useMemo(() => {
    if (!processedWeeks) return 0;
    const today = getTodayString();
    const idx = processedWeeks.findIndex(w =>
      w.days.some(d => d.date === today),
    );
    return idx >= 0 ? idx : 0;
  }, [processedWeeks]);

  useEffect(() => {
    initialSlideRef.current = initialSlideIndex;
  }, [initialSlideIndex]);

  useEffect(() => {
    if (!processedWeeks?.length) return;
    if (!swiperRef.current) return;
    if (hasSnappedToToday.current) return;

    hasSnappedToToday.current = true;
    ignoreNextSlideChange.current = true;
    swiperRef.current.slideTo(initialSlideIndex, 0);
  }, [processedWeeks, initialSlideIndex]);

  /** 점 표시 날짜 (UI용) */
  const exerciseDays = useMemo(() => {
    if (!calendar) return [];
    const s = new Set<string>();
    calendar.weeks.forEach(w =>
      w.days.forEach(d => d.exercises.length && s.add(d.date)),
    );
    return Array.from(s);
  }, [calendar]);

  /** 선택 날짜 운동 목록 (API 상태에서 직접 찾기 → 타입 깔끔) */
  const selectedDayExercises: CalExercise[] = useMemo(() => {
    if (!calendar) return [];
    const found = calendar.weeks
      .flatMap(w => w.days)
      .find(d => d.date === selectedDate);
    return found?.exercises ?? [];
  }, [calendar, selectedDate]);

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
                  imageSrc={ex.profileImageUrl ?? ""}
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
