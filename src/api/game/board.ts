// 게임 코트 보드 조회 (REST, GET /api/game-boards/{gameBoardId})
// 명단을 제외한 게임코트/대기열 스냅샷. 웹소켓 각 액션 응답의 board/data와 동일한 shape(GameBoardDTO.Response).
import api from "../api";
import type { CommonResponse } from "../../types/common";

export type CourtStatus = "EMPTY" | "PLAYING";

export interface GameBoardPlayer {
  gameBoardMemberId: number;
  name: string;
  level: string;
  playerOrder: number;
}

export interface GameBoardCourtGame {
  gameId: number;
  startedAt: string; // 경과 시간은 클라가 now - startedAt으로 계산
  players: GameBoardPlayer[];
}

export interface GameBoardCourt {
  courtId: number;
  courtNo: number;
  courtName: string;
  status: CourtStatus;
  game: GameBoardCourtGame | null; // EMPTY면 null
}

export interface GameBoardWaiting {
  gameId: number; // status=WAITING
  waitingOrder: number; // 화면 대기 N번. 정렬 인덱스(저장값 아님)
  players: GameBoardPlayer[];
}

export interface GameBoardResponse {
  courtCount: number; // 0이면 코트 생성 화면 분기
  courts: GameBoardCourt[];
  waitings: GameBoardWaiting[];
}

export const getGameBoard = async (
  gameBoardId: number,
): Promise<GameBoardResponse> => {
  const response = await api.get<CommonResponse<GameBoardResponse>>(
    `/api/game-boards/${gameBoardId}`,
  );
  return response.data.data;
};
