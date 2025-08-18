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
import { useLikedGroupIds } from "../../hooks/useLikedItems";
import { useLocation, useNavigate } from "react-router-dom";
import appIcon from "@/assets/images/app_icon.png?url";

export const MyPageMyGroupPage = () => {
  const [groups, setGroups] = useState<PartyData[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");
  const location = useLocation();
  const navigate = useNavigate();

  const returnParam = new URLSearchParams(location.search).get("return");

  const { data: likedGroupIds = [], isLoading: isGroupLikedLoading } =
    useLikedGroupIds();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const result = await getMyGroups({
          created: isChecked,
          sort: sortOption,
        });
        const resultWithLike = result.map(group => ({
          ...group,
          like: likedGroupIds.includes(group.partyId),
        }));

        setGroups(resultWithLike);
      } catch (err) {
        console.error("모임 데이터를 불러오는 데 실패했습니다.", err);
      }
    };

    if (!isGroupLikedLoading) {
      fetchGroups();
    }
  }, [isChecked, sortOption, likedGroupIds, isGroupLikedLoading]);

  const hasGroups = groups.length > 0;

  const onBackClick = () => {
    if (returnParam) {
      navigate(returnParam);
    } else {
      navigate("/mypage");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-[23.4375rem] bg-white mx-auto">
      <div className="sticky top-0 z-20">
        <PageHeader title="내 모임" onBackClick={onBackClick} />
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
            groups.map(group => {
              const isLiked = likedGroupIds.includes(group.partyId); // 찜 상태 계산

              return (
                <div key={group.partyId}>
                  <Group_M
                    id={group.partyId}
                    groupName={group.partyName}
                    groupImage={group.partyImgUrl ?? appIcon}
                    location={`${group.addr1} / ${group.addr2}`}
                    femaleLevel={group.femaleLevel}
                    maleLevel={group.maleLevel}
                    nextActivitDate={group.nextExerciseInfo}
                    upcomingCount={group.totalExerciseCount}
                    like={isLiked}
                    isMine={group.isMine ?? false}
                    onClick={() =>
                      navigate(
                        `/group/${group.partyId}?return=${encodeURIComponent(location.pathname + location.search)}`,
                      )
                    }
                    // onToggleFavorite={handleToggleFavorite}
                  />
                  <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
                </div>
              );
            })
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
