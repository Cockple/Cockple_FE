// 마이페이지 데이터의 모양을 정의
export interface UserProfile {
  name: string;
  gender: "FEMALE" | "MALE";
  level: string;
  birth: string;
  profileImage?: string;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  myGroupCount: number;
  myExerciseCount: number;
  myMedalTotal: number;
}