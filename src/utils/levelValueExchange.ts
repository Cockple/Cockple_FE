export const userLevelMapper = () => {
  const apiLevelMap: Record<string, string> = {
    왕초심: "NOVICE",
    초심: "BEGINNER",
    D조: "D",
    C조: "C",
    B조: "B",
    A조: "A",
    준자강: "SEMI_EXPERT",
    자강: "EXPERT",
    disabled: "NONE",
  };

  const uiLevelMap = Object.fromEntries(
    Object.entries(apiLevelMap).map(([kor, eng]) => [eng, kor]),
  );

  const toEng = (korLevel: string) => apiLevelMap[korLevel] ?? "NONE";
  const toKor = (engLevel: string) => uiLevelMap[engLevel] ?? "급수 없음";

  return { toEng, toKor };
};
