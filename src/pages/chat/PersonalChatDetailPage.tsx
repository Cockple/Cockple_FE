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

  if (!chatId) {
    return <div className="p-4">존재하지 않는 개인 채팅방입니다.</div>;
  }

  return (
    <ChatDetailTemplate
      chatId={Number(chatId)}
      chatName={chatName}
      chatType="personal"
      //chatData={personalChatDataMap}
      onBack={() => navigate("/chat", { state: { tab: "personal" } })}
    />
  );
};
