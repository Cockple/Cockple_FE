// 게임판 REST/WS 응답(GameBoardDTO 등)을 화면에서 쓰는 view model(CourtGroup/WaitingGroup/GameMember)로 변환한다.
import type {
  GameBoardCourt,
  GameBoardPlayer,
  GameBoardResponse,
  GameBoardWaiting,
} from "@/api/game/board";
import type {
  GameBoardMember,
  GameBoardMemberPayload,
  GetGameBoardMembersParams,
} from "@/api/game/members";
import type {
  CourtGroup,
  GameMember,
  GamePlayer,
  WaitingGroup,
} from "./mockGameBoardData";

// 서버가 타임존 표시 없이 UTC 시각을 내려줄 때, Date가 이를 로컬 시간으로 오인해
// 9시간(한국 UTC+9)만큼 어긋나는 것을 막기 위해 명시적으로 UTC로 해석한다.
const parseServerDate = (value: string) =>
  new Date(/[Zz]|[+-]\d{2}:\d{2}$/.test(value) ? value : `${value}Z`);

export const formatElapsed = (startedAt: string) => {
  const ms = Date.now() - parseServerDate(startedAt).getTime();
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

const GENDER_KO_TO_EN: Record<string, "MALE" | "FEMALE"> = {
  남성: "MALE",
  여성: "FEMALE",
};

const GENDER_EN_TO_KO: Record<"MALE" | "FEMALE", "남성" | "여성"> = {
  MALE: "남성",
  FEMALE: "여성",
};

// 명단 추가/수정 payload: 서버는 gender를 한글("남성"/"여성")로만 받는다.
export const toGameBoardMemberPayload = (player: {
  name: string;
  gender: "MALE" | "FEMALE";
  level: string;
  ageGroup?: string;
}): GameBoardMemberPayload => ({
  name: player.name,
  gender: GENDER_EN_TO_KO[player.gender],
  level: player.level,
  ageGroup: player.ageGroup || undefined,
});

// 노출 조건 (판정 우선순위): 경기중 > 대기열 포함 > 운동 불참 > 뱃지 없음. 한 번에 하나만 노출한다.
export const toGameMember = (m: GameBoardMember): GameMember => {
  const tags: GameMember["tags"] = m.inGame
    ? ["운동"]
    : m.waiting
      ? ["대기"]
      : !m.participating
        ? ["미참"]
        : [];

  return {
    id: m.gameBoardMemberId,
    name: m.name,
    gender: GENDER_KO_TO_EN[m.gender],
    ageGroup: m.ageGroup,
    group: m.level,
    playCount: m.gameCount,
    tags: [...tags],
    imgUrl: m.profileImageUrl,
    selectable: m.participating,
  };
};

export interface GameBoardMemberFilters {
  levels: string[]; // 한글 급수 라벨, 다중 선택
  gender: string | null; // "전체" | "남성" | "여성"
  shuttle: string | null; // "제출함" | "미제출" | null
}

// level/gender는 한글 표시값을 그대로 API 쿼리에 전달한다 (명단조회 API 스펙).
export const toGameBoardMembersParams = (
  filters: GameBoardMemberFilters,
): GetGameBoardMembersParams => ({
  level: filters.levels.length ? filters.levels : undefined,
  gender:
    filters.gender === "남성" || filters.gender === "여성"
      ? filters.gender
      : undefined,
  shuttlecockSubmitted:
    filters.shuttle === "제출함"
      ? true
      : filters.shuttle === "미제출"
        ? false
        : undefined,
});
