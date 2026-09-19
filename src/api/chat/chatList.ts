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
  totalElements: number;
}

export const getGroupChatRooms = async () => {
  const response =
    await api.get<CommonResponse<GetGroupChatsResponse>>(`/api/chats/parties`);

  return response.data.data;
};

export const getPersonalChatRooms = async () => {
  const response =
    await api.get<CommonResponse<GetPersonalChatsResponse>>(
      "/api/chats/direct",
    );

  return response.data.data;
};

export const searchGroupChatRooms = async (name: string) => {
  const res = await api.get<CommonResponse<{ content: GroupChatRoom[] }>>(
    `/api/chats/parties/search`,
    {
      params: { name },
    },
  );
  return res.data.data.content;
};

export const searchPersonalChatRooms = async (name: string) => {
  const res = await api.get<CommonResponse<{ content: PersonalChatRoom[] }>>(
    `/api/chats/direct/search`,
    {
      params: { name },
    },
  );
  return res.data.data.content;
};
