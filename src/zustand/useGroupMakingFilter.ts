import { create } from "zustand";

export type FilterKey =
  | "region"
  | "FemaleLevel"
  | "maleLevel"
  | "name"
  | "type"
  | "kock"
  | "weekly"
  | "joinMoney"
  | "money"
  | "time"
  | "ageRange";

export interface ExerciseFilterState {
  region: string[];
  time: string[];
  FemaleLevel: string[];
  maleLevel: string[];
  name: string;
  level: string;
  weekly: string[];
  kock: string;
  joinMoney: string;
  money: string;
  ageRange: number[];
  type: "mixed" | "female" | "";
  setFilter: (key: FilterKey, value: string[] | string | number[]) => void;
  resetFilter: () => void;
}

export const useGroupMakingFilterStore = create<ExerciseFilterState>(set => ({
  region: [],
  FemaleLevel: [],
  maleLevel: [],
  weekly: [],
  level: "",
  type: "",
  kock: "",
  joinMoney: "",
  money: "",
  time: [],
  ageRange: [],
  name: "",
  setFilter: (key, value) => set(state => ({ ...state, [key]: value })),
  resetFilter: () =>
    set(() => ({
      region: [],
      level: "",
      time: [],
      name: "",
    })),
}));

// export const isFilterDirty = (filter: Pick<ExerciseFilterState, FilterKey>) => {
//   return (
//     filter.region.length > 0 ||
//     filter.FemaleLevel.length > 0 ||
//     filter.maleLevel.length > 0 ||
//     filter.kock.length > 0 ||
//     filter.name.length > 0 ||
//   );
// }
