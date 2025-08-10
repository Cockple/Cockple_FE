import api from "../api";

const axios = api;

// const exerciseId = "1";
//guest가져오기
export const getInviteGuestList = async () => {
  const { data } = await axios.get(`/api/exercises/${1}/guests`);
  return data;
};
