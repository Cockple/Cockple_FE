import api from "../api";

const axios = api;

//guest가져오기
export const getInviteGuestList = async (exerciseId?: string) => {
  const { data } = await axios.get(`/api/exercises/${exerciseId}/guests`);
  return data;
};
