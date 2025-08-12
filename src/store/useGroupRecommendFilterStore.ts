import { create } from "zustand";

export type FilterKey =
  | "region"
  | "level"
  | "style"
  | "day"
  | "time"
  | "keyword"
  | "recommend";

export interface GroupRecommendFilterState {
  region: string[];
  level: string[];
  style: string;
  day: string[];
  time: string;
  keyword: string[];
  recommend: boolean;
  toggleRecommend: () => void;
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
    recommend: true,
    setFilter: (key, value) =>
      set(state => ({
        ...state,
        [key]: value,
      })),
    toggleRecommend: () => set(state => ({ recommend: !state.recommend })),
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
