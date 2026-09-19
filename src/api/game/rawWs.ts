// api/game/rawWs.ts
// GAME 도메인. CHAT과 함께 /ws/realtime 단일 연결(api/realtime/connection.ts)을 공유한다.
import {
  connectRealtimeWs,
  disconnectRealtimeWs,
  isRealtimeWsOpen,
  realtimeWsState,
  sendRealtimeRequest,
  addRealtimeListener,
  addRealtimeOpenListener,
  addRealtimeCloseListener,
  type ResponseEnvelope,
} from "../realtime/connection";
import type { GameBoardPlayer, GameBoardResponse } from "./board";

export const GAME_DOMAIN = "GAME" as const;

// ---------- 요청 envelope ----------
export type GameAction =
  | "SUBSCRIBE"
  | "UNSUBSCRIBE"
  | "CREATE_GAME"
  | "START_GAME"
  | "COMPLETE_GAME"
  | "DELETE_GAME"
  | "MOVE_COURT"
  | "MOVE_TO_WAITING";

// ---------- 응답 envelope ----------
export type GameResponseType =
  | "SUBSCRIBED"
  | "UNSUBSCRIBED"
  | "BOARD_UPDATED"
  | "MEMBERS_UPDATED"
  | "GAME_CREATED"
  | "GAME_DELETED"
  | "ERROR";

export type GameErrorPayload = { code: string; message: string };

// GameBoardDTO.Response (게임 코트 보드 조회 Response와 동일한 스냅샷)
export type GameBoardSnapshot = GameBoardResponse;

export type GameResponseEnvelope<TData = unknown> = ResponseEnvelope<TData> & {
  type: GameResponseType;
};

// --------- 공개 API (연결은 realtime/connection.ts로 위임) ----------
export const connectGameWs = (opts: { origin?: string } = {}) =>
  connectRealtimeWs(opts);

export const disconnectGameWs = () => disconnectRealtimeWs();

export const gameWsState = () => realtimeWsState();
export const isGameWsOpen = () => isRealtimeWsOpen();

// GAME 도메인 메시지만 걸러서 전달
export const addGameWsListener = (fn: (msg: GameResponseEnvelope) => void) =>
  addRealtimeListener(msg => {
    if (msg.domain === "GAME") fn(msg as GameResponseEnvelope);
  });

export const addGameWsOpenListener = addRealtimeOpenListener;
export const addGameWsCloseListener = addRealtimeCloseListener;

// requestId 기반 요청 → 매칭되는 응답(or ERROR)을 Promise로 반환
export const gameWsRequest = <
  TData = unknown,
  TPayload = Record<string, unknown>,
>(
  action: GameAction,
  payload: TPayload,
) =>
  sendRealtimeRequest<TData, TPayload>(
    "GAME",
    action,
    payload,
  ) as Promise<GameResponseEnvelope<TData>>;

// ---------- 액션별 헬퍼 ----------
// 각 액션의 payload/data 필드는 액션별 API 명세가 확정되면 구체 타입으로 교체한다.
export const subscribeGameBoard = (gameBoardId: number) =>
  gameWsRequest<{ gameBoardId: number }>("SUBSCRIBE", { gameBoardId });

export const unsubscribeGameBoard = (gameBoardId: number) =>
  gameWsRequest<{ gameBoardId: number }>("UNSUBSCRIBE", { gameBoardId });

// 대기열에 게임 생성
export type CreateGamePayload = {
  gameBoardId: number;
  gameBoardMemberIds: number[]; // 최대 4명, 배열 순서 = playerOrder
};

export type CreateGameData = {
  gameId: number;
  board: GameBoardSnapshot;
};

export const createGameWS = (payload: CreateGamePayload) =>
  gameWsRequest<CreateGameData>("CREATE_GAME", payload);

// 대기열에 있는 팀을 게임 코트로 옮길 때 사용
export type StartGamePayload = {
  gameBoardId: number;
  gameId: number;
  courtId: number;
};

export const startGameWS = (payload: StartGamePayload) =>
  gameWsRequest<GameBoardSnapshot>("START_GAME", payload);

// 게임 완료 시 코트를 비우고 팀 멤버들의 게임횟수를 증가
export type CompleteGamePayload = {
  gameBoardId: number;
  gameId: number;
};

export const completeGameWS = (payload: CompleteGamePayload) =>
  gameWsRequest<GameBoardSnapshot>("COMPLETE_GAME", payload);

// 복원용 플레이어 정보 — 보드 조회의 PlayerDto(GameBoardPlayer)와 동일하다고 가정. 다르면 교체 필요
export type PlayerInfo = GameBoardPlayer;

// 게임 취소 / 대기열 삭제 시 사용
export type DeleteGamePayload = {
  gameBoardId: number;
  gameId: number;
  restore?: boolean; // true면 삭제 게임 플레이어를 복원용으로 반환 (기본 false)
};

export type DeleteGameData = {
  gameId: number;
  players: PlayerInfo[]; // restore=false면 빈 배열
  board: GameBoardSnapshot;
};

export const deleteGameWS = (payload: DeleteGamePayload) =>
  gameWsRequest<DeleteGameData>("DELETE_GAME", payload);

// 이미 코트에 배정된 경기를 다른 코트로 옮길 때 사용 (피그마상 불필요해 보이나 추후 대비)
export type MoveCourtPayload = {
  gameBoardId: number;
  courtId: number;
  targetCourtNo: number;
};

export const moveCourtWS = (payload: MoveCourtPayload) =>
  gameWsRequest<GameBoardSnapshot>("MOVE_COURT", payload);

// 진행중인 게임을 대기열 맨 앞으로 이동. 코트는 비워짐
export type MoveToWaitingPayload = {
  gameBoardId: number;
  gameId: number;
};

export const moveToWaitingWS = (payload: MoveToWaitingPayload) =>
  gameWsRequest<GameBoardSnapshot>("MOVE_TO_WAITING", payload);
