// src/api/chat.ts
import api from "../api";
import type { GroupChatRoom, PersonalChatRoom } from "../../types/chat";
import type { CommonResponse } from "../../types/common";

export interface GetGroupChatsResponse {
  content: GroupChatRoom[];
  hasNext: boolean;
}

interface GetPersonalChatsResponse {
  content: PersonalChatRoom[];
  hasNext: boolean;
}

export const getGroupChats = async (page = 0, size = 20) => {
  const response = await api.get<CommonResponse<GetGroupChatsResponse>>(
    "/api/chats/parties",
    {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  );
  return response.data.data;
};

export const getPersonalChats = async (page = 0, size = 20) => {
  const response = await api.get<CommonResponse<GetPersonalChatsResponse>>(
    "/api/chats/direct",
    {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    },
  );

  return response.data.data;
};
