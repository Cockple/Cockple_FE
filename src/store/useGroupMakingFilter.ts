import { create } from "zustand";

export type FilterKey =
  | "region"
  | "femaleLevel"
  | "maleLevel"
  | "name"
  | "type"
  | "kock"
  | "weekly"
  | "joinMoney"
  | "money"
  | "time"
  | "ageRange"
  | "content"
  | "imgKey"
  | "imgUrl";

export interface ExerciseFilterState {
  region: string[];
  time: string;
  femaleLevel: string[];
  maleLevel: string[];
  name: string;
  level: string;
  weekly: string[];
  kock: string;
  joinMoney: string;
  money: string;
  ageRange: number[];
  type: "mixed" | "female" | "";
  content?: string;
  imgKey?: string;
  imgUrl?: string;
  setFilter: (key: FilterKey, value: string[] | string | number[]) => void;
  resetFilter: () => void;
}

export const useGroupMakingFilterStore = create<ExerciseFilterState>(set => ({
  region: [],
  femaleLevel: [],
  maleLevel: [],
  weekly: [],
  level: "",
  type: "",
  kock: "",
  joinMoney: "",
  money: "",
  time: "",
  ageRange: [],
  name: "",
  content: "",
  imgKey: "",
  imgUrl: "",
  setFilter: (key, value) => set(state => ({ ...state, [key]: value })),
  resetFilter: () =>
    set(() => ({
      region: [],
      femaleLevel: [],
      maleLevel: [],
      weekly: [],
      level: "",
      type: "",
      kock: "",
      joinMoney: "",
      money: "",
      time: "",
      ageRange: [],
      name: "",
      content: "",
      imgKey: "",
      imgUrl: "",
    })),
}));

// export const isFilterDirty = (filter: Pick<ExerciseFilterState, FilterKey>) => {
//   return (
//     filter.region.length > 0 ||
//     filter.femaleLevel.length > 0 ||
//     filter.maleLevel.length > 0 ||
//     filter.kock.length > 0 ||
//     filter.name.length > 0 ||
//   );
// }
