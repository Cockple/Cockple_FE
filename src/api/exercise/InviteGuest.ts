import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import type { inviteGuestRequestDTO } from "../../types/InviteGuest";

//게스트 정보 가져오기
export const getInviteGuestList = async (exerciseId: number) => {
  const { data } = await api.get(`/api/exercises/${exerciseId}/guests`);
  return data;
};

export const useInviteGuest = (exerciseId: number) => {
  return useQuery({
    queryKey: ["inviteGuest", exerciseId],
    enabled: !!exerciseId,
    queryFn: () => getInviteGuestList(exerciseId),

    select: res => res.data,
  });
};

//게스트 초대하기
export const postInviteGuest = async (
  exerciseId: number,
  body: inviteGuestRequestDTO,
) => {
  return await api.post(`/api/exercises/${exerciseId}/guests`, body);
};

export const useInviteForm = (exerciseId: number, onSuccess: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: inviteGuestRequestDTO) =>
      postInviteGuest(exerciseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inviteGuest", exerciseId],
      });
      onSuccess();
    },
    onError: err => {
      console.log(err);
    },
  });
};
