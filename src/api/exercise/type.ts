export interface Exercise {
  exerciseId: number;
  partyId: number;
  partyName: string;
  date: string; // "YYYY-MM-DD"
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  startTime: string; // "HH:mm:ss"
  endTime: string; // "HH:mm:ss"
  buildingName: string;
  profileImageUrl: string;
  isBookmarked: boolean;
}

export interface RecommendedExerciseData {
  totalExercises: number;
  exercises: Exercise[];
}
