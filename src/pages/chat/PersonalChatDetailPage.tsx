// 개인채팅창 페이지

import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ChatDetailTemplate } from "../../components/chat/ChatDetailTemplate";
//import ProfileImg from "../../assets/images/Profile_Image.png";
//import type { ChatMessageResponse } from "../../types/chat";
//import { personalChatDataMap } from "../../components/chat/personalChatMessageDummy";

export const PersonalChatDetailPage = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const chatName = location.state?.chatName || `개인채팅방 ${chatId}`;

  // const personalChatDataMap: Record<string, ChatMessageResponse[]> = {
  //   "100": [
  //     {
  //       messageId: 1,
  //       chatRoomId: 100,
  //       senderId: 201,
  //       senderName: "김세익스피어",
  //       senderProfileImage: ProfileImg,
  //       messageType: "TEXT",
  //       content: "안녕하세요! 개인채팅입니다 :)",
  //       reactions: [],
  //       replyTo: null,
  //       fileInfo: null,
  //       isDeleted: false,
  //       createdAt: "2025-07-20T10:30:00Z",
  //       updatedAt: "2025-07-20T10:30:00Z",
  //     },
  //     {
  //       messageId: 2,
  //       chatRoomId: 100,
  //       senderId: 999,
  //       senderName: "나",
  //       senderProfileImage: ProfileImg,
  //       messageType: "TEXT",
  //       content: "반가워요!",
  //       reactions: [],
  //       replyTo: null,
  //       fileInfo: null,
  //       isDeleted: false,
  //       createdAt: "2025-07-20T10:35:00Z",
  //       updatedAt: "2025-07-20T10:35:00Z",
  //     },
  //   ],
  // };

  if (!chatId) {
    return <div className="p-4">존재하지 않는 개인 채팅방입니다.</div>;
  }

  return (
    <ChatDetailTemplate
      chatId={chatId}
      chatName={chatName}
      chatType="personal"
      //chatData={personalChatDataMap}
      onBack={() => navigate("/chat", { state: { tab: "personal" } })}
    />
  );
};
