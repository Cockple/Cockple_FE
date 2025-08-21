// import { useState, useEffect, useRef, useCallback } from "react";
// import { PageHeader } from "../../components/common/system/header/PageHeader";
// import { SortBottomSheet } from "../../components/common/SortBottomSheet";
// import Sort from "../../components/common/Sort";
// import { ContentCardL } from "../../components/common/contentcard/ContentCardL";
// import { MyExercise_None } from "../../components/MyPage/MyExercise_None";
// import TabSelector from "../../components/common/TabSelector";
// import { getMyExercises } from "../../api/exercise/my";
// import type { FilterType, OrderType, ExerciseItem } from "../../api/exercise/my";
// import { useLikedExerciseIds } from "../../hooks/useLikedItems";
// import { LoadingSpinner } from "../../components/common/LoadingSpinner";
// import { useNavigate } from "react-router-dom";
// import { useMyExerciseStore } from "../../store/myExerciseStore";

// export const MyPageMyExercisePage = () => {
//   const navigate = useNavigate();
//   const [isSortOpen, setIsSortOpen] = useState(false);
//   const [sortOption, setSortOption] = useState<"최신순" | "오래된 순">("최신순");
//   const [selectedTab, setSelectedTab] = useState<"전체" | "참여 예정" | "참여 완료">("전체");
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const pageSize = 10;

//   const { exerciseList, setExerciseList } = useMyExerciseStore();
//   const observerRef = useRef<HTMLDivElement | null>(null);
//   const { data: likedExerciseIds = [], isLoading: isExerciseLikedLoading } = useLikedExerciseIds();

//   // 탭 → filterType 매핑
//   const mapTabToFilterType = (tab: string): FilterType => {
//     switch (tab) {
//       case "참여 예정":
//         return "UPCOMING";
//       case "참여 완료":
//         return "COMPLETED";
//       case "전체":
//       default:
//         return "ALL";
//     }
//   };

//   // 정렬 → orderType 매핑
//   const mapSortToOrderType = (sort: string): OrderType => {
//     return sort === "오래된 순" ? "OLDEST" : "LATEST";
//   };

//   // 운동 데이터 fetch
//   const fetchExercises = useCallback(
//     async (reset = false) => {
//       if (isLoading) return;
//       setIsLoading(true);
//       try {
//         const data = await getMyExercises({
//           filterType: mapTabToFilterType(selectedTab),
//           orderType: mapSortToOrderType(sortOption),
//           page: reset ? 0 : page,
//           size: pageSize,
//         });

//         setExerciseList(prev => {
//           const merged: ExerciseItem[] = reset ? data : [...prev, ...data];
//           const uniqueMap = new Map<number, ExerciseItem>();
//           merged.forEach(item => uniqueMap.set(item.exerciseId, item));
//           return Array.from(uniqueMap.values());
//         });

//         // 마지막 페이지 판단
//         setHasMore(data.length === pageSize);
//       } catch (err) {
//         console.error("운동 데이터 불러오기 실패", err);
//         if (reset) setExerciseList([]);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [page, selectedTab, sortOption, isLoading, setExerciseList]
//   );

//   // 초기 로딩
//   useEffect(() => {
//     fetchExercises(true);
//   }, []);

//   // 탭/정렬 변경 시 초기화
//   useEffect(() => {
//     setPage(0);
//     fetchExercises(true);
//   }, [selectedTab, sortOption]);

//   // page 변경 시 데이터 fetch
//   useEffect(() => {
//     if (page > 0) fetchExercises();
//   }, [page]);

//   useEffect(() => {
//     const node = observerRef.current;
//     if (!node || !hasMore || isLoading) return;

//     const observer = new IntersectionObserver(
//       entries => {
//         if (entries[0].isIntersecting) {
//           setPage(prev => prev + 1);
//         }
//       },
//       { threshold: 1.0 }
//     );

//     observer.observe(node);

//     return () => {
//       observer.unobserve(node);
//     };
//   }, [hasMore, isLoading]);

//   if (isExerciseLikedLoading) {
//     return <LoadingSpinner />;
//   }

//   const tabOptions = [
//     { label: "전체", value: "전체" },
//     { label: "참여 예정", value: "참여 예정" },
//     { label: "참여 완료", value: "참여 완료" },
//   ];

//   return (
//     <div className="flex flex-col h-screen w-full max-w-[23.4375rem] bg-white mx-auto pt-14">
//       <div className="sticky top-0 z-20 bg-white">
//         <PageHeader title="내 운동" onBackClick={() => navigate("/myPage")} />
//         <TabSelector
//           options={tabOptions}
//           selected={selectedTab}
//           onChange={value =>
//             setSelectedTab(value as "전체" | "참여 예정" | "참여 완료")
//           }
//         />
//       </div>

