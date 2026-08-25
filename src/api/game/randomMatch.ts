// 게임 랜덤 매칭 추천 (REST, POST /api/game-boards/{gameBoardId}/games/random-match)
// 명단에서 바로 게임 가능한 선수 4명을 서버가 추천. 결과는 저장되지 않으며,
// 확정 시 기존 웹소켓 CREATE_GAME을 호출해야 함.
// 응답 필드명은 스웨거 스키마 충돌(다른 DTO와 이름이 겹침)로 미확정 -> 실제 응답 확인되면 보정 필요.
import api from "../api";
import type { CommonResponse } from "../../types/common";

export interface RandomMatchResponse {
  gameBoardMemberIds: number[]; // 팀 구분 없이 오름차순, 매치 타입은 노출되지 않음
}

export const postRandomMatch = async (
  gameBoardId: number,
): Promise<RandomMatchResponse> => {
  const response = await api.post<CommonResponse<RandomMatchResponse>>(
    `/api/game-boards/${gameBoardId}/games/random-match`,
  );
  return response.data.data;
};
