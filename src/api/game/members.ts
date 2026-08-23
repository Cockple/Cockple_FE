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

// 한글 급수 라벨(LEVEL_KEY) → API 코드. convertLevel.ts/filterUtils.ts의 매핑과 동일한 규칙.
export const LEVEL_KO_TO_EN: Record<string, string> = {
  자강: "EXPERT",
  준자강: "SEMI_EXPERT",
  A조: "A",
  B조: "B",
  C조: "C",
  D조: "D",
  초심: "BEGINNER",
  왕초심: "NOVICE",
  급수없음: "NONE",
};

// 한글 나이대 라벨 → API 코드. "30대"=THIRTIES만 명세로 확인됐고 나머지는 동일 규칙으로 추정 — 틀리면 여기만 고치면 됨.
const AGE_GROUP_KO_TO_EN: Record<string, string> = {
  "10대": "TEENS",
  "20대": "TWENTIES",
  "30대": "THIRTIES",
  "40대": "FORTIES",
  "50대": "FIFTIES",
  "60대 이상": "SIXTIES",
};

export interface GameBoardMemberPayload {
  name: string;
  gender: "MALE" | "FEMALE";
  level: string; // 한글 급수 라벨 (예: "D조", "급수없음")
  ageGroup?: string; // 한글 나이대 라벨 (예: "30대")
}

export type CreateGameBoardMemberRequest = GameBoardMemberPayload;
export type UpdateGameBoardMemberRequest = GameBoardMemberPayload;

const toMemberRequestBody = (player: GameBoardMemberPayload) => ({
  name: player.name,
  gender: player.gender,
  level: LEVEL_KO_TO_EN[player.level] ?? player.level,
  ageGroup: player.ageGroup
    ? (AGE_GROUP_KO_TO_EN[player.ageGroup] ?? player.ageGroup)
    : undefined,
});

export interface CreateGameBoardMemberResponseData {
  gameBoardMemberId: number;
}

export const createGameBoardMember = async (
  gameBoardId: number,
  player: CreateGameBoardMemberRequest,
): Promise<CreateGameBoardMemberResponseData> => {
  const response = await api.post<CommonResponse<CreateGameBoardMemberResponseData>>(
    `/api/game-boards/${gameBoardId}/gameBoardMembers`,
    toMemberRequestBody(player),
  );
  return response.data.data;
};

// 참여 상태 변경 (PATCH /api/game-boards/{boardId}/gameBoardMembers/{gameBoardMemberId}/participation)
export const updateGameBoardMemberParticipation = async (
  gameBoardId: number,
  gameBoardMemberId: number,
  participating: boolean,
): Promise<void> => {
  await api.patch<CommonResponse<null>>(
    `/api/game-boards/${gameBoardId}/gameBoardMembers/${gameBoardMemberId}/participation`,
    { participating },
  );
};

// 플레이어 정보 수정 (PATCH /api/game-boards/{boardId}/gameBoardMembers/{gameBoardMemberId})
export const updateGameBoardMember = async (
  gameBoardId: number,
  gameBoardMemberId: number,
  player: UpdateGameBoardMemberRequest,
): Promise<void> => {
  await api.patch<CommonResponse<null>>(
    `/api/game-boards/${gameBoardId}/gameBoardMembers/${gameBoardMemberId}`,
    toMemberRequestBody(player),
  );
};
