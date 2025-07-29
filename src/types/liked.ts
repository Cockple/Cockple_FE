export interface GroupCard {
  partyId: number;
  partyName: string;
  addr1: string;
  addr2: string;
  femaleLevel: string;
  maleLevel: string;
  latestExerciseDate: string;
  latestExerciseTime: string;
  exerciseCnt: number;
  profileImgUrl: string;
  isFavorite: boolean;
}

export interface ExerciseCard {
  exerciseId: number;
  partyName: string;
  buildingAddr: string;
  streetAddr: string;
  date: string;
  startExerciseTime: string;
  endExerciseTime: string;
  femaleLevel: string;
  maleLevel: string;
  nowMemberCnt: number;
  maxMemberCnt: number;
  includeParty: boolean;
  includeExercise: boolean;
  isFavorite: boolean;
}
