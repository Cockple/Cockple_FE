import api from "../api";

//다른 회원 메달 조회
export const getOtherUserMedals = async (memberId: number) => {
  const response = await api.get(`/api/members/${memberId}/medals`);
  console.log(response);
  return response.data.data;
};
