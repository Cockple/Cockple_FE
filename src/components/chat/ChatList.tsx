// 채팅 메인페이지 채팅방 카드 리스트
import { GroupChat } from "../common/contentcard/GroupChat";
import { PersonalChat } from "../common/contentcard/PersonalChat";
//import type { GroupChatProps } from "../common/contentcard/GroupChat";
//import type { PersonalChatProps } from "../common/contentcard/PersonalChat";
import type { NavigateFunction } from "react-router-dom";
import type { GroupChatRoom, PersonalChatRoom } from "../../types/chat";
import { formatEnLowerAmPm } from "../../utils/time";
import { EmptyState } from "../alert/EmptyState";

interface Props {
  tab: "group" | "personal";
  groupChats: GroupChatRoom[];
  personalChats: PersonalChatRoom[];
  //isValidSearch: boolean;
  searchTerm: string;
  navigate: NavigateFunction;
}

const ChatList = ({
  tab,
  groupChats,
  personalChats,
  //isValidSearch,
  searchTerm,
  navigate,
}: Props) => {
  // 🌟 탭별 빈 상태 메시지
  const emptyMessageMap: Record<Props["tab"], string> = {
    group: "아직 모임 채팅",
    personal: "아직 개인 채팅",
  };

  const chatData = tab === "group" ? groupChats : personalChats;

  if (searchTerm !== "" && chatData.length == 0) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60dvh]">
        <EmptyState message="검색 결과가" />
      </div>
    );
  }

  if (chatData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60dvh]">
        <EmptyState message={emptyMessageMap[tab]} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[0.625rem] w-full">
      {tab === "group"
        ? groupChats.map(chat => {
            const lm = chat.lastMessage;
            const lastText =
              lm?.content ??
              (lm?.messageType === "IMAGE" ? "사진" : "메시지가 없습니다");
            //const lastTime = lm?.timestamp ?? "";
            const lastTime = lm?.timestamp
              ? formatEnLowerAmPm(lm.timestamp)
              : "";

            return (
              <div
                key={chat.chatRoomId}
                onClick={() => {
                  navigate(`/chat/group/${chat.chatRoomId}`, {
                    state: {
                      tab: "group",
                      chatName: chat.partyName,
                      partyId: chat.partyId,
                      partyProfileImg: chat.partyImgUrl,
                    },
                  });
                }}
                className="border-b border-gy-200 pb-1"
              >
                <GroupChat
                  imageSrc={chat.partyImgUrl ?? ""}
                  chatName={chat.partyName}
                  memberCount={chat.memberCount}
                  lastMessage={lastText} // 안전
                  lastMessageTime={lastTime} // 안전
                  unreadCount={chat.unreadCount}
                />
              </div>
            );
          })
        : personalChats.map(chat => {
            const lm = chat.lastMessage;
            const lastText =
              lm?.content ??
              (lm?.messageType === "IMAGE" ? "사진" : "메시지가 없습니다");
            // const lastTime = lm?.timestamp ?? "";
            const lastTime = lm?.timestamp
              ? formatEnLowerAmPm(lm.timestamp)
              : "";

            return (
              <div
                key={chat.chatRoomId}
                onClick={() =>
                  navigate(`/chat/personal/${chat.chatRoomId}`, {
                    state: { tab: "personal", chatName: chat.displayName },
                  })
                }
                className="border-b border-gy-200 pb-1"
              >
                <PersonalChat
                  imageSrc={chat.profileImgUrl ?? ""}
                  userName={chat.displayName}
                  lastMessage={lastText} // 안전
                  lastMessageTime={lastTime} // 안전
                  unreadCount={chat.unreadCount}
                  isAloneWithdrawn={chat.isWithdrawn}
                  // isAloneWithdrawn={true}
                />
              </div>
            );
          })}
    </div>
  );
};

export default ChatList;
