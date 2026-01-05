// 마이페이지 > 내 운동 
import { useState, useEffect, useCallback, useRef } from "react";
import { getMyExercises, type ExerciseItem } from "../api/exercise/my";
import { useMyExerciseStore } from "../store/myExerciseStore";
import { mapTabToFilterType, mapSortToOrderType } from "../utils/MyPageMyExerciseUtils"; 

type TabType = "전체" | "참여 예정" | "참여 완료";
type SortType = "최신순" | "오래된 순";

export const useExercisePagination = (selectedTab: TabType, sortOption: SortType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  
  const { exerciseList, setExerciseList } = useMyExerciseStore();
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 데이터 페칭
  const fetchExercises = useCallback(async (nextPage: number, reset = false) => {
    if (isLoading) return; 
    
    setIsLoading(true);
    try {
      const data = await getMyExercises({
        filterType: mapTabToFilterType(selectedTab),
        orderType: mapSortToOrderType(sortOption),
        page: nextPage,
        size: pageSize,
      });

      setExerciseList((prev) => {
        if (reset) return data;
        
        const merged = [...prev, ...data];
        const uniqueMap = new Map<number, ExerciseItem>();
        merged.forEach((item) => uniqueMap.set(item.exerciseId, item));
        return Array.from(uniqueMap.values());
      });

      setHasMore(data.length === pageSize);
      setPage(nextPage);
    } catch (err) {
      console.error("운동 데이터 로드 실패", err);
      if (reset) setExerciseList([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTab, sortOption, setExerciseList]);

  // 탭/정렬 변경 시 초기화
  useEffect(() => {
    fetchExercises(0, true);
  }, [fetchExercises]);

  // 무한 스크롤
  useEffect(() => {
    const node = observerRef.current;
    if (!node || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchExercises(page + 1);
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(node);
    return () => observer.unobserve(node);
  }, [hasMore, isLoading, page, fetchExercises]);

  return { exerciseList, isLoading, hasMore, observerRef };
};