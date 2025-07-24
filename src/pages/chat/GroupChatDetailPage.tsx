// 그룹채팅창 페이지

import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ChatDetailTemplate } from "../../components/chat/ChatDetailTemplate";
import ProfileImg from "../../assets/images/Profile_Image.png";
import type { ChatMessageResponse } from "../../types/chat";

export const GroupChatDetailPage = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const chatName = location.state?.chatName || `모임채팅방 ${chatId}`;

  const groupChatDataMap: Record<string, ChatMessageResponse[]> = {
    "1": [
      {
        messageId: 1,
        chatRoomId: 1,
        senderId: 101,
        senderName: "양준석(팀장)",
        senderProfileImage: ProfileImg,
        messageType: "TEXT",
        content: "그룹 채팅에 오신 걸 환영합니다!",
        reactions: [],
        replyTo: null,
        fileInfo: null,
        isDeleted: false,
        createdAt: "2025-07-20T10:01:00Z",
        updatedAt: "2025-07-20T10:01:00Z",
      },
      {
        messageId: 2,
        chatRoomId: 1,
        senderId: 101,
        senderName: "양준석(팀장)",
        senderProfileImage: ProfileImg,
        messageType: "TEXT",
        content: "간단한 자기소개 부탁드려요~",
        reactions: [],
        replyTo: null,
        fileInfo: null,
        isDeleted: false,
        createdAt: "2025-07-20T10:02:00Z",
        updatedAt: "2025-07-20T10:02:00Z",
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
