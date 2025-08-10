import { create } from "zustand";

export type FilterKey = "region" | "level" | "style" | "time";

export interface ExerciseFilterState {
  region: string[];
  level: string[];
  style: string;
  time: string;
  recommend: boolean;
  setFilter: (key: FilterKey, value: string[] | string) => void;
  toggleRecommend: () => void;
  resetFilter: () => void;
}

export const useExerciseFilterStore = create<ExerciseFilterState>(set => ({
  region: [],
  level: [],
  style: "",
  time: "",
  recommend: true,
  setFilter: (key, value) => set(state => ({ ...state, [key]: value })),
  toggleRecommend: () => set(state => ({ recommend: !state.recommend })),
  resetFilter: () =>
    set(() => ({
      region: [],
      level: [],
      style: "",
      time: "",
    })),
}));

export const isFilterDirty = (filter: Pick<ExerciseFilterState, FilterKey>) => {
  return (
    filter.region.length > 0 ||
    filter.level.length > 0 ||
    filter.style !== "" ||
    filter.time !== ""
  );
};
