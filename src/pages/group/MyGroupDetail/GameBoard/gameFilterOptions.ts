// 게임판 명단 필터(급수/성별/셔틀콕) 옵션과 급수 다중선택 토글 로직.
import { LEVEL_KEY } from "@/constants/options";

// 모바일 필터(GameFilterPage): "전체" 칩 포함
export const LEVEL_OPTIONS = [...LEVEL_KEY, "급수없음"];
export const GENDER_OPTIONS = ["전체", "남성", "여성"];
export const SHUTTLE_OPTIONS = ["제출", "미제출"];

// PC 인라인 필터(GameFilterInline): 피그마 기준 "전체" 칩 없이 개별 옵션만 노출
export const LEVEL_OPTIONS_INLINE = LEVEL_OPTIONS.filter(o => o !== "전체");
export const GENDER_OPTIONS_INLINE = GENDER_OPTIONS.filter(o => o !== "전체");

// "전체" 선택 시 개별 급수 선택을 모두 해제, 개별 급수 선택 시 다중 토글
export const toggleLevelFilter = (
  levels: string[],
  option: string,
): string[] => {
  if (option === "전체") return [];
  return levels.includes(option)
    ? levels.filter(l => l !== option)
    : [...levels, option];
};
