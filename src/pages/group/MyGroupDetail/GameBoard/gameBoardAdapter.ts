// 게임판 REST/WS 응답(GameBoardDTO 등)을 화면에서 쓰는 view model(CourtGroup/WaitingGroup/GameMember)로 변환한다.
import type {
  GameBoardCourt,
  GameBoardPlayer,
  GameBoardResponse,
  GameBoardWaiting,
} from "@/api/game/board";
import type { GameBoardMember } from "@/api/game/members";
import type { CourtGroup, GameMember, GamePlayer, WaitingGroup } from "./mockGameBoardData";

export const formatElapsed = (startedAt: string) => {
  const ms = Date.now() - new Date(startedAt).getTime();
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

const toGamePlayer = (p: GameBoardPlayer): GamePlayer => ({
  id: p.gameBoardMemberId,
  name: p.name,
  group: p.level,
  color: p.playerOrder % 2 === 0 ? "pink" : "blue",
});

export const toCourtGroup = (c: GameBoardCourt): CourtGroup => ({
  id: c.courtId,
  label: c.courtName,
  gameId: c.game?.gameId,
  startedAt: c.game?.startedAt,
  timer: c.game ? formatElapsed(c.game.startedAt) : undefined,
  players: c.game ? c.game.players.map(toGamePlayer) : null,
});

export const toWaitingGroup = (w: GameBoardWaiting): WaitingGroup => ({
  id: w.gameId,
  gameId: w.gameId,
  label: `대기 ${w.waitingOrder}번`,
  players: w.players.map(toGamePlayer),
  memberIds: w.players.map(p => p.gameBoardMemberId),
});

export const toBoardViewModel = (board: GameBoardResponse) => ({
  courts: board.courts.map(toCourtGroup),
  waitingGroups: board.waitings.map(toWaitingGroup),
});

export const toGameMember = (m: GameBoardMember): GameMember => {
  const tags = !m.participating
    ? (["미참여"] as const)
    : ([...(m.inGame ? ["운동" as const] : []), ...(m.waiting ? ["대기" as const] : [])]);

  return {
    id: m.gameBoardMemberId,
    name: m.name,
    // gender: 명단 조회 API에 필드가 없어 매핑 불가 — 확정되면 채운다.
    ageGroup: m.ageGroup,
    group: m.level,
    playCount: m.gameCount,
    tags: [...tags],
    imgUrl: m.profileImageUrl,
    selectable: m.participating,
  };
};
