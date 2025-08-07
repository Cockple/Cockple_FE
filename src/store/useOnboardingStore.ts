import { create } from "zustand";

interface OnboardingState {
  memberName: string;
  gender: "boy" | "girl" | null;
  birth: string;
  level: string;
  imgKey: string;
  keyWord: string[];
  setTemp: (field: Partial<OnboardingState>) => void;
  reset: () => void;
}

export const useOnboardingState = create<OnboardingState>(set => ({
  memberName: "",
  gender: null,
  birth: "",
  level: "",
  imgKey: "",
  keyWord: [],

  setTemp: field => set(state => ({ ...state, ...field })),
  reset: () =>
    set({
      memberName: "",
      gender: null,
      birth: "",
      level: "",
      imgKey: "",
      keyWord: [],
    }),
}));
