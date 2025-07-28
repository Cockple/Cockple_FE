import { create } from "zustand";

export type FilterKey =
  | "region"
  | "FemaleLevel"
  | "maleLevel"
  | "style"
  | "time"
  | "weekly";

export interface ExerciseFilterState {
  region: string[];
  FemaleLevel: string[];
  maleLevel: string[];
  style: string;
  time: string;
  weekly: string[];
  setFilter: (key: FilterKey, value: string[] | string) => void;
  resetFilter: () => void;
}

export const useGroupMakingFilterStore = create<ExerciseFilterState>(set => ({
  region: [],
  FemaleLevel: [],
  maleLevel: [],
  weekly: [],
  style: "",
  time: "",
  setFilter: (key, value) => set(state => ({ ...state, [key]: value })),
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
    filter.FemaleLevel.length > 0 ||
    filter.maleLevel.length > 0 ||
    filter.weekly.length > 0 ||
    filter.style !== "" ||
    filter.time !== ""
  );
};
