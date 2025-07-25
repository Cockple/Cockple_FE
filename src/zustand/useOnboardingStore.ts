import { create } from "zustand";

interface OnboardingState {
  name: string;
  gender: "boy" | "girl" | null;
  birthday: string;
  level: string;
  setTemp: (field: Partial<OnboardingState>) => void;
  reset: () => void;
}

export const useOnboardingState = create<OnboardingState>(set => ({
  name: "",
  gender: null,
  birthday: "",
  level: "",
  setTemp: field => set(state => ({ ...state, ...field })),
  reset: () => set({ name: "", gender: null, birthday: "", level: "" }),
}));
