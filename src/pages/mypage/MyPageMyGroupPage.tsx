import { useEffect, useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Sort from "../../components/common/Sort";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import { Group_M } from "../../components/common/contentcard/Group_M";
import { MyGroupNone } from "../../components/MyPage/MyGroupNone";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import { getMyGroups } from "../../api/party/my";
import type { PartyData } from "../../api/party/my";

export const MyPageMyGroupPage = () => {
  const [groups, setGroups] = useState<PartyData[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");

  // 내 모임 조회
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const result = await getMyGroups({
          created: isChecked,
          sort: sortOption,
        });
        setGroups(result);
      } catch (err) {
        console.error("모임 데이터를 불러오는 데 실패했습니다.", err);
      }
    };

    fetchGroups();
  }, [isChecked, sortOption]);

  const handleToggleFavorite = (id: number) => {
    setGroups(prev =>
      prev.map(group =>
        group.partyId === id ? { ...group, like: !group.like } : group,
      ),
    );
  };

  const hasGroups = groups.length > 0;

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
            groups.map(group => (
              <div key={group.partyId}>
                <Group_M
                  {...group}
                  id={group.partyId}
                  groupName={group.groupName}
                  groupImage={group.groupImage}
                  location={group.location}
                  femaleLevel={group.femaleLevel}
                  maleLevel={group.maleLevel}
                  nextActivitDate={group.nextActivitDate}
                  upcomingCount={group.upcomingCount}
                  like={group.like}
                  isMine={group.isMine}
                  onToggleFavorite={handleToggleFavorite}
                />
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
