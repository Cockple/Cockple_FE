import { create } from "zustand";

interface OnboardingState {
  memberName: string;
  gender: "male" | "female" | null;
  birth: string;
  level: string;
  imgKey: string;
  keyword: string[];
  setTemp: (field: Partial<OnboardingState>) => void;
  reset: () => void;
}

export const useOnboardingState = create<OnboardingState>(set => ({
  memberName: "",
  gender: null,
  birth: "",
  level: "",
  imgKey: "",
  keyword: [],

  setTemp: field => set(state => ({ ...state, ...field })),
  reset: () =>
    set({
      memberName: "",
      gender: null,
      birth: "",
      level: "",
      imgKey: "",
      keyword: [],
    }),
}));
