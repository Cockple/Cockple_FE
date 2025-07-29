import { Group_M } from "../common/contentcard/Group_M";
import { ContentCardL } from "../common/contentcard/ContentCardL";
import type { ExerciseCard, GroupCard } from "../../types/liked";

interface LikedListProps {
  activeTab: "group" | "exercise";
  groupCards: GroupCard[];
  exerciseCards: ExerciseCard[];
  onToggleFavorite?: (id: number) => void;
}

const LikedList = ({
  activeTab,
  groupCards,
  exerciseCards,
  onToggleFavorite,
}: LikedListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {activeTab === "group"
        ? groupCards.map(card => (
            <div key={card.partyId} className="border-b border-gy-200 pb-1">
              <Group_M
                key={card.partyId}
                id={card.partyId}
                groupName={card.partyName}
                groupImage={card.profileImgUrl}
                location={`${card.addr1}/${card.addr2}`}
                femaleLevel={card.femaleLevel}
                maleLevel={card.maleLevel}
                nextActivitDate={card.latestExerciseDate}
                upcomingCount={card.exerciseCnt}
                like={card.isFavorite}
                isMine={false}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))
        : exerciseCards.map(card => (
            <div key={card.exerciseId}>
              <ContentCardL
                key={card.exerciseId}
                id={card.exerciseId}
                isUserJoined={card.includeParty}
                isGuestAllowedByOwner={card.includeExercise}
                isCompleted={false}
                title={card.partyName}
                date={card.date}
                location={
                  card.buildingAddr ? card.buildingAddr : card.streetAddr
                }
                time={`${card.startExerciseTime}~${card.endExerciseTime}`}
                femaleLevel={card.femaleLevel}
                maleLevel={card.maleLevel}
                currentCount={card.nowMemberCnt}
                totalCount={card.maxMemberCnt}
                like={card.isFavorite}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}
    </div>
  );
};

export default LikedList;
