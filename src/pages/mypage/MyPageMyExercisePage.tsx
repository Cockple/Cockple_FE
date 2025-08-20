import { useState, useEffect, useRef, useCallback } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import Sort from "../../components/common/Sort";
import { ContentCardL } from "../../components/common/contentcard/ContentCardL";
import { MyExercise_None } from "../../components/MyPage/MyExercise_None";
import TabSelector from "../../components/common/TabSelector";
import { getMyExercises } from "../../api/exercise/my";
import type { FilterType, OrderType, ExerciseItem } from "../../api/exercise/my";
// import type { FilterType, OrderType, ExerciseItem } from "../../api/exercise/my";

import { useLikedExerciseIds } from "../../hooks/useLikedItems";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useMyExerciseStore } from "../../store/myExerciseStore";

export const MyPageMyExercisePage = () => {
  const navigate = useNavigate();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"최신순" | "오래된 순">("최신순");
  const [selectedTab, setSelectedTab] = useState<"전체" | "참여 예정" | "참여 완료">("전체");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { exerciseList, setExerciseList } = useMyExerciseStore();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { data: likedExerciseIds = [], isLoading: isExerciseLikedLoading } = useLikedExerciseIds();

  // 탭 → filterType 매핑
  const mapTabToFilterType = (tab: string): FilterType => {
    switch (tab) {
      case "참여 예정":
        return "UPCOMING";
      case "참여 완료":
        return "COMPLETED";
      case "전체":
      default:
        return "ALL";
    }
  };

  // 정렬 → orderType 매핑
  const mapSortToOrderType = (sort: string): OrderType => {
    return sort === "오래된 순" ? "OLDEST" : "LATEST";
  };

  // 운동 데이터 불러오기
const fetchExercises = useCallback(
  async (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await getMyExercises({
        filterType: mapTabToFilterType(selectedTab),
        orderType: mapSortToOrderType(sortOption),
        page: reset ? 0 : page,
        size: 10,
      });

     setExerciseList(prev => {
        const merged: ExerciseItem[] = reset ? data : [...prev, ...data];
        const uniqueMap = new Map<number, ExerciseItem>();

        merged.forEach((item) => {
          uniqueMap.set(item.exerciseId, item);
        });

        return Array.from(uniqueMap.values());
      });
      
      setHasMore(data.length === 10);
    } catch (err) {
      console.error("운동 데이터 불러오기 실패", err);
      if (reset) setExerciseList([]);
    } finally {
      setIsLoading(false);
    }
  },
  [page, selectedTab, sortOption, isLoading, setExerciseList]
);


  // 페이지 로드 시 서버 데이터 가져오기
  useEffect(() => {
    fetchExercises(true);
  }, []);

  // 탭/정렬 변경 시 reset
  useEffect(() => {
    setPage(0);
    fetchExercises(true);
  }, [selectedTab, sortOption]);

  useEffect(() => {
    if (!observerRef.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [observerRef.current, hasMore, isLoading]);

  useEffect(() => {
    if (page > 0) fetchExercises();
  }, [page]);


  if (isExerciseLikedLoading) {
    return <LoadingSpinner />;
  }

  const tabOptions = [
    { label: "전체", value: "전체" },
    { label: "참여 예정", value: "참여 예정" },
    { label: "참여 완료", value: "참여 완료" },
  ];

  return (
    <div className="flex flex-col h-screen w-full max-w-[23.4375rem] bg-white mx-auto pt-14">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="내 운동" onBackClick={() => navigate("/myPage")} />
        <TabSelector
          options={tabOptions}
          selected={selectedTab}
          onChange={value =>
            setSelectedTab(value as "전체" | "참여 예정" | "참여 완료")
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
        {exerciseList.length > 0 ? (
          <>
            <div className="flex justify-end mb-3 px-4">
              <Sort
                label={sortOption}
                isOpen={isSortOpen}
                onClick={() => setIsSortOpen(!isSortOpen)}
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              {exerciseList.map(item => {
                const isLiked = likedExerciseIds.includes(item.exerciseId);
                return (
                  <ContentCardL
                    key={item.exerciseId}
                    id={item.exerciseId}
                    isUserJoined={item.access.ispartyMember}
                    isGuestAllowedByOwner={item.access.allowGuestInvitation}
                    isCompleted={item.isCompleted}
                    title={item.partyName}
                    date={item.date}
                    location={item.buildingName}
                    time={`${item.startTime} ~ ${item.endTime}`}
                    femaleLevel={[item.levelRequirement.female]}
                    maleLevel={[item.levelRequirement.male]}
                    currentCount={item.participation.current}
                    totalCount={item.participation.max}
                    like={isLiked}
                  />
                );
              })}
              <div ref={observerRef} className="h-10" />
              {isLoading && (
                <div className="py-4">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <MyExercise_None />
          </div>
        )}
      </div>

      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selected={sortOption}
        onSelect={option => setSortOption(option as "최신순" | "오래된 순")}
        options={["최신순", "오래된 순"]}
      />
    </div>
  );
};
