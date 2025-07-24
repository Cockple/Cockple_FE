// 채팅 메인페이지 채팅방 카드 리스트
import React from "react";
import { GroupChat } from "../common/contentcard/GroupChat";
import { PersonalChat } from "../common/contentcard/PersonalChat";
import type { GroupChatProps } from "../common/contentcard/GroupChat";
import type { PersonalChatProps } from "../common/contentcard/PersonalChat";
import type { NavigateFunction } from "react-router-dom";

interface Props {
  tab: "group" | "personal";
  groupChats: (GroupChatProps & { id: number })[];
  personalChats: (PersonalChatProps & { id: number })[];
  isValidSearch: boolean;
  searchTerm: string;
  navigate: NavigateFunction;
}

const ChatList = ({
  tab,
  groupChats,
  personalChats,
  isValidSearch,
  searchTerm,
  navigate,
}: Props) => {
  if (searchTerm !== "" && !isValidSearch) {
    return (
      <div className="text-center text-gy-500 py-4">검색 결과가 없습니다.</div>
    );
  }

  const chatData = tab === "group" ? groupChats : personalChats;

  if (chatData.length === 0) {
    return (
      <div className="text-center text-gy-500 py-4">검색 결과가 없습니다.</div>
    );
  }

  return (
    <div className="flex flex-col gap-[0.625rem] w-full">
      {tab === "group"
        ? groupChats.map(chat => (
            <div
              key={chat.id}
              onClick={() =>
                navigate(`/chat/group/${chat.id}`, {
                  state: { tab: "group", chatName: chat.chatName },
                })
              }
              className="border-b border-gy-200 pb-1"
            >
              <GroupChat {...chat} />
            </div>
          ))
        : personalChats.map(chat => (
            <div
              key={chat.id}
              onClick={() =>
                navigate(`/chat/personal/${chat.id}`, {
                  state: { tab: "personal", chatName: chat.userName },
                })
              }
              className="border-b border-gy-200 pb-1"
            >
              <PersonalChat {...chat} />
            </div>
          ))}
    </div>
  );
};

export default ChatList;
