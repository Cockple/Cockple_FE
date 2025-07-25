import React from "react";
import { Group_M } from "../common/contentcard/Group_M";
import { ContentCardL } from "../common/contentcard/ContentCardL";

interface LikedListProps {
  activeTab: "group" | "exercise";
  groupCards: any[];
  exerciseCards: any[];
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
            <div key={card.id} className="border-b border-gy-200 pb-1">
              <Group_M
                key={card.id}
                {...card}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))
        : exerciseCards.map(card => (
            <div key={card.id}>
              <ContentCardL
                key={card.title}
                {...card}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}
    </div>
  );
};

export default LikedList;
