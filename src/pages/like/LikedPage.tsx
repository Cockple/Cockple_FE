import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import TabSelector from "../../components/common/TabSelector";
import Sort from "../../components/common/Sort";
import LikedList from "../../components/like/LikedList";

//import { groupDummy } from "../../components/like/groupDummy";
//import { exerciseDummy } from "../../components/like/exerciseDummy";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import { MainHeader } from "../../components/common/system/header/MainHeader";
//import type { ExerciseCard, GroupCard } from "../../types/liked";
//import api from "../../api/api";
import { useQuery } from "@tanstack/react-query";
import {
  fetchExerciseBookmarks,
  fetchGroupBookmarks,
} from "../../api/bookmark/bookmark";
import {
  useLikedExerciseIds,
  useLikedGroupIds,
} from "../../hooks/useLikedItems";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

// 정렬 옵션 타입
type GroupSortOption = "최신순" | "오래된 순" | "운동 많은 순";
type ExerciseSortOption = "최신순" | "오래된 순";

// 정렬 옵션 → API orderType 매핑
const sortOrderMap: {
  group: Record<GroupSortOption, string>;
  exercise: Record<ExerciseSortOption, string>;
} = {
  group: {
    최신순: "LATEST",
    "오래된 순": "OLDEST",
    "운동 많은 순": "EXERCISE_COUNT",
  },
  exercise: {
    최신순: "LATEST",
    "오래된 순": "EARLIEST",
  },
};

// 탭 별 정렬 옵션 표시용
const sortOptionsByTab = {
  group: ["최신순", "오래된 순", "운동 많은 순"],
  exercise: ["최신순", "오래된 순"],
};

export const LikedPage = () => {
  const location = useLocation();
  const initialTab = location.state?.tab === "exercise" ? "exercise" : "group";

  const [activeTab, setActiveTab] = useState<"group" | "exercise">(initialTab);
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = sortOptionsByTab[activeTab];

  // // 처음 전체 찜 목록 임시 저장
  // const [tempUnbookmarkedGroupIds, setTempUnbookmarkedGroupIds] = useState<
  //   number[]
  // >([]);
  // const [tempUnbookmarkedExerciseIds, setTempUnbookmarkedExerciseIds] =
  //   useState<number[]>([]);

  // 탭 바뀔 때 정렬 초기화
  useEffect(() => {
    setSelectedSort("최신순");
  }, [activeTab]);

  //TanStack Query - Group 찜 목록
  const {
    data: groupData,
    isLoading: isGroupLoading,
    isError: isGroupError,
  } = useQuery({
    queryKey: ["groupBookmarks", selectedSort],
    queryFn: () =>
      fetchGroupBookmarks(sortOrderMap.group[selectedSort as GroupSortOption]),
    enabled: activeTab === "group",
  });

  // TanStack Query - Exercise 찜 목록
  const {
    data: exerciseData,
    isLoading: isExerciseLoading,
    isError: isExerciseError,
  } = useQuery({
    queryKey: ["exerciseBookmarks", selectedSort],
    queryFn: () =>
      fetchExerciseBookmarks(
        sortOrderMap.exercise[selectedSort as ExerciseSortOption],
      ),
    enabled: activeTab === "exercise",
  });

  const handleSortClick = () => setIsSortOpen(prev => !prev);

  const handleSelectSort = (option: string) => {
    setSelectedSort(option);
    setIsSortOpen(false);
  };

  //🌟
  //const isLoading = activeTab === "group" ? isGroupLoading : isExerciseLoading;
  // 좋아요 ID (부모에서 가져오기)
  const { data: likedGroupIds = [], isLoading: isGroupLikedLoading } =
    useLikedGroupIds();
  const { data: likedExerciseIds = [], isLoading: isExerciseLikedLoading } =
    useLikedExerciseIds();

  // 탭별 로딩 합치기
  const listLoading =
    activeTab === "group" ? isGroupLoading : isExerciseLoading;
  const likedLoading =
    activeTab === "group" ? isGroupLikedLoading : isExerciseLikedLoading;

  const isLoading = listLoading || likedLoading;
  const isError = activeTab === "group" ? isGroupError : isExerciseError;

  return (
    <div className="flex flex-col w-full min-h-[76dvh] -mb-8 overflow-hidden pt-14">
      <MainHeader />
      {/* 탭 선택 */}
      <TabSelector
        selected={activeTab}
        onChange={value => setActiveTab(value as "group" | "exercise")}
        options={[
          { label: "모임", value: "group" },
          { label: "운동", value: "exercise" },
        ]}
      />

      <section className="flex flex-col gap-3">
        {/* 정렬 버튼 */}
        <div className="flex justify-end">
          <Sort
            label={selectedSort}
            isOpen={isSortOpen}
            onClick={handleSortClick}
          />
        </div>

        {/* 카드 목록 */}
        <div className="flex justify-center">
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <p className="text-center py-10 text-red-500">불러오기 실패</p>
          ) : (
            <LikedList
              activeTab={activeTab}
              groupCards={groupData?.data ?? []}
              exerciseCards={exerciseData?.data ?? []}
              //🌟 추가
              likedGroupIds={likedGroupIds}
              likedExerciseIds={likedExerciseIds}
            />
          )}
        </div>
      </section>

      {/* BottomSheet Sort */}
      {isSortOpen && (
        <div className="bg-black-60 z-40">
          <SortBottomSheet
            isOpen={isSortOpen}
            onClose={() => setIsSortOpen(false)}
            selected={selectedSort}
            onSelect={handleSelectSort}
            options={sortOptions}
          />
        </div>
      )}
    </div>
  );
};
