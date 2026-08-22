import {
  getMatchupInfo,
  getMatchupKey,
  type CourtGroup,
  type GameMember,
  type WaitingGroup,
} from "./mockGameBoardData";

// 급수별 기본 능력치 (남자 기준). 여자는 동일 급수에서 -1 적용.
const GRADE_SCORE: Record<string, number> = {
  자강: 10,
  준자강: 9,
  A조: 8,
  B조: 7,
  C조: 6,
  D조: 5,
  초심: 4,
  왕초심: 3,
};

// 남자에 한해서만 적용되는 나이대 보정치 (여자는 나이 반영 안 함)
const AGE_BONUS_MALE: Record<string, number> = {
  "20대": 0.6,
  "30대": 0.4,
  "40대": 0.2,
  "50대": 0,
};

const getSkillScore = (member: GameMember) => {
  const base = GRADE_SCORE[member.group] ?? 5;
  if (!member.gender) return base; // 성별 정보 없음 - 보정 없이 기본 점수만 사용
  if (member.gender === "FEMALE") return base - 1;
  return base + (AGE_BONUS_MALE[member.ageGroup] ?? 0.2);
};

const combinations = <T,>(arr: T[], k: number): T[][] => {
  const results: T[][] = [];
  const helper = (start: number, combo: T[]) => {
    if (combo.length === k) {
      results.push([...combo]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      helper(i + 1, combo);
      combo.pop();
    }
  };
  helper(0, []);
  return results;
};

// 4명을 2:2로 나눌 수 있는 3가지 조합 중, 팀간 능력치 합 차이가 가장 적은 값을 반환
const bestSplitSkillDiff = (four: GameMember[]) => {
  const [a, b, c, d] = four;
  const splits: [GameMember, GameMember][][] = [
    [
      [a, b],
      [c, d],
    ],
    [
      [a, c],
      [b, d],
    ],
    [
      [a, d],
      [b, c],
    ],
  ];
  let minDiff = Infinity;
  splits.forEach(([t1, t2]) => {
    const s1 = getSkillScore(t1[0]) + getSkillScore(t1[1]);
    const s2 = getSkillScore(t2[0]) + getSkillScore(t2[1]);
    minDiff = Math.min(minDiff, Math.abs(s1 - s2));
  });
  return minDiff;
};

// 4명 사이 6가지 조합 전체에 대해 과거 함께 경기한 누적 횟수 합산 (중복 페널티)
const repeatPenaltyForQuartet = (four: GameMember[]) => {
  const matchupInfo = getMatchupInfo(four.map(m => m.id));
  let penalty = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      const key = getMatchupKey(four[i].id, four[j].id);
      penalty += matchupInfo.get(key)?.count ?? 0;
    }
  }
  return penalty;
};

// 코트 타이머("MM:SS" 경과 표시)를 분 단위로 환산
const parseElapsedMinutes = (timer?: string) => {
  if (!timer) return 0;
  const [min, sec] = timer.split(":").map(Number);
  if (Number.isNaN(min) || Number.isNaN(sec)) return 0;
  return min + sec / 60;
};

// 대기/명단 인원 중 4명을 자동으로 뽑아 회원 id 배열을 반환. 매칭 가능한 인원이 없으면 null.
export const autoMatchMembers = (
  members: GameMember[],
  courts: CourtGroup[],
  waitingGroups: WaitingGroup[],
): number[] | null => {
  const queuedIds = new Set(waitingGroups.flatMap(g => g.memberIds));
  const playingCourtOf = new Map<number, CourtGroup>();
  courts.forEach(court => {
    court.players?.forEach(p => playingCourtOf.set(p.id, court));
  });

  const availableMembers = members.filter(m => {
    if (!m.selectable) return false;
    if (queuedIds.has(m.id)) return false;
    const court = playingCourtOf.get(m.id);
    if (court) return parseElapsedMinutes(court.timer) >= 10; // 운동중이어도 10분 넘었으면 다음 매치 후보로 포함
    return true; // 코트/대기열 어디에도 없으면 포함
  });

  if (availableMembers.length < 4) return null;

  // 0단계: 혼복/남복/여복 중 어떤 타입으로 매치를 만들지 랜덤 결정 (인원이 부족한 타입은 후보에서 제외)
  const menPool = availableMembers.filter(m => m.gender === "MALE");
  const womenPool = availableMembers.filter(m => m.gender === "FEMALE");
  const typeOptions: ("혼복" | "남복" | "여복")[] = ["혼복"];
  if (menPool.length >= 4) typeOptions.push("남복");
  if (womenPool.length >= 4) typeOptions.push("여복");
  const matchType = typeOptions[Math.floor(Math.random() * typeOptions.length)];
  const genderPool =
    matchType === "남복"
      ? menPool
      : matchType === "여복"
        ? womenPool
        : availableMembers;

  const sortedPool = [...genderPool].sort((a, b) => a.playCount - b.playCount);
  const minGames = sortedPool[0].playCount;

  // 1단계: 운동 횟수가 적은 사람 위주로 후보군 구성 (4명이 안 모이면 다음 순번까지 단계적으로 확장)
  let tier = 0;
  let candidatePool: GameMember[] = [];
  while (candidatePool.length < 4 && tier <= 5) {
    candidatePool = sortedPool.filter(m => m.playCount <= minGames + tier);
    tier++;
  }
  candidatePool = candidatePool.slice(0, 12); // 성능을 위해 최대 12명까지만 후보로 사용

  // 2단계: 후보군 내 모든 4인 조합에 대해 급수 밸런스 + 중복 이력 + 게임수 공정성 점수 계산
  let best: GameMember[] | null = null;
  let bestScore = Infinity;
  combinations(candidatePool, 4).forEach(four => {
    const skillDiff = bestSplitSkillDiff(four);
    const repeatPenalty = repeatPenaltyForQuartet(four);
    const gamesSum = four.reduce((sum, m) => sum + m.playCount, 0);
    const score = skillDiff * 100 + repeatPenalty * 15 + gamesSum;
    if (score < bestScore) {
      bestScore = score;
      best = four;
    }
  });

  return best ? (best as GameMember[]).map(m => m.id) : null;
};
