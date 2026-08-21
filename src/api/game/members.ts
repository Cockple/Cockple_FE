// 게임판 명단 조회 (REST, GET /api/game-boards/{gameBoardId}/gameBoardMembers)
import qs from "qs";
import api from "../api";
import type { CommonResponse } from "../../types/common";

export interface GameBoardMember {
  gameBoardMemberId: number;
  inGame: boolean; // 운동 참여 여부
  waiting: boolean; // 대기 참여 여부
  participating: boolean; // 참여 여부
  gameCount: number; // 게임 참여 횟수
  profileImageUrl: string | null;
  name: string;
  ageGroup: string;
  level: string;
  shuttlecockSubmitted: boolean;
}

export interface GameBoardMembersResponse {
  totalCount: number; // 전체 운동 인원
  gameBoardMembers: GameBoardMember[];
}

export interface GetGameBoardMembersParams {
  level?: string[]; // 급수, 다중 선택
  gender?: "MALE" | "FEMALE";
  shuttlecockSubmitted?: boolean;
}

export const getGameBoardMembers = async (
  gameBoardId: number,
  params: GetGameBoardMembersParams = {},
): Promise<GameBoardMembersResponse> => {
  const response = await api.get<CommonResponse<GameBoardMembersResponse>>(
    `/api/game-boards/${gameBoardId}/gameBoardMembers`,
    {
      params,
      paramsSerializer: {
        serialize: p => qs.stringify(p, { arrayFormat: "repeat" }), // level=A조&level=B조 형식
      },
    },
  );
  return response.data.data;
};
