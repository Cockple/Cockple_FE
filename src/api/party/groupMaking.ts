import { useMutation } from "@tanstack/react-query";
import type {
  GroupMakingRequestDto,
  GroupMakingResponseDTO,
} from "../../types/groupMaking";
import api from "../api";
import { useGroupMakingFilterStore } from "../../store/useGroupMakingFilter";
import { useNavigate } from "react-router-dom";

const postGroupMaking = async (
  body: GroupMakingRequestDto,
): Promise<GroupMakingResponseDTO> => {
  const { data } = await api.post<GroupMakingResponseDTO>("/api/parties", body);
  return data;
};

export const usePostGroupMaking = () => {
  const { resetFilter } = useGroupMakingFilterStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (body: GroupMakingRequestDto) => postGroupMaking(body),
    onSuccess: res => {
      console.log("성공");
      console.log(res.data);
      resetFilter();
      navigate(`/confirm/${res.data.partyId}`, {
        state: {
          onboarding: false,
        },
      });
    },
    onError: err => {
      console.error(err);
    },
  });
};
