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
    female: string[]; 
    male: string[];  
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

export const getMyExercises = async ({
  filterType = "ALL",
  orderType = "LATEST",
  page = 0,
  size = 10,
}) => {
  const response = await api.get("/api/exercises/my", {
    params: {
      filterType,
      orderType, 
      "pageable.page": page,
      "pageable.size": size,
    },
  });
  console.log("서버 응답 전체:", response.data); // ✅ 여기서 확인

  const rawList = response.data?.data?.exercises ?? [];

  return rawList.map((item: any) => ({
    exerciseId: item.exerciseId,
    access: {
      ispartyMember: true,
      allowGuestInvitation: item.partyGuestInviteAccept ?? false,
      allowOutsideGuest: false,
    },
    partyName: item.partyName,
    date: item.date,
    dayOfTheWeek: item.dayOfWeek,
    buildingName: item.buildingName,
    startTime: item.startTime?.slice(0, 5) ?? "",
    endTime: item.endTime?.slice(0, 5) ?? "",
    participation: {
      current: item.currentParticipants ?? 0,
      max: item.maxCapacity ?? 0,
    },
    levelRequirement: {
      female: item.femaleLevel ?? [],
      male: item.maleLevel ?? [],
    },
    isBookmarked: item.isBookmarked ?? false,
    isCompleted: item.isCompleted ?? false,
  }));
};