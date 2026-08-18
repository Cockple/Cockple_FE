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
