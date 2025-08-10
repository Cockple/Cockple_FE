import { useState,useEffect } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import Sort from "../../components/common/Sort";
import { ContentCardL } from "../../components/common/contentcard/ContentCardL";
import { MyExercise_None } from "../../components/MyPage/MyExercise_None";
import TabSelector from "../../components/common/TabSelector";
import { getMyExercises } from "../../api/exercise/my";
import type { FilterType, OrderType, ExerciseItem } from "../../api/exercise/my";


export const MyPageMyExercisePage = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"최신순" | "오래된 순">("최신순");
  const [selectedTab, setSelectedTab] = useState<"전체" | "참여 예정" | "참여 완료">("전체");
  type MyExerciseItem = ExerciseItem;

  const [exerciseList, setExerciseList] = useState<MyExerciseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 탭 -> filterType 매핑
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

  const mapSortToOrderType = (sort: string): OrderType => {
    return sort === "오래된 순" ? "OLDEST" : "LATEST";
  };

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
   try {
        const data = await getMyExercises({
          filterType: mapTabToFilterType(selectedTab),
          orderType: mapSortToOrderType(sortOption),
        });
        setExerciseList(data); 
      } catch (err) {
        console.error("운동 데이터 불러오기 실패", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [selectedTab, sortOption]);

  const tabOptions = [
    { label: "전체", value: "전체" },
    { label: "참여 예정", value: "참여 예정" },
    { label: "참여 완료", value: "참여 완료" },
  ];

  return (
    <div className="flex flex-col h-screen w-full max-w-[23.4375rem] bg-white mx-auto pt-14">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="내 운동" />
        <TabSelector
          options={tabOptions}
          selected={selectedTab}
          onChange={(value) =>
            setSelectedTab(value as "전체" | "참여 예정" | "참여 완료")
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
        {isLoading ? (
          <div className="text-center mt-10">로딩 중...</div>
        ) : exerciseList.length > 0 ? (
          <>
            <div className="flex justify-end mb-3 px-4">
              <Sort
                label={sortOption}
                isOpen={isSortOpen}
                onClick={() => setIsSortOpen(!isSortOpen)}
              />
            </div>
            <div className="flex flex-col items-center justify-center">
           {exerciseList.map((item) => (
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
              femaleLevel={item.levelRequirement.female}
              maleLevel={item.levelRequirement.male}
              currentCount={item.participation.current}
              totalCount={item.participation.max}
              like={item.isBookmarked}
            />
          ))}
            </div>
          </>
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
        onSelect={(option) =>
          setSortOption(option as "최신순" | "오래된 순")
        }
        options={["최신순", "오래된 순"]}
      />
    </div>
  );
};
