import { create } from "zustand";
import type { ExerciseItem } from "../api/exercise/my";

interface MyExerciseState {
  exerciseList: ExerciseItem[];
  setExerciseList: (list: ExerciseItem[] | ((prev: ExerciseItem[]) => ExerciseItem[])) => void;
  addExercise: (exercise: ExerciseItem) => void;
}

export const useMyExerciseStore = create<MyExerciseState>((set) => ({
  exerciseList: [],
  setExerciseList: (list) =>
    set(state => ({
      exerciseList: typeof list === "function" ? list(state.exerciseList) : list
    })),
  addExercise: (exercise) =>
    set(state => ({ exerciseList: [exercise, ...state.exerciseList] })),
}));

//배포 후 반드시 확인
