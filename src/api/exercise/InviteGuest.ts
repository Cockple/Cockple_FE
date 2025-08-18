import { useQuery } from "@tanstack/react-query";
import api from "../api";

const axios = api;

//guest가져오기
export const getInviteGuestList = async (exerciseId: number) => {
  const { data } = await axios.get(`/api/exercises/${exerciseId}/guests`);
  return data;
};
//guset 초대하기

export const useInviteGuest = (exerciseId: number) => {
  return useQuery({
    queryKey: ["inviteGuest", exerciseId],
    enabled: !!exerciseId,
    queryFn: () => getInviteGuestList(exerciseId),

    select: res => res.data,
  });
};
