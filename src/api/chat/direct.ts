import api from "../api";
//채팅방 생성 및 참여
export const createDirectChat = async (targetMemberId: number) => {
  const response = await api.post("/api/chats/direct", null, {
    params: { targetMemberId },
  });
  return response.data;
};
