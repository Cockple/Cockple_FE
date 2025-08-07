// 채팅 메인페이지 채팅방 카드 리스트
import { GroupChat } from "../common/contentcard/GroupChat";
import { PersonalChat } from "../common/contentcard/PersonalChat";
//import type { GroupChatProps } from "../common/contentcard/GroupChat";
//import type { PersonalChatProps } from "../common/contentcard/PersonalChat";
import type { NavigateFunction } from "react-router-dom";
import type { GroupChatRoom, PersonalChatRoom } from "../../types/chat";

interface Props {
  tab: "group" | "personal";
  groupChats: GroupChatRoom[];
  personalChats: PersonalChatRoom[];
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
              key={chat.chatRoomId}
              onClick={() => {
                navigate(`/chat/group/${chat.chatRoomId}`, {
                  state: {
                    tab: "group",
                    chatName: chat.partyName,
                    partyId: chat.partyId,
                  },
                });
              }}
              className="border-b border-gy-200 pb-1"
            >
              <GroupChat
                imageSrc={chat.partyImgUrl}
                chatName={chat.partyName}
                memberCount={chat.memberCount}
                lastMessage={chat.lastMessage.content}
                lastMessageTime={chat.lastMessage.timestamp}
                unreadCount={chat.unreadCount}
              />
            </div>
          ))
        : personalChats.map(chat => (
            <div
              key={chat.chatRoomId}
              onClick={() =>
                navigate(`/chat/personal/${chat.chatRoomId}`, {
                  state: {
                    tab: "personal",
                    chatName: chat.displayName,
                  },
                })
              }
              className="border-b border-gy-200 pb-1"
            >
              <PersonalChat
                imageSrc={chat.profileImageUrl}
                userName={chat.displayName}
                lastMessage={chat.lastMessage.content}
                lastMessageTime={chat.lastMessage.timestamp}
                unreadCount={chat.unreadCount}
              />
            </div>
          ))}
    </div>
  );
};

export default ChatList;
