import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Sort from "../../components/common/Sort";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import { Group_M } from "../../components/common/contentcard/Group_M";
import { MyGroupNone } from "../../components/MyPage/MyGroupNone";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import DefaultGroupImg from "@/assets/icons/defaultGroupImg.svg?url";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useLikedGroupIds } from "../../hooks/useLikedItems";
import { useGroupPagination } from "../../hooks/useGroupPagination"; 

export const MyPageMyGroupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const memberId = searchParams.get("memberId");

  // 상태 관리
  const [isChecked, setIsChecked] = useState(false); // 내가 만든 모임 필터
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");

  // 좋아요 데이터 (React Query 캐시 활용)
  const { data: likedGroupIds = [], isLoading: isLikeLoading } = useLikedGroupIds();

  // 페이지네이션 Hook 사용
  const { groups, isLoading, hasMore, observerRef } = useGroupPagination(
    memberId,
    isChecked,
    sortOption
  );

  // 렌더링 헬퍼 변수
  const isEmpty = !isLoading && groups.length === 0;
  const showList = groups.length > 0;

  const onBackClick = () => {
    navigate(-1);
  };

  if (isLikeLoading) return <LoadingSpinner />;

 return (
    <div className="flex flex-col min-h-screen w-full max-w-[23.4375rem] bg-white mx-auto">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="내 모임" onBackClick={onBackClick} />
      </div>
      <div className="flex-1 flex flex-col mt-4 pb-6"> 
        
        {showList && (
          <div className="mb-8 flex justify-between items-start">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsChecked(!isChecked)}
                className="flex items-center justify-center"
              >
                {isChecked ? (
                  <CheckCircledFilled className="w-4 h-4" />
                ) : (
                  <CheckCircled className="w-4 h-4" />
                )}
              </button>
              <label 
                className="body-rg-500 cursor-pointer" 
                onClick={() => setIsChecked(!isChecked)}
              >
                내가 만든 모임
              </label>
            </div>
            <Sort
              label={sortOption}
              isOpen={isSortOpen}
              onClick={() => setIsSortOpen(!isSortOpen)}
            />
          </div>
        )}

        {/* 리스트 영역 */}
        {showList && (
          <div className="flex flex-col gap-4">
            {groups.map((group, index) => (
              <div key={`${group.partyId}-${index}`}>
                <Group_M
                  id={group.partyId}
                  groupName={group.partyName}
                  groupImage={group.partyImgUrl ?? DefaultGroupImg}
                  location={`${group.addr1} / ${group.addr2}`}
                  femaleLevel={group.femaleLevel}
                  maleLevel={group.maleLevel}
                  nextActivitDate={group.nextExerciseInfo}
                  upcomingCount={group.totalExerciseCount}
                  like={likedGroupIds.includes(group.partyId)}
                  isMine={group.isMine ?? false}
                  onClick={() =>
                    navigate(
                      `/group/${group.partyId}?return=${encodeURIComponent(
                        location.pathname + location.search
                      )}`
                    )
                  }
                />
                {index < groups.length - 1 && (
                  <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
                )}
              </div>
            ))}

            {/* 무한 스크롤 감지 트리거 */}
            <div ref={observerRef} className="h-4" />

            {/* 추가 로딩 스피너 */}
            {isLoading && hasMore && (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            )}
          </div>
        )}

        {/* 초기 로딩 중 */}
        {isLoading && !showList && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <LoadingSpinner />
          </div>
        )}

        {/* 데이터 없음 */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center mt-20">
            <MyGroupNone />
          </div>
        )}
      </div>

      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selected={sortOption}
        onSelect={(option) => setSortOption(option)}
        options={["최신순", "오래된 순", "운동 많은 순"]}
      />
    </div>
  );
};