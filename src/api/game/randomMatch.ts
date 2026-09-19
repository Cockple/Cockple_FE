// 게임 랜덤 매칭 추천 (REST, POST /api/game-boards/{gameBoardId}/games/random-match)
// 명단에서 바로 게임 가능한 선수 4명을 서버가 추천. 결과는 저장되지 않으며,
// 확정 시 기존 웹소켓 CREATE_GAME을 호출해야 함.
import api from "../api";
import type { CommonResponse } from "../../types/common";

export interface RandomMatchResponse {
  gameBoardMemberIds: number[]; // 추천된 멤버 Id 목록 (예: [12, 18, 25, 31])
}

export const postRandomMatch = async (
  gameBoardId: number,
): Promise<RandomMatchResponse> => {
  const response = await api.post<CommonResponse<RandomMatchResponse>>(
    `/api/game-boards/${gameBoardId}/games/random-match`,
  );
  return response.data.data;
};