//       <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
//         {exerciseList.length > 0 ? (
//           <>
//             <div className="flex justify-end mb-3 px-4">
//               <Sort
//                 label={sortOption}
//                 isOpen={isSortOpen}
//                 onClick={() => setIsSortOpen(!isSortOpen)}
//               />
//             </div>

//             <div className="flex flex-col items-center justify-center">
//               {exerciseList.map(item => {
//                 const isLiked = likedExerciseIds.includes(item.exerciseId);
//                 return (
//                   <ContentCardL
//                     key={item.exerciseId}
//                     id={item.exerciseId}
//                     isUserJoined={item.access?.ispartyMember ?? false}
//                     isGuestAllowedByOwner={item.access?.allowGuestInvitation ?? false}
//                     isCompleted={item.isCompleted}
//                     title={item.partyName}
//                     date={item.date}
//                     location={item.buildingName}
//                     time={`${item.startTime} ~ ${item.endTime}`}
//                     femaleLevel={item.levelRequirement?.female ?? 0}
//                     maleLevel={item.levelRequirement?.male ?? 0}
//                     currentCount={item.participation.current}
//                     totalCount={item.participation.max}
//                     like={isLiked}
//                   />
//                 );
//               })}

//               <div ref={observerRef} className="h-10" />
//               {isLoading && hasMore && (
//                 <div className="py-4">
//                   <LoadingSpinner />
//                 </div>
//               )}
//             </div>
//           </>
//         ) : isLoading ? (
//           <div className="flex flex-col items-center justify-center h-[60vh]">
//             <LoadingSpinner />
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center">
//             <MyExercise_None />
//           </div>
//         )}
//       </div>

//       <SortBottomSheet
//         isOpen={isSortOpen}
//         onClose={() => setIsSortOpen(false)}
//         selected={sortOption}
//         onSelect={option => setSortOption(option as "최신순" | "오래된 순")}
//         options={["최신순", "오래된 순"]}
//       />
//     </div>
//   );
// };

//배포 전.. 새로고침을 해야 잘 보임..?
import { useState, useEffect, useRef, useCallback } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import Sort from "../../components/common/Sort";
import { ContentCardL } from "../../components/common/contentcard/ContentCardL";
import { MyExercise_None } from "../../components/MyPage/MyExercise_None";
import TabSelector from "../../components/common/TabSelector";
import { getMyExercises } from "../../api/exercise/my";
import type { FilterType, OrderType, ExerciseItem } from "../../api/exercise/my";
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
  const pageSize = 10;

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
      default:
        return "ALL";
    }
  };

  // 정렬 → orderType 매핑
  const mapSortToOrderType = (sort: string): OrderType => {
    return sort === "오래된 순" ? "OLDEST" : "LATEST";
  };

  // 데이터 fetch
  const fetchExercises = useCallback(
    async (nextPage: number, reset = false) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const data = await getMyExercises({
          filterType: mapTabToFilterType(selectedTab),
          orderType: mapSortToOrderType(sortOption),
          page: nextPage,
          size: pageSize,
        });

        setExerciseList(prev => {
          if (reset) {
            return data;
          } else {
            const merged = [...prev, ...data];
            const uniqueMap = new Map<number, ExerciseItem>();
            merged.forEach(item => uniqueMap.set(item.exerciseId, item));
            return Array.from(uniqueMap.values());
          }
        });

        setHasMore(data.length === pageSize);
        setPage(nextPage);
      } catch (err) {
        console.error("운동 데이터 불러오기 실패", err);
        if (reset) setExerciseList([]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTab, sortOption, isLoading, setExerciseList]
  );

  // 초기 로딩
  useEffect(() => {
    fetchExercises(0, true);
  }, []);

  // 탭/정렬 변경 시 초기화
  useEffect(() => {
    setPage(0);
    fetchExercises(0, true);
  }, [selectedTab, sortOption]);

  // IntersectionObserver -> 시간차로 오류 방지
  useEffect(() => {
    const node = observerRef.current;
    if (!node || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchExercises(page + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, [hasMore, isLoading, fetchExercises, page]);

  if (isExerciseLikedLoading) return <LoadingSpinner />;

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
                    isUserJoined={item.access?.ispartyMember ?? false}
                    isGuestAllowedByOwner={item.access?.allowGuestInvitation ?? false}
                    isCompleted={item.isCompleted}
                    title={item.partyName}
                    date={item.date}
                    location={item.buildingName}
                    time={`${item.startTime} ~ ${item.endTime}`}
                    femaleLevel={item.levelRequirement?.female ?? 0}
                    maleLevel={item.levelRequirement?.male ?? 0}
                    currentCount={item.participation.current}
                    totalCount={item.participation.max}
                    like={isLiked}
                  />
                );
              })}

              {/* 마지막 스크롤 감지 div */}
              <div ref={observerRef} className="h-10" />

              {/* 하단 로딩 스피너: 마지막 페이지에서는 안보이도록 */}
              {isLoading && hasMore && (
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
