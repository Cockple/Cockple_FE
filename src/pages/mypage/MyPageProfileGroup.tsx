import { useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import Sort from "../../components/common/Sort";
import { Group_M } from "../../components/common/contentcard/Group_M";
import { ProfileMyGroupNone } from "../../components/MyPage/ProfileMyGroupNone";
import { useLikedGroupIds } from "../../hooks/useLikedItems";
import { useNavigate } from "react-router-dom";

interface GroupMProps {
  id: number;
  groupName: string;
  groupImage: string;
  location: string;
  femaleLevel: string[]; 
  maleLevel: string[];   
  nextActivitDate: string;
  upcomingCount: number;
  like?: boolean;
  isMine: boolean;
  onToggleFavorite?: (id: number) => void;
}

interface MyPageProfileGroupProps {
  groups?: GroupMProps[];
}

export const MyPageProfileGroup = ({ groups }: MyPageProfileGroupProps) => {
  // 찜 상태 불러오기
  const { data: likedGroupIds = [], isLoading: isGroupLikedLoading } = useLikedGroupIds();
  
  const navigate = useNavigate();
  const onBackClick = () => navigate(-1);
  
  const [favoriteGroups, setFavoriteGroups] = useState<GroupMProps[]>(
    (groups || []).map(g => ({
      ...g,
      like: likedGroupIds.includes(g.id), // 초기 찜 상태 설정
    }))
  );

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");

  const handleToggleFavorite = (id: number) => {
    setFavoriteGroups(prev =>
      prev.map(group =>
        group.id === id ? { ...group, like: !group.like } : group
      )
    );
  };

  const hasGroups = favoriteGroups.length > 0;

  // 찜 상태 로딩 중일 때
  if (isGroupLikedLoading) {
    return <div className="text-center py-10">하트 불러오는 중...</div>;
  }

  return (
    <>
      <PageHeader title="모임" onBackClick={onBackClick}/>

      <div className="flex flex-col h-full w-full max-w-[23.4375rem] p-4">
        {hasGroups && (
          <div className="mb-8 flex justify-end">
            <Sort
              label={sortOption}
              isOpen={isSortOpen}
              onClick={() => setIsSortOpen(!isSortOpen)}
            />
          </div>
        )}

        <div className="flex flex-col gap-4">
          {hasGroups ? (
            favoriteGroups.map(group => (
              <div key={group.id}>
                <Group_M
                  {...group}
                  femaleLevel={group.femaleLevel} 
                  maleLevel={group.maleLevel}   
                  onToggleFavorite={handleToggleFavorite}
                />
                <div className="border border-[#E4E7EA] mx-1 mt-2" />
              </div>
            ))
          ) : (
            <ProfileMyGroupNone />
          )}
        </div>

        <SortBottomSheet
          isOpen={isSortOpen}
          onClose={() => setIsSortOpen(false)}
          selected={sortOption}
          onSelect={option => setSortOption(option)}
          options={["최신순", "오래된 순", "운동 많은 순"]}
        />
      </div>
    </>
  );
};
