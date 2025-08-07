//나중에 삭제-------------------->
export type CommonResponse<T> = {
  code: string;
  message: string;
  data: T;
  errorReason: ErrorReasonDTO;
  success: boolean;
};

export type ErrorReasonDTO = {
  code: string;
  message: string;
  httpStatus: string;
};
//------------------------------->

export type GroupCard = {
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
};

export type ExerciseCard = {
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
};

export type GroupCardResponse = CommonResponse<GroupCard[]>;
export type ExerciseCardResponse = CommonResponse<ExerciseCard[]>;
