import { useMutation } from "@tanstack/react-query";
import api from "../api";
import { useNavigate } from "react-router-dom";
import type {
  OnBoardingRequest,
  OnBoardingResponseDto,
} from "../../types/auth";
import type { GroupMakingKeywordsResponseDTO } from "../../types/groupMaking";

//회원가입하기
export const postOnboarding = async (
  body: OnBoardingRequest,
): Promise<OnBoardingResponseDto> => {
  const { data } = await api.post<OnBoardingResponseDto>(
    "/api/my/details",
    body,
  );
  return data;
};

export const usePostOnboarding = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (body: OnBoardingRequest) => postOnboarding(body),
    onSuccess: data => {
      console.log("성공");
      console.log(data);
      navigate("/onboarding/confirm/start");
    },
    onError: err => {
      console.error(err);
    },
  });
};

//키워드 보내기
const postKeywords = async (
  keywords: string[],
  partyId: number,
): Promise<GroupMakingKeywordsResponseDTO> => {
  const { data } = await api.post<GroupMakingKeywordsResponseDTO>(
    `/api/parties/${partyId}/keywords`,
    { keywords: keywords },
  );
  return data;
};

export const usePostKeywords = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({
      keywords,
      partyId,
    }: {
      partyId: number;
      keywords: string[];
    }) => postKeywords(keywords, partyId),
    onSuccess: (data, v) => {
      console.log("성공");
      console.log(data);
      navigate(`/group/making/member/${v}`);
    },
    onError: err => {
      console.error(err);
    },
  });
};
