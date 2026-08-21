// 게임판 코트 관리 (REST, PUT /api/game-boards/{gameBoardId}/courts)
import api from "../api";
import type { CommonResponse } from "../../types/common";

export interface UpdateCourtItem {
  courtId?: number; // 있으면 유지(이름 변경 가능), 없으면 신규 생성. 기존 id가 요청에서 빠지면 삭제
  courtName?: string; // 생략 시 courtNo 기반 기본값(01 코트 등)
}

export interface UpdateCourtsRequest {
  courts: UpdateCourtItem[];
}

export interface CourtItem {
  courtId: number;
  courtNo: number;
  courtName: string;
}

export interface UpdateCourtsResponseData {
  gameBoardId: number;
  courts: CourtItem[];
}

// 400: 입력값 오류 / 404: 게임판 또는 코트를 찾을 수 없음
export const updateCourts = async (
  gameBoardId: number,
  payload: UpdateCourtsRequest,
): Promise<UpdateCourtsResponseData> => {
  const response = await api.put<CommonResponse<UpdateCourtsResponseData>>(
    `/api/game-boards/${gameBoardId}/courts`,
    payload,
  );
  return response.data.data;
};
