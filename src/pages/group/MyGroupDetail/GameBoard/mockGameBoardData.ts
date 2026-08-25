export interface GamePlayer {
  id: number;
  name: string;
  group: string;
  color: "pink" | "blue";
}

export interface CourtGroup {
  id: number; // courtId
  label: string;
  gameId?: number; // 진행중인 게임 id (완료/대기이동 액션에 필요)
  timer?: string; // startedAt으로부터 계산된 표시용 "MM:SS"
  startedAt?: string; // 스톱워치 기준 시각
  players: GamePlayer[] | null; // null → 빈 코트
}

export interface WaitingGroup {
  id: number;
  gameId: number; // 대기중인 게임 id (삭제/시작 액션에 필요)
  label: string;
  players: GamePlayer[];
  memberIds: number[];
}

export type MemberTag = "운동" | "대기" | "미참";

export interface GameMember {
  id: number;
  name: string;
  gender: "MALE" | "FEMALE";
  ageGroup: string;
  group: string;
  playCount: number;
  tags: MemberTag[];
  imgUrl?: string | null;
  selectable: boolean;
}

// 직전 경기: 가장 최근에 함께 뛴 조합 / 첫 경기: 한 번도 함께 뛴 적 없는 조합 / 이전 경기: 그 외 함께 뛴 적 있는 조합
export type MatchupType = "recent" | "first" | "previous";

export interface MatchupInfo {
  count: number;
  type: MatchupType;
}

export const getMatchupKey = (memberIdA: number, memberIdB: number) =>
  memberIdA < memberIdB
    ? `${memberIdA}-${memberIdB}`
    : `${memberIdB}-${memberIdA}`;
