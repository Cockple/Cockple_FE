// 그룹채팅창 페이지

import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ChatDetailTemplate } from "../../components/chat/ChatDetailTemplate";
import ProfileImg from "../../assets/images/Profile_Image.png";
import type { Chatting } from "../../types/chat";

export const GroupChatDetailPage = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const chatName = location.state?.chatName || `모임채팅방 ${chatId}`;

  const groupChatDataMap: Record<string, Chatting[]> = {
    "1": [
      {
        id: 1,
        nickname: "양준석(팀장)",
        profile: ProfileImg,
        chatting: "그룹 채팅에 오신 걸 환영합니다!",
        time: "10:01",
        createdAt: "2024.06.01",
        isMe: false,
        unreadCount: 3,
      },
      {
        id: 2,
        nickname: "양준석(팀장)",
        profile: ProfileImg,
        chatting: "간단한 자기소개 부탁드려요~",
        time: "10:02",
        createdAt: "2024.06.01",
        isMe: false,
        unreadCount: 3,
      },
      {
        id: 3,
        nickname: "민턴찡",
        profile: ProfileImg,
        chatting: "콱콱 오세요~",
        time: "09:30",
        createdAt: "2024.06.01",
        isMe: false,
        unreadCount: 2,
      },
      {
        id: 4,
        nickname: "윤짱",
        profile: ProfileImg,
        chatting: "오늘 5시에 봐요!",
        time: "09:35",
        createdAt: "2024.06.01",
        isMe: false,
        unreadCount: 1,
      },
    ],
  };

  if (!chatId) return null;

  return (
    <ChatDetailTemplate
      chatId={chatId}
      chatName={chatName}
      chatType="group"
      chatData={groupChatDataMap}
      onBack={() => navigate("/chat", { state: { tab: "group" } })}
      showHomeButton
    />
  );
};
