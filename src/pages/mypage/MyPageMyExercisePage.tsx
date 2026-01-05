import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import Sort from "../../components/common/Sort";
import { ContentCardL } from "../../components/common/contentcard/ContentCardL";
import { MyExercise_None } from "../../components/MyPage/MyExercise_None";
import TabSelector from "../../components/common/TabSelector";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useLikedExerciseIds } from "../../hooks/useLikedItems";
import { useExercisePagination } from "../../hooks/useExercisePagination"; 
import { TAB_OPTIONS } from "../../utils/MyPageMyExerciseUtils"; 

export const MyPageMyExercisePage = () => {
  const navigate = useNavigate();
  
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"최신순" | "오래된 순">("최신순");
  const [selectedTab, setSelectedTab] = useState<"전체" | "참여 예정" | "참여 완료">("전체");

  //데이터 hook
  const { exerciseList, isLoading, hasMore, observerRef } = useExercisePagination(selectedTab, sortOption);
  
  // 좋아요 데이터
  const { data: likedExerciseIds = [], isLoading: isLikeLoading } = useLikedExerciseIds();

  // 렌더링 헬퍼 변수
  const isEmpty = !isLoading && exerciseList.length === 0;
  const showList = exerciseList.length > 0;

  if (isLikeLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col h-screen w-full max-w-[23.4375rem] bg-white mx-auto pt-14">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="내 운동" onBackClick={() => navigate("/myPage")} />
        <TabSelector
          options={TAB_OPTIONS}
          selected={selectedTab}
          onChange={(val) => setSelectedTab(val as any)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
        
        {showList && (
          <>
            <div className="flex justify-end mb-3 px-4">
              <Sort
                label={sortOption}
                isOpen={isSortOpen}
                onClick={() => setIsSortOpen(!isSortOpen)}
              />
            </div>
            <div className="px-1">
              <div className="flex flex-col items-center justify-center">
                {exerciseList.map((item) => (
                  <ContentCardL
                    key={item.exerciseId}
                    id={item.exerciseId}
                    isParticipating={item.isParticipating ?? true}
                    isUserJoined={item.access?.ispartyMember ?? false}
                    isGuestAllowedByOwner={item.access?.allowGuestInvitation ?? false}
                    isCompleted={item.isCompleted}
                    title={item.partyName}
                    date={item.date}
                    location={item.buildingName}
                    time={`${item.startTime} ~ ${item.endTime}`}
                    femaleLevel={item.levelRequirement?.female ?? 0}
                    maleLevel={item.levelRequirement?.male ?? 0}
                    currentCount={item.participation?.current ?? 0}
                    totalCount={item.participation?.max ?? 0}
                    like={likedExerciseIds.includes(item.exerciseId)}
                  />
                ))}
                
                {/* 무한 스크롤 감지용 */}
                <div ref={observerRef} className="h-10" />
                
                {/* 추가 로딩 스피너 */}
                {isLoading && hasMore && (
                  <div className="py-4"><LoadingSpinner /></div>
                )}
              </div>
            </div>
          </>
        )}

        {/* 로딩 중이고 데이터가 없는 경우 (초기 로딩) */}
        {isLoading && !showList && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <LoadingSpinner />
          </div>
        )}

        {/* 데이터가 없는 경우 */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center mt-16">
            <MyExercise_None />
          </div>
        )}
      </div>

      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selected={sortOption}
        onSelect={(opt) => setSortOption(opt as any)}
        options={["최신순", "오래된 순"]}
      />
    </div>
  );
};