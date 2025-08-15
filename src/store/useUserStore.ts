import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import type { StateCreator } from "zustand";

interface UserData {
  memberId: number;
  nickname: string;
  accessToken: string;
  refreshToken: string | null;
  isNewMember: boolean;
}

interface UserStoreType {
  user: UserData | null;
  setUser: (user: UserData) => void;
  resetUser: () => void;
}

const UserStore: StateCreator<UserStoreType> = set => ({
  user: null,
  setUser: user => set({ user }),
  resetUser: () => set({ user: null }),
});

const useUserStore = create<UserStoreType>()(
  persist(UserStore, {
    name: "user",
    storage: createJSONStorage(() => localStorage),
  }),
);

export default useUserStore;
