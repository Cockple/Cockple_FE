// src/store/createExerciseStore.ts
import { create } from "zustand";
import type { AddLocationPayload } from "../api/member/my"; // 경로는 실제 프로젝트에 맞게 수정해주세요

// 스토어에 저장할 상태와 함수들의 타입을 정의합니다.
interface CreateExerciseState {
  selectedDate: string | number | null;
  startTime: string;
  endTime: string;
  headCount: string;
  allowGuestInvite: boolean;
  allowExternalGuest: boolean;
  notice: string;
  locationDetail: AddLocationPayload | null;

  setSelectedDate: (date: string | number | null) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  setHeadCount: (count: string) => void;
  setNotice: (notice: string) => void;
  setLocationDetail: (location: AddLocationPayload | null) => void;
  setAllowGuestInvite: (allow: boolean) => void;
  setAllowExternalGuest: (allow: boolean) => void;
  resetForm: () => void;
}

// 상태의 초기값을 정의합니다.
const initialState = {
  selectedDate: null,
  startTime: "",
  endTime: "",
  headCount: "",
  allowGuestInvite: true,
  allowExternalGuest: true,
  notice: "",
  locationDetail: null,
};

// Zustand 스토어를 생성합니다.
const useCreateExerciseStore = create<CreateExerciseState>(set => ({
  ...initialState,

  // 상태를 변경하는 함수(Action)들을 구현합니다.
  setSelectedDate: date => set({ selectedDate: date }),
  setStartTime: time => set({ startTime: time }),
  setEndTime: time => set({ endTime: time }),
  setHeadCount: count => set({ headCount: count }),
  setNotice: notice => set({ notice: notice }),
  setLocationDetail: location => set({ locationDetail: location }),
  setAllowGuestInvite: allow => set({ allowGuestInvite: allow }),
  setAllowExternalGuest: allow => set({ allowExternalGuest: allow }),

  // 폼 전체를 초기화하는 함수
  resetForm: () => set(initialState),
}));

export default useCreateExerciseStore;
