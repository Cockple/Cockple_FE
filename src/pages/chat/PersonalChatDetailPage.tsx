// 개인채팅창 페이지

import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ChatDetailTemplate } from "../../components/chat/ChatDetailTemplate";
import ProfileImg from "../../assets/images/Profile_Image.png";
import type { Chatting } from "../../types/chat";

export const PersonalChatDetailPage = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const chatName = location.state?.chatName || `개인채팅방 ${chatId}`;

  const personalChatDataMap: Record<string, Chatting[]> = {
    "100": [
      {
        id: 1,
        nickname: "김세익스피어",
        profile: ProfileImg,
        chatting: "안녕하세요! 개인채팅입니다 :)",
        time: "10:30",
        createdAt: "2024.06.01",
        isMe: false,
        unreadCount: 0,
      },
      {
        id: 2,
        nickname: "나",
        profile: ProfileImg,
        chatting: "반가워요!",
        time: "10:35",
        createdAt: "2024.06.01",
        isMe: true,
        unreadCount: 1,
      },
    ],
  };

  if (!chatId || !personalChatDataMap[chatId]) {
    return <div className="p-4">존재하지 않는 개인 채팅방입니다.</div>;
  }

  return (
    <ChatDetailTemplate
      chatId={chatId}
      chatName={chatName}
      chatType="personal"
      chatData={personalChatDataMap}
      onBack={() => navigate("/chat", { state: { tab: "personal" } })}
    />
  );
};
