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

export type MemberTag = "운동" | "대기" | "미참여";

export interface GameMember {
  id: number;
  name: string;
  gender?: "MALE" | "FEMALE"; // 명단 조회 API 미제공 필드 — 확정되면 필수로 변경
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

// 실제 매치 이력 API가 아직 없어 두 회원 id로 결정적인 가짜 대결 횟수(0~3)를 만든다.
const mockMatchCount = (memberIdA: number, memberIdB: number) => {
  const [lo, hi] =
    memberIdA < memberIdB ? [memberIdA, memberIdB] : [memberIdB, memberIdA];
  return (lo * 31 + hi * 17) % 4;
};

export const getMatchupInfo = (
  memberIds: number[],
): Map<string, MatchupInfo> => {
  const counts = new Map<string, number>();
  let mostRecentKey: string | null = null;
  let maxCount = 0;

  for (let i = 0; i < memberIds.length; i++) {
    for (let j = i + 1; j < memberIds.length; j++) {
      const key = getMatchupKey(memberIds[i], memberIds[j]);
      const count = mockMatchCount(memberIds[i], memberIds[j]);
      counts.set(key, count);
      if (count > maxCount) {
        maxCount = count;
        mostRecentKey = key;
      }
    }
  }

  const result = new Map<string, MatchupInfo>();
  counts.forEach((count, key) => {
    const type: MatchupType =
      count === 0 ? "first" : key === mostRecentKey ? "recent" : "previous";
    result.set(key, { count, type });
  });
  return result;
};
