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
  isCompleted: boolean;
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

  // exercises 배열로 변경
  const rawList = response.data?.data?.exercises ?? [];

  // const mappedList: ExerciseItem[] = rawList.map((item: any) => ({
  //   exerciseId: item.exerciseId ?? item.partyId, // id 필드 확인
  //   access: item.access ?? { ispartyMember: false, allowGuestInvitation: false },
  //   partyName: item.partyName ?? item.title,
  //   date: item.date,
  //   buildingName: item.buildingName ?? item.location,
  //   startTime: item.startTime,
  //   endTime: item.endTime,
  //   levelRequirement: item.levelRequirement,
  //   participation: item.participation,
  //   isBookmarked: item.isBookmarked,
  // }));
const mappedList: ExerciseItem[] = rawList.map((item: any) => ({
  exerciseId: item.exerciseId,
  access: {
    ispartyMember: item.access?.ispartyMember ?? false,
    allowGuestInvitation: item.access?.allowGuestInvitation ?? false,
    allowOutsideGuest: item.access?.allowOutsideGuest ?? false,
  },
  partyName: item.partyName,
  date: item.date,
  dayOfTheWeek: item.dayOfTheWeek, // 서버에서 준 경우 그대로 사용
  buildingName: item.buildingName,
  startTime: item.startTime,
  endTime: item.endTime,
  participation: {
    current: item.participation?.current ?? 0,
    max: item.participation?.max ?? 0,
  },
  levelRequirement: {
    female: item.levelRequirement?.female ?? "-",
    male: item.levelRequirement?.male ?? "-",
  },
  isBookmarked: item.isBookmarked ?? false,
  isCompleted: item.isCompleted ?? false, // 서버에서 주면 넣기
}));

  console.log("내 운동 조회", mappedList);
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