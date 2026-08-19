export interface GamePlayer {
  id: number;
  name: string;
  group: string;
  color: "pink" | "blue";
}

export interface CourtGroup {
  id: number;
  label: string;
  timer?: string;
  players: GamePlayer[] | null; // null → 빈 코트
}

export interface WaitingGroup {
  id: number;
  label: string;
  players: GamePlayer[];
  memberIds: number[];
}

export type MemberTag = "운동" | "대기" | "미참여";

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

const player = (
  id: number,
  name: string,
  group: string,
  color: "pink" | "blue",
): GamePlayer => ({ id, name, group, color });

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

export const mockCourts: CourtGroup[] = [
  {
    id: 1,
    label: "01 코트",
    timer: "00:05",
    players: [
      player(1, "김셰익", "A", "pink"),
      player(2, "김셰익", "B", "pink"),
      player(3, "김셰익", "C", "blue"),
      player(4, "김셰익", "준자강", "blue"),
    ],
  },
  { id: 2, label: "02 코트", players: null },
  {
    id: 3,
    label: "03 코트",
    timer: "00:05",
    players: [
      player(5, "김셰익", "A", "pink"),
      player(6, "김셰익", "B", "pink"),
      player(7, "김셰익", "C", "blue"),
      player(8, "김셰익", "준자강", "blue"),
    ],
  },
  {
    id: 4,
    label: "04 코트",
    timer: "00:05",
    players: [
      player(9, "김셰익", "A", "pink"),
      player(10, "김셰익", "B", "pink"),
      player(11, "김셰익", "C", "blue"),
      player(12, "김셰익", "준자강", "blue"),
    ],
  },
];

export const mockWaitingGroups: WaitingGroup[] = [
  {
    id: 1,
    label: "대기 1번",
    memberIds: [1, 2, 3, 4],
    players: [
      player(13, "김셰익", "A", "pink"),
      player(14, "김셰익", "B", "pink"),
      player(15, "김셰익", "C", "blue"),
      player(16, "김셰익", "준자강", "blue"),
    ],
  },
  {
    id: 2,
    label: "대기 2번",
    memberIds: [2, 3, 4, 5],
    players: [
      player(17, "김셰익", "A", "pink"),
      player(18, "김셰익", "B", "pink"),
      player(19, "김셰익", "C", "blue"),
      player(20, "김셰익", "준자강", "blue"),
    ],
  },
];

export const mockGameMembers: GameMember[] = [
  {
    id: 1,
    name: "김셰익",
    gender: "FEMALE",
    ageGroup: "30대",
    group: "D조",
    playCount: 0,
    tags: ["운동"],
    selectable: true,
  },
  {
    id: 2,
    name: "김셰익",
    gender: "FEMALE",
    ageGroup: "30대",
    group: "D조",
    playCount: 0,
    tags: ["대기"],
    selectable: true,
  },
  {
    id: 3,
    name: "김셰익",
    gender: "FEMALE",
    ageGroup: "30대",
    group: "D조",
    playCount: 0,
    tags: ["운동", "대기"],
    selectable: true,
  },
  {
    id: 4,
    name: "김셰익",
    gender: "FEMALE",
    ageGroup: "30대",
    group: "D조",
    playCount: 0,
    tags: ["운동"],
    selectable: true,
  },
  {
    id: 5,
    name: "김셰익",
    gender: "FEMALE",
    ageGroup: "30대",
    group: "D조",
    playCount: 0,
    tags: ["운동", "대기"],
    selectable: true,
  },
  {
    id: 6,
    name: "김셰익",
    gender: "FEMALE",
    ageGroup: "30대",
    group: "D조",
    playCount: 0,
    tags: ["미참여"],
    selectable: false,
  },
];
