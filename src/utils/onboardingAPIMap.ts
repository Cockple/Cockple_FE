export const apiLevelMap: Record<string, string> = {
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

export const getApiLevel = (korLevel: string): string =>
  apiLevelMap[korLevel] ?? "NONE";
