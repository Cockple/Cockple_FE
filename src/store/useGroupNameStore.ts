import { create } from "zustand";

interface GroupNameStore {
  groupName: string;
  setGroupName: (name: string) => void;
  clearGroupName: () => void;
}

export const useGroupNameStore = create<GroupNameStore>(set => ({
  groupName: "",
  setGroupName: (name: string) => set({ groupName: name }),
  clearGroupName: () => set({ groupName: "" }),
}));
