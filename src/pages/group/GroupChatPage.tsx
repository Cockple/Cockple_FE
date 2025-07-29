// 그룹채팅창 페이지

import { useParams, useNavigate } from "react-router-dom";
//import { ChatDetailTemplate } from "../../components/chat/ChatDetailTemplate";
//import ProfileImg from "../../assets/images/Profile_Image.png";
//import type { ChatMessageResponse } from "../../types/chat";
import { groupChatDataMap } from "../../components/chat/groupChatMessageDummy";
import { GroupChatDetailTemplate } from "../../components/chat/GroupChatDetailTemplate";

export const GroupChatPage = () => {
  const { groupId } = useParams();
  //const location = useLocation();
  const navigate = useNavigate();
  //const chatName = location.state?.chatName || `모임채팅방 ${groupId}`;

  // const groupChatDataMap: Record<string, ChatMessageResponse[]> = {
  //   "1": [
  //     {
  //       messageId: 1,
  //       chatRoomId: 5,
  //       senderId: 101,
  //       senderName: "양준석(팀장)",
  //       senderProfileImage: ProfileImg,
  //       messageType: "TEXT",
  //       content: "그룹 채팅에 오신 걸 환영합니다!",
  //       reactions: [],
  //       replyTo: null,
  //       fileInfo: null,
  //       isDeleted: false,
  //       createdAt: "2025-07-20T10:01:00Z",
  //       updatedAt: "2025-07-20T10:01:00Z",
  //     },
  //     {
  //       messageId: 2,
  //       chatRoomId: 6,
  //       senderId: 101,
  //       senderName: "양준석(팀장)",
  //       senderProfileImage: ProfileImg,
  //       messageType: "TEXT",
  //       content: "간단한 자기소개 부탁드려요~",
  //       reactions: [],
  //       replyTo: null,
  //       fileInfo: null,
  //       isDeleted: false,
  //       createdAt: "2025-07-20T10:02:00Z",
  //       updatedAt: "2025-07-20T10:02:00Z",
  //     },
  //   ],
  // };

  if (!groupId) return null;

  return (
    <GroupChatDetailTemplate
      chatId={groupId}
      //chatName={chatName}
      chatType="group"
      chatData={groupChatDataMap}
      onBack={() => navigate(`/group/${groupId}`, { state: { tab: "group" } })}
    />
  );
};
