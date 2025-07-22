import { create } from "zustand";

export type FilterKey =
  | "region"
  | "level"
  | "style"
  | "day"
  | "time"
  | "keyword";

export interface GroupRecommendFilterState {
  region: string[]; // 지역 (2단계)
  level: string[]; // 전국 급수
  style: string; // 운동 스타일
  day: string[]; // 운동 요일
  time: string; // 활동 시간
  keyword: string[]; // 키워드

  setFilter: (key: FilterKey, value: string[] | string) => void;
  resetFilter: () => void;
}

export const useGroupRecommendFilterState = create<GroupRecommendFilterState>(
  set => ({
    region: [],
    level: [],
    style: "",
    day: [],
    time: "",
    keyword: [],
    setFilter: (key, value) =>
      set(state => ({
        ...state,
        [key]: value,
      })),
    resetFilter: () =>
      set(() => ({
        region: [],
        level: [],
        style: "",
        day: [],
        time: "",
        keyword: [],
      })),
  }),
);

export const isFilterDirty = (
  filter: Pick<GroupRecommendFilterState, FilterKey>,
): boolean => {
  return (
    filter.region.length > 0 ||
    filter.level.length > 0 ||
    filter.style !== "" ||
    filter.day.length > 0 ||
    filter.time !== "" ||
    filter.keyword.length > 0
  );
};
