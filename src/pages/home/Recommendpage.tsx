import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import CustomWeekly from "../../components/home/CustomWeekly";
import { Exercise_M } from "../../components/common/contentcard/Exercise_M";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import Sort from "../../components/common/Sort";
import CheckBoxBtn from "../../components/common/DynamicBtn/CheckBoxBtn";
import FilterBtn from "../../components/common/DynamicBtn/FilterBtn";
import {
  useExerciseFilterStore,
  isFilterDirty,
} from "../../store/useExerciseFilterStore";
import { addDays, generateWeeksFromRange } from "../../utils/dateUtils";
import type { Swiper as SwiperClass } from "swiper";
import type {
  RecommendCalendarData,
  Exercise,
} from "../../types/exerciseRecommend";
import { fetchRecommendedCalendar } from "../../api/exercise/getRecommendedExerciseApi";
import { transformFiltersForApi } from "../../utils/filterUtils";

// 오늘 날짜 생성 헬퍼 함수
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const RecommendPage = () => {
  const navigate = useNavigate();
  // --- UI 및 필터 상태 ---
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");
  const { region, level, style, time, recommend, toggleRecommend } =
    useExerciseFilterStore();

  const filterState = useMemo(
    () => ({ region, level, style, time }),
    [region, level, style, time],
  );
  const filterStatus = isFilterDirty(filterState) ? "clicked" : "default";

  // --- 데이터 상태 ---
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [calendarData, setCalendarData] =
    useState<RecommendCalendarData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  // --- 데이터 로딩 함수 ---
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
        let params = {
          startDate,
          endDate,
          isCockpleRecommend: recommend,
          sortType: sortOption === "최신순" ? "LATEST" : "POPULARITY",
        };
        if (!recommend) {
          const apiFilters = transformFiltersForApi({
            region,
            level,
            style,
            time,
          });
          params = { ...params, ...apiFilters };
        }

        const newData = await fetchRecommendedCalendar(params);

        console.log(newData);

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
              return {
                ...prev,
                endDate: newData.endDate,
                weeks: [...prev.weeks, ...uniqueNewWeeks],
              };
            } else {
              // past
              if (uniqueNewWeeks.length > 0) {
                setTimeout(() => swiper?.slideTo(uniqueNewWeeks.length, 0), 0);
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
    [recommend, sortOption, region, level, style, time],
  );

  // 🔥 1. 필터/정렬 변경 시 데이터 새로고침을 위한 useEffect
  // useRef를 사용하여 첫 렌더링 시에는 실행되지 않도록 방지
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchAndProcessData(null, null);
    }
  }, [recommend, sortOption, region, level, style, time]);

  // 🔥 2. 최초 1회만 실행되는 초기 데이터 로딩 useEffect
  useEffect(() => {
    fetchAndProcessData(null, null);
  }, []);

  // --- 이벤트 핸들러 ---
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleSlideChange = useCallback(
    (swiper: SwiperClass) => {
      if (isFetchingMore || !calendarData) return;

      // 🔥 3. 요청하신대로 3주치씩 데이터를 가져오도록 수정
      if (swiper.isEnd) {
        const newStartDate = addDays(calendarData.endDate, 1);
        const newEndDate = addDays(newStartDate, 20); // 3주
        fetchAndProcessData(newStartDate, newEndDate, "future", swiper);
      }

      if (swiper.isBeginning) {
        const newEndDate = addDays(calendarData.startDate, -1);
        const newStartDate = addDays(newEndDate, -20); // 3주
        fetchAndProcessData(newStartDate, newEndDate, "past", swiper);
      }
    },
    [calendarData, isFetchingMore, fetchAndProcessData],
  );

  // --- 렌더링을 위한 데이터 가공 ---
  const processedWeeks = useMemo(() => {
    if (!calendarData) return null;
    if (calendarData.weeks.length === 0) {
      return generateWeeksFromRange(
        calendarData.startDate,
        calendarData.endDate,
      );
    }
    // Map weeks/days/exercises to ensure profileImageUrl is always a string
    return calendarData.weeks.map(week => ({
      ...week,
      days: week.days.map(day => ({
        ...day,
        exercises: day.exercises.map(ex => ({
          ...ex,
          profileImageUrl:
            ex.profileImageUrl !== undefined ? ex.profileImageUrl : "",
        })),
      })),
    }));
  }, [calendarData]);

  const initialSlideIndex = useMemo(() => {
    if (!processedWeeks) return 0;
    const todayStr = getTodayString();
    const todayWeekIndex = processedWeeks.findIndex(week =>
      week.days.some(day => day.date === todayStr),
    );
    return todayWeekIndex > -1 ? todayWeekIndex : 1;
  }, [processedWeeks]);

  const exerciseDays = useMemo<string[]>(() => {
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

  if (isLoading && !isFetchingMore)
    return <div>페이지를 불러오는 중입니다...</div>;
  if (error) return <div>오류가 발생했습니다: {error.message}</div>;

  return (
    <div className="flex flex-col gap-2 -mx-4 px-4 bg-white">
      <PageHeader title="운동 추천" onBackClick={() => navigate("/")} />
      <div className="flex flex-col gap-3">
        <div className="w-full h-17">
          {processedWeeks && (
            <CustomWeekly
              shadow={false}
              weeks={processedWeeks}
              selectedDate={selectedDate}
              onClick={handleDateClick}
              exerciseDays={exerciseDays}
              initialSlide={initialSlideIndex}
              onSlideChange={handleSlideChange}
            />
          )}
        </div>

        <div className="flex justify-between w-full h-7">
          <CheckBoxBtn checked={recommend} onClick={toggleRecommend}>
            <span>콕플 추천</span>
          </CheckBoxBtn>
          <div className="flex items-center">
            <FilterBtn
              onClick={() => navigate("/recommend/filter")}
              forceStatus={filterStatus}
              disabled={recommend}
            >
              <span>필터</span>
            </FilterBtn>
            <div className="h-4 w-px bg-gray-200 mx-1"></div>
            <Sort
              label={sortOption}
              isOpen={isSortOpen}
              onClick={() => setIsSortOpen(!isSortOpen)}
              disabled={recommend}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {isLoading && !isFetchingMore ? ( // 전체 로딩시에만 목록 로딩 표시
            <div>운동 목록을 불러오는 중...</div>
          ) : selectedDayExercises && selectedDayExercises.length > 0 ? (
            selectedDayExercises.map(item => (
              <div
                className="flex flex-col pb-3 border-b-[1px] border-gy-200"
                key={item.exerciseId}
              >
                <Exercise_M
                  id={item.exerciseId}
                  title={item.partyName}
                  date={item.date}
                  time={`${item.startTime} ~ ${item.endTime}`}
                  location={item.buildingName}
                  imageSrc={item.imageUrl ?? ""}
                  onClick={() => navigate(`/group/${item.partyId}`)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              해당 날짜에 추천 운동이 없습니다.
            </div>
          )}
        </div>
      </div>

      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selected={sortOption}
        onSelect={option => setSortOption(option)}
      />
    </div>
  );
};
