import { useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
// import { Sort } from "../../components/MyPage/Sort";
import Sort from "../../components/common/Sort";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";

import { Group_M } from "../../components/common/contentcard/Group_M";
import { MyGroupNone } from "../../components/MyPage/MyGroupNone";

import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import { useLocation } from "react-router-dom";

export interface GroupMProps {
  id: number;
  groupName: string;
  groupImage: string;
  location: string;
  femaleLevel: string;
  maleLevel: string;
  nextActivitDate: string;
  upcomingCount: number;
  like?: boolean;
  isMine: boolean;
  onToggleFavorite?: (id: number) => void;
}

// interface MyPageMyGroupPageProps {
//   groups: GroupMProps[];
// }

// export const MyPageMyGroupPage = ({ groups }: MyPageMyGroupPageProps) => {
//   const [isChecked, setIsChecked] = useState(false);
//   const [sortOption, setSortOption] = useState("최신순");
//   const [favoriteGroups, setFavoriteGroups] = useState<GroupMProps[]>(groups || []);
// const location = useLocation();
// const groups: GroupMProps[] = location.state?.groups || [];
export const MyPageMyGroupPage = () => {
  const location = useLocation();
  const groups: GroupMProps[] = location.state?.groups || [];
  const [favoriteGroups, setFavoriteGroups] = useState<GroupMProps[]>(groups);
  const [isChecked, setIsChecked] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");

  const handleToggleFavorite = (id: number) => {
    setFavoriteGroups(prev =>
      prev.map(group =>
        group.id === id ? { ...group, like: !group.like } : group,
      ),
    );
  };
  // 정렬 기능 -> 나중에 서버랑 연동
  const sortGroups = (groups: GroupMProps[]) => {
    switch (sortOption) {
      case "최신순":
        return [...groups].sort((a, b) => b.id - a.id);
      case "오래된 순":
        return [...groups].sort((a, b) => a.id - b.id);
      case "운동 많은 순":
        return [...groups].sort((a, b) => b.upcomingCount - a.upcomingCount);
      default:
        return groups;
    }
  };
  const filteredGroups = isChecked
    ? sortGroups(favoriteGroups.filter(group => group.isMine))
    : sortGroups(favoriteGroups);

  const hasGroups = filteredGroups.length > 0;

  return (
    <div className="flex flex-col h-screen w-full max-w-[23.4375rem] bg-white mx-auto">
      <div className="sticky top-0 z-20">
        <PageHeader title="내 모임" />
      </div>

      <div className="flex-1 flex flex-col mt-4">
        {hasGroups && (
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <button onClick={() => setIsChecked(!isChecked)}>
                  {isChecked ? (
                    <CheckCircledFilled className="w-4 h-4" />
                  ) : (
                    <CheckCircled className="w-4 h-4" />
                  )}
                </button>
                <label className="body-rg-500">내가 만든 모임</label>
              </div>
              <div className="flex items-center gap-2">
                <Sort
                  label={sortOption}
                  isOpen={isSortOpen}
                  onClick={() => setIsSortOpen(!isSortOpen)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col gap-4">
          {hasGroups ? (
            filteredGroups.map(group => (
              <div key={group.id}>
                <Group_M {...group} onToggleFavorite={handleToggleFavorite} />
                <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
              </div>
            ))
          ) : (
            <MyGroupNone />
          )}
        </div>
      </div>

      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selected={sortOption}
        onSelect={option => setSortOption(option)}
        options={["최신순", "오래된 순", "운동 많은 순"]}
      />
    </div>
  );
};
