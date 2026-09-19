// 게임 중복 체크 (REST, GET /api/game-boards/{gameBoardId}/games/duplicate-check)
// 선택 인원 쌍 별 대전 횟수 제공
import qs from "qs";
import api from "../api";
import type { CommonResponse } from "../../types/common";

export interface DuplicateCheckPair {
  memberIdA: number;
  memberIdB: number;
  count: number; // 그날 누적 대전 횟수
  playedInLastGame: boolean;
}

export interface DuplicateCheckResponse {
  pairs: DuplicateCheckPair[]; // 4명이면 6쌍
}

export const getGameDuplicateCheck = async (
  gameBoardId: number,
  gameBoardMemberIds: number[],
): Promise<DuplicateCheckResponse> => {
  const response = await api.get<CommonResponse<DuplicateCheckResponse>>(
    `/api/game-boards/${gameBoardId}/games/duplicate-check`,
    {
      params: { gameBoardMemberId: gameBoardMemberIds },
      paramsSerializer: {
        serialize: params => qs.stringify(params, { arrayFormat: "repeat" }), // gameBoardMemberId=101&gameBoardMemberId=102 형식
      },
    },
  );
  return response.data.data;
};
