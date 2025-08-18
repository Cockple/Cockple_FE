import { Group_M } from "../common/contentcard/Group_M";
import { ContentCardL } from "../common/contentcard/ContentCardL";
import type { ExerciseCard, GroupCard } from "../../types/liked";
// import {
//   useLikedExerciseIds,
//   useLikedGroupIds,
// } from "../../hooks/useLikedItems";
import { useEffect, useState } from "react";
import { LikedEmptyState } from "./LikedEmptyState";
import appIcon from "@/assets/images/app_icon.png?url";
//import { LoadingSpinner } from "../common/LoadingSpinner";

interface LikedListProps {
  activeTab: "group" | "exercise";
  groupCards: GroupCard[];
  exerciseCards: ExerciseCard[];
  //🌟추가
  likedGroupIds: number[];
  likedExerciseIds: number[];
}

const LikedList = ({
  activeTab,
  groupCards,
  exerciseCards,
  likedGroupIds,
  likedExerciseIds,
}: LikedListProps) => {
  const isGroupTab = activeTab === "group";

  // 처음 전체 찜 목록 임시 저장
  const [tempUnbookmarkedGroupIds, setTempUnbookmarkedGroupIds] = useState<
    number[]
  >([]);
  const [tempUnbookmarkedExerciseIds, setTempUnbookmarkedExerciseIds] =
    useState<number[]>([]);

  //🌟
  // const { data: likedGroupIds = [], isLoading: isGroupLikedLoading } =
  //   useLikedGroupIds();
  // const { data: likedExerciseIds = [], isLoading: isExerciseLikedLoading } =
  //   useLikedExerciseIds();

  useEffect(() => {
    console.log(likedGroupIds);
    console.log(likedExerciseIds);
  }, [likedGroupIds, likedExerciseIds]);

  // const isLikedLoading = isGroupTab
  //   ? isGroupLikedLoading
  //   : isExerciseLikedLoading;

  // if (isLikedLoading) {
  //   return <LoadingSpinner />;
  // }

  const isEmpty = isGroupTab
    ? groupCards.length === 0
    : exerciseCards.length === 0;

  // 공통 Empty Message Wrapper
  if (isEmpty) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] w-full">
        <LikedEmptyState kind={isGroupTab ? "group" : "exercise"} />
      </div>
    );
  }

  const handleToggleFavorite = (id: number) => {
    if (activeTab === "group") {
      //groupUnbookmarkMutation.mutate(id);
      setTempUnbookmarkedGroupIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
      );
    } else {
      //exerciseUnbookmarkMutation.mutate(id);
      setTempUnbookmarkedExerciseIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
      );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {isGroupTab
          ? groupCards.map(card => {
              const isLiked =
                likedGroupIds.includes(card.partyId) &&
                !tempUnbookmarkedGroupIds.includes(card.partyId);

              return (
                <div key={card.partyId} className="border-b border-gy-200 pb-1">
                  <Group_M
                    id={card.partyId}
                    groupName={card.partyName}
                    groupImage={card.profileImgUrl ?? appIcon}
                    location={`${card.addr1}/${card.addr2}`}
                    femaleLevel={card.femaleLevel}
                    maleLevel={card.maleLevel}
                    nextActivitDate={card.latestExerciseDate}
                    upcomingCount={card.exerciseCnt}
                    like={isLiked}
                    isMine={false}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              );
            })
          : exerciseCards.map(card => {
              const isLiked =
                likedExerciseIds.includes(card.exerciseId) &&
                !tempUnbookmarkedExerciseIds.includes(card.exerciseId);

              return (
                <div key={card.exerciseId}>
                  <ContentCardL
                    id={card.exerciseId}
                    isUserJoined={card.includeParty}
                    isGuestAllowedByOwner={card.includeExercise}
                    isCompleted={false}
                    title={card.partyName}
                    date={card.date}
                    location={card.buildingAddr || card.streetAddr}
                    time={`${card.startExerciseTime}~${card.endExerciseTime}`}
                    femaleLevel={card.femaleLevel}
                    maleLevel={card.maleLevel}
                    currentCount={card.nowMemberCnt}
                    totalCount={card.maxMemberCnt}
                    like={isLiked}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              );
            })}
      </div>
    </>
  );
};

export default LikedList;
