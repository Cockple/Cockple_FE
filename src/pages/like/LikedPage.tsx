import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import TabSelector from "../../components/common/TabSelector";
import Sort from "../../components/common/Sort";
import LikedList from "../../components/like/LikedList";

//import { groupDummy } from "../../components/like/groupDummy";
//import { exerciseDummy } from "../../components/like/exerciseDummy";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import { MainHeader } from "../../components/common/system/header/MainHeader";
import type { ExerciseCard, GroupCard } from "../../types/liked";
import api from "../../api/api";

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

  // const [groupCards, setGroupCards] = useState(groupDummy);
  const [groupCards, setGroupCards] = useState<GroupCard[]>([]);
  // const [exerciseCards, setExerciseCards] = useState(exerciseDummy);
  const [exerciseCards, setExerciseCards] = useState<ExerciseCard[]>([]);

  useEffect(() => {
    setSelectedSort("최신순");
  }, [activeTab]);

  const fetchBookmarks = (tab: "group" | "exercise", sort: string) => {
    const token = localStorage.getItem("accessToken");
    const orderType =
      sortOrderMap[tab][sort as GroupSortOption & ExerciseSortOption];

    api
      .get(
        `/api/${activeTab === "group" ? "parties" : "exercises"}/bookmarks`,
        {
          params: { orderType },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => {
        console.log("찜 목록 : ", res.data);
        const newData = res.data.data;

        if (activeTab === "group") {
          setGroupCards(newData);
        } else {
          setExerciseCards(newData);
        }
      })
      .catch(err => {
        console.error("찜 목록 불러오기 실패", err);
      });
  };
  useEffect(() => {
    // const token = localStorage.getItem("accessToken"); // 예시

    // const orderType = sortOrderMap[activeTab]["최신순"];

    // api
    //   .get(
    //     `/api/${activeTab === "group" ? "parties" : "exercises"}/bookmarks`,
    //     {
    //       params: { orderType },
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     },
    //   )
    //   .then(res => {
    //     const newData = res.data.data;
    //     if (activeTab === "group") {
    //       setGroupCards(newData);
    //     } else {
    //       setExerciseCards(newData);
    //     }
    //   })
    //   .catch(err => {
    //     console.error("찜 목록 불러오기 실패", err);
    //   });
    fetchBookmarks(activeTab, selectedSort);
  }, [activeTab, selectedSort]);

  const handleSortClick = () => setIsSortOpen(prev => !prev);
  const handleSelectSort = (option: string) => {
    setSelectedSort(option);
    setIsSortOpen(false);

    // const orderType =
    //   sortOrderMap[activeTab][option as GroupSortOption & ExerciseSortOption];
    // console.log("API 요청시 orderType:", orderType);
  };

  const handleToggleFavorite = (id: number) => {
    console.log("하트 토글", id);
    if (activeTab === "group") {
      setGroupCards(prev =>
        prev.map(card =>
          card.partyId === id
            ? { ...card, isFavorite: !card.isFavorite }
            : card,
        ),
      );
    } else {
      setExerciseCards(prev =>
        prev.map(card =>
          card.exerciseId === id
            ? { ...card, isFavorite: !card.isFavorite }
            : card,
        ),
      );
    }
    // 배포 오류 해결을 위한 임시 코드
    console.log(exerciseCards);
  };

  return (
    <div className="flex flex-col w-full min-h-[100dvh] -mb-8 overflow-y-scroll [&::-webkit-scrollbar]:hidden pt-14">
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
          <LikedList
            activeTab={activeTab}
            groupCards={groupCards}
            exerciseCards={exerciseCards}
            onToggleFavorite={handleToggleFavorite}
          />
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
