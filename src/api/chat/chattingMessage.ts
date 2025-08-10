import api from "../api";
import type {
  ChatMessageResponse,
  ChatRoomInfo,
  Participants,
} from "../../types/chat";

export interface GetChatMessagesResponse {
  chatRoomInfo: ChatRoomInfo;
  messages: ChatMessageResponse[];
  participants: Participants[];
}

// 최초 진입(현재 윈도우) 불러오기
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

// 과거(이전) 메시지 페이지 불러오기
export interface FetchPreviousRes {
  messages: ChatMessageResponse[];
  hasNext: boolean;
  nextCursor: number | null;
  totalElements: number;
}

export const fetchPreviousMessages = async ({
  roomId,
  cursor,
  size = 50,
}: {
  roomId: string;
  cursor: number; // 마지막으로 읽은 메시지ID
  size?: number;
}): Promise<FetchPreviousRes> => {
  const res = await api.get(`/api/chats/rooms/${roomId}/messages/previous`, {
    params: { cursor, size },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return res.data.data;
};
