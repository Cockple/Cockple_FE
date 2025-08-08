import api from "../api";
import type { ChatMessageResponse, ChatRoomInfo } from "../../types/chat";

interface GetChatMessagesResponse {
  chatRoomInfo: ChatRoomInfo;
  messages: ChatMessageResponse[];
}

export const fetchChatMessages = async (
  roomId: string,
): Promise<GetChatMessagesResponse> => {
  const response = await api.get(`/api/chats/rooms/${roomId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 또는 context에서 토큰 추출
    },
  });
  console.log("messages: ", response);

  return response.data.data;
};
