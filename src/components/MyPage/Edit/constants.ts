// 마이페이지 수정 화면에 필요한 상수 및 유틸 분리
export const LEVEL_OPTIONS = ["왕초심", "초심", "D조", "C조", "B조", "A조", "준자강", "자강"];

export const KEYWORD_LINES = [
  ["브랜드 스폰", "가입비 무료"],
  ["친목", "운영진이 게임을 짜드려요"],
];

export const SERVER_TO_LABEL_MAP: Record<string, string> = {
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

export const SERVER_TO_LABEL_KEYWORD_MAP: Record<string, string> = {
  BRAND: "브랜드 스폰",
  FREE: "가입비 무료",
  FRIENDSHIP: "친목",
  MANAGER_MATCH: "운영진이 게임을 짜드려요",
  NONE: "NONE",
};

// 역방향 매핑 유틸
export const LABEL_TO_SERVER_MAP = Object.fromEntries(
  Object.entries(SERVER_TO_LABEL_MAP).map(([k, v]) => [v, k])
);

export const KEYWORD_MAP_REVERSE: Record<string, string> = {
  "브랜드 스폰": "BRAND",
  "가입비 무료": "FREE",
  친목: "FRIENDSHIP",
  "운영진이 게임을 짜드려요": "MANAGER_MATCH",
  NONE: "NONE",
};