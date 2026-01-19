import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { inviteGuestRequestDTO } from "@/types/InviteGuest";

import axiosLib from "axios";
import api from "@/api/api";

//게스트 정보 가져오기
export const getInviteGuestList = async (exerciseId: number) => {
  const { data } = await api.get(`/api/exercises/${exerciseId}/guests`);
  return data;
};

export const useInviteGuest = (exerciseId: number) => {
  return useSuspenseQuery({
    queryKey: ["inviteGuest", exerciseId],
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

export const usePostInviteForm = (
  exerciseId: number,
  onSuccess: () => void,
) => {
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
      if (axiosLib.isAxiosError(err)) {
        if (err.response?.data?.code === "EXERCISE304") {
          alert(err.response.data.message);
        } else if (err.response?.data?.code === "EXERCISE403") {
          alert(err.response.data.message);
        } else {
          console.error(err.response?.data);
        }
      }
    },
  });
};

//게스트 췩소하기
export const deleteGuest = async (exerciseId: number, guestId: number) => {
  return await api.delete(`/api/exercises/${exerciseId}/guests/${guestId}`);
};

export const useDeleteInviteForm = (exerciseId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guestId: number) => deleteGuest(exerciseId, guestId),
    onSuccess: () => {
      console.log("삭제 성공");
      queryClient.invalidateQueries({
        queryKey: ["inviteGuest", exerciseId],
      });
    },
    onError: err => {
      console.log(err);
      if (axiosLib.isAxiosError(err)) {
        if (err.response?.data?.code === "EXERCISE304") {
          alert(err.response.data.message);
        } else if (err.response?.data?.code === "EXERCISE404") {
          alert(err.response.data.message);
        } else {
          console.error(err.response?.data);
        }
      }
    },
  });
};
