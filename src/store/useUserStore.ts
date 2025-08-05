import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";

const UserStore = set => ({
  user: null,
  setUser: user => set({ user }),
  resetUser: () => set({ user: null }),
});

const useUserStore = create(
  persist(UserStore, {
    name: "user",
    storage: createJSONStorage(() => sessionStorage),
  }),
);

export default useUserStore;
