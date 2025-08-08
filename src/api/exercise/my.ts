//GET/api/exercises/my 내 참여 운동 조회
import api from "../api";

export type FilterType = "ALL" | "UPCOMING" | "COMPLETED";
export type OrderType = "LATEST" | "OLDEST";

export interface ExerciseItem {
  exerciseId: number;
  access: {
    ispartyMember: boolean;
    allowGuestInvitation: boolean;
  };
  partyName: string;
  date: string;
  buildingName: string;
  startTime: string;
  endTime: string;
  levelRequirement: {
    female: string;
    male: string;
  };
  participation: {
    current: number;
    max: number;
  };
  isBookmarked: boolean;
}

export interface MyExerciseItem {
  partyId: number;
  date: string;
  title: string;
  location: string;
  image: string;
  isCompleted: boolean;

  // 아래는 ContentCardL에서 요구하는 필드
  access?: {
    ispartyMember: boolean;
    allowGuestInvitation: boolean;
  };
  levelRequirement?: {
    female: string;
    male: string;
  };
  participation?: {
    current: number;
    max: number;
  };
  isBookmarked?: boolean;

}

//내 참여 운동 조회(필터)
export const getMyExercises = async ({
  filterType = "ALL",
  orderType = "LATEST",
  page = 0,
  size = 10,
}: {
  filterType?: FilterType;
  orderType?: OrderType;
  page?: number;
  size?: number;
}): Promise<ExerciseItem[]> => {
  const response = await api.get("/api/exercises/my", {
    params: {
      filterType,
      orderType,
      "pageable.page": page,
      "pageable.size": size,
    },
  });
  console.log(response);
  const rawList = response.data?.data?.content ?? [];

  const mappedList: ExerciseItem[] = rawList.map((item: any) => ({
    exerciseId: item.partyId, // 이 부분을 맞게 변경해야 함
    access: item.access,
    partyName: item.title,
    date: item.date,
    buildingName: item.location,
    startTime: item.startTime,
    endTime: item.endTime,
    levelRequirement: item.levelRequirement,
    participation: item.participation,
    isBookmarked: item.isBookmarked,
  }));

  return mappedList;
};

// export const getMyExercises = async ({
//   filterType = "ALL",
//   orderType = "LATEST",
//   page = 0,
//   size = 10,
// }: {
//   filterType?: FilterType;
//   orderType?: OrderType;
//   page?: number;
//   size?: number;
// }): Promise<MyExerciseItem[]> => {
//   const response = await api.get("/api/exercises/my", {
//     params: {
//       filterType,
//       orderType,
//       "pageable.page": page,
//       "pageable.size": size,
//     },
//   });
//   console.log("응답 결과:", response.data);
//   return response.data?.data?.content ?? [];
// };