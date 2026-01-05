// 급수 변환 함수 - 마이페이지에서 사용
export const convertLevel = (level: string): string => {
  const levelMap: Record<string, string> = {
    EXPERT: "자강",
    SEMI_EXPERT: "준자강",
    A: "A조",
    B: "B조",
    C: "C조",
    D: "D조",
    BEGINNER: "초심",
    NOVICE: "왕초심",
    NONE: "급수 없음",
  };
  if (!level) return "급수 없음";
  return levelMap[level.toUpperCase()] ?? "급수 없음";
};