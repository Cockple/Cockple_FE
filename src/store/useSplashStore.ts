import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface SplashState {
  isSplashShown: boolean;
  hasShownSplash: boolean;
  showSplash: () => void;
}
const SplashStore: import("zustand").StateCreator<SplashState> = set => ({
  isSplashShown: false,
  hasShownSplash: false,

  showSplash: () => {
    set({ isSplashShown: true, hasShownSplash: true });
    setTimeout(() => {
      set({ isSplashShown: false });
    }, 2000);
  },
});

const useSplashStore = create(
  persist(SplashStore, {
    name: "isShown",
    storage: createJSONStorage(() => localStorage),
  }),
);

export default useSplashStore;
