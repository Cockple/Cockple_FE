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
  gender: string; // 한글 표시값 ("남성" | "여성")
  ageGroup: string; // 한글 표시값 (예: "30대")
  level: string; // 한글 표시값 (예: "A조")
  shuttlecockSubmitted: boolean;
}

export interface GameBoardMembersResponse {
  totalCount: number; // 필터와 무관한 전체 명단 수
  gameBoardMembers: GameBoardMember[];
}

// level/gender는 한글 표시값을 그대로 전달 (예: level=A조&level=B조, gender=남성). 서로 다른 필터는 AND, 같은 level 다중 선택은 OR.
export interface GetGameBoardMembersParams {
  level?: string[];
  gender?: "남성" | "여성";
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

export interface GameBoardMemberPayload {
  name: string;
  gender: "남성" | "여성"; // 서버는 한글 표시값만 허용
  level: string; // 한글 급수 라벨 (예: "D조", "급수없음")
  ageGroup?: string; // 한글 나이대 라벨 (예: "30대")
}

export type CreateGameBoardMemberRequest = GameBoardMemberPayload;
export type UpdateGameBoardMemberRequest = GameBoardMemberPayload;

export interface CreateGameBoardMemberResponseData {
  gameBoardMemberId: number;
}

export const createGameBoardMember = async (
  gameBoardId: number,
  player: CreateGameBoardMemberRequest,
): Promise<CreateGameBoardMemberResponseData> => {
  const response = await api.post<CommonResponse<CreateGameBoardMemberResponseData>>(
    `/api/game-boards/${gameBoardId}/gameBoardMembers`,
    player,
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
    player,
  );
};
