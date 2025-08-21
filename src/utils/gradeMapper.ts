// 영어급수 -> 한글 급수
export const serverToLabelMap: Record<string, string> = {
  NOVICE: "왕초심",
  BEGINNER: "초심",
  D: "D조",
  C: "C조",
  B: "B조",
  A: "A조",
  SEMI_EXPERT: "준자강",
  EXPERT: "자강",
  NONE: "급수 없음",
};

// 배열(혹은 단일 값)을 한글 라벨 배열로 변환
export const mapLevels = (levels?: string[] | null): string[] => {
  if (!levels || levels.length === 0) return [];
  // 매핑 + 원본 보존(매핑 실패 시) + 중복 제거 + 순서 유지
  const seen = new Set<string>();
  const result: string[] = [];
  for (const lv of levels) {
    const label = serverToLabelMap[lv] ?? lv; // 매핑 없으면 원값 그대로
    if (!seen.has(label)) {
      seen.add(label);
      result.push(label);
    }
  }
  return result;
};
