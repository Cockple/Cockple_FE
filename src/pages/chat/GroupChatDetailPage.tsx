// 그룹채팅창 페이지

import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ChatDetailTemplate } from "../../components/chat/ChatDetailTemplate";
//import ProfileImg from "../../assets/images/Profile_Image.png";
//import type { ChatMessageResponse } from "../../types/chat";
//import { groupChatDataMap } from "../../components/chat/groupChatMessageDummy";

export const GroupChatDetailPage = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const chatName = location.state?.chatName || `모임채팅방 ${chatId}`;
  const partyId = location.state?.partyId;

  if (!chatId) return null;

  return (
    <ChatDetailTemplate
      chatId={chatId}
      chatName={chatName}
      chatType="group"
      //chatData={groupChatDataMap}
      onBack={() => navigate(`/chat`, { state: { tab: "group" } })}
      showHomeButton
      partyId={partyId}
    />
  );
};
