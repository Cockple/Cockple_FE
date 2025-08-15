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
  const response = await api.get<CommonResponse<GetGroupChatsResponse>>(
    `/api/chats/parties`,
    // {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //   },
    // },
  );

  // if (response.data.code === "CHAT202" || response.data.errorReason.code === "CHAT202") {
  //   return {content: [], hasNext: false};
  // }
  console.log("party: ", response);
  return response.data.data;
};

export const getPersonalChatRooms = async () => {
  const response = await api.get<CommonResponse<GetPersonalChatsResponse>>(
    "/api/chats/direct",
    // {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //   },
    // },
  );

  if (
    response.data.code === "CHAT202" ||
    response.data.errorReason.code === "CHAT202"
  ) {
    return { content: [], hasNext: false };
  }
  console.log("direct: ", response);
  return response.data.data;
};

export const searchGroupChatRooms = async (name: string) => {
  const res = await api.get<CommonResponse<{ content: GroupChatRoom[] }>>(
    `/api/chats/parties/search`,
    {
      params: { name },
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      // },
    },
  );
  console.log("groupChatRoomSearch: ", res.data.data.content);
  return res.data.data.content;
};

export const searchPersonalChatRooms = async (name: string) => {
  const res = await api.get<CommonResponse<{ content: PersonalChatRoom[] }>>(
    `/api/chats/direct/search`,
    {
      params: { name },
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      // },
    },
  );
  console.log("personalChatRoomSearch: ", res);
  return res.data.data.content;
};
