import api from "../api";
import type { ChatMessageResponse } from "../../types/chat";

interface GetChatMessagesResponse {
  messages: ChatMessageResponse[];
  hasNext: boolean;
  nextCursor: number;
  totalCount: number;
}

export const fetchChatMessages = async (
  roomId: string,
  cursor?: number,
  size: number = 20,
  direction: "DESC" | "ASC" = "DESC",
): Promise<GetChatMessagesResponse> => {
  const response = await api.get(`/api/chats/rooms/${roomId}`, {
    params: {
      cursor,
      size,
      direction,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`, // 또는 context에서 토큰 추출
    },
  });

  return response.data.data;
};
