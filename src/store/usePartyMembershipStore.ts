// src/store/usePartyMembershipStore.ts
import { create } from "zustand";

type MemberStatus = "MEMBER" | "NOT_MEMBER" | null;
type MemberRole = "party_MEMBER" | "party_MANAGER" | "party_SUBMANAGER" | null;

interface PartyMembershipState {
  memberStatus: MemberStatus;
  memberRole: MemberRole;
  hasPendingJoinRequest: boolean;

  setMemberStatus: (status: MemberStatus) => void;
  setMemberRole: (role: MemberRole) => void;
  setHasPendingJoinRequest: (pending: boolean) => void;

  setMembershipInfo: (info: {
    memberStatus: MemberStatus;
    memberRole: MemberRole;
    hasPendingJoinRequest: boolean;
  }) => void;
}

export const usePartyMembershipStore = create<PartyMembershipState>(set => ({
  memberStatus: null,
  memberRole: null,
  hasPendingJoinRequest: false,

  setMemberStatus: status => set({ memberStatus: status }),
  setMemberRole: role => set({ memberRole: role }),
  setHasPendingJoinRequest: pending => set({ hasPendingJoinRequest: pending }),

  setMembershipInfo: ({ memberStatus, memberRole, hasPendingJoinRequest }) =>
    set({ memberStatus, memberRole, hasPendingJoinRequest }),
}));
