type LevelEng =
  | "EXPERT"
  | "SEMI_EXPERT"
  | "A"
  | "B"
  | "C"
  | "D"
  | "BEGINNER"
  | "NOVICE"
  | "NONE";
type StyleEng = "SINGLE" | "WOMEN_DOUBLES" | "MEN_DOUBLES" | "MIX_DOUBLES";
type TimeEng = "MORNING" | "AFTERNOON" | "ALWAYS";

// 한글 -> 영어 변환을 위한 맵(Map) 객체
const levelMap: Record<string, LevelEng> = {
  왕초심: "NOVICE",
  초심: "BEGINNER",
  D조: "D",
  C조: "C",
  B조: "B",
  A조: "A",
  준자강: "SEMI_EXPERT",
  자강: "EXPERT",
};

const styleMap: Record<string, StyleEng> = {
  여복: "WOMEN_DOUBLES",
  남복: "MEN_DOUBLES",
  혼복: "MIX_DOUBLES",
};

const timeMap: Record<string, TimeEng> = {
  오전: "MORNING",
  오후: "AFTERNOON",
  상시: "ALWAYS",
};

/**
 * Zustand 스토어의 필터 상태를 API가 요구하는 영어 파라미터로 변환하는 함수
 */
export const transformFiltersForApi = (filters: {
  region: string[];
  level: string[];
  style: string;
  time: string;
}) => {
  // '전체' 옵션은 API에 보내지 않으므로 필터링
  const levels = filters.level.filter(l => l !== "전체").map(l => levelMap[l]);

  // 단일 선택 값 변환 ('전체'는 빈 값으로 처리)
  const participationTypes =
    filters.style && filters.style !== "전체" ? [styleMap[filters.style]] : [];
  const activityTimes =
    filters.time && filters.time !== "전체" ? [timeMap[filters.time]] : [];

  // 지역(region) 처리
  const addr1 = filters.region[0] || "";
  const addr2 =
    filters.region[1] && filters.region[1] !== "전체" ? filters.region[1] : "";

  return {
    levels,
    participationTypes,
    activityTimes,
    addr1,
    addr2,
  };
};
