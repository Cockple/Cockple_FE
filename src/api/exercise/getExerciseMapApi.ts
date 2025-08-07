import { useQuery } from "@tanstack/react-query";
import api from "../api";

//
// 📌 [1] 월간 건물 지도 조회 (/api/buildings/map/monthly)
//

export interface MonthlyBuilding {
  buildingName: string;
  streetAddr: string;
  latitude: number;
  longitude: number;
}

export type MonthlyBuildingsByDate = Record<string, MonthlyBuilding[]>;

export interface MonthlyBuildingsResponse {
  year: number;
  month: number;
  centerLatitude: number;
  centerLongitude: number;
  radiusKm: number;
  buildings: MonthlyBuildingsByDate;
}

export interface MonthlyBuildingParams {
  date: string;
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

export const fetchMonthlyBuildings = async ({
  date,
  latitude,
  longitude,
  radiusKm = 8,
}: MonthlyBuildingParams): Promise<MonthlyBuildingsResponse> => {
  const res = await api.get("/api/buildings/map/monthly", {
    params: {
      date,
      latitude,
      longitude,
      radiusKm,
    },
  });
  return res.data.data;
};

export const useMonthlyBuildings = ({
  date,
  latitude,
  longitude,
  radiusKm = 8,
}: MonthlyBuildingParams) =>
  useQuery({
    queryKey: ["monthly-buildings", date, latitude, longitude, radiusKm],
    queryFn: () =>
      fetchMonthlyBuildings({ date, latitude, longitude, radiusKm }),
    enabled: !!date && !!latitude && !!longitude,
    staleTime: 1000 * 60 * 5,
  });

//
// 📌 [2] 운동 상세 조회 (/api/buildings/exercises/{date})
//

export interface Exercise {
  exerciseId: number;
  partyId: number;
  partyName: string;
  date: string;
  dayOfTheWeek: string;
  startTime: string;
  endTime: string;
  imageUrl: string;
  isBookmarked: boolean;
}

export interface ExerciseDetailResponse {
  buildingName: string;
  totalExercises: number;
  exercises: Exercise[];
}

export interface ExerciseDetailParams {
  date: string;
  buildingName: string;
  streetAddr: string;
}

export const fetchExerciseDetail = async ({
  date,
  buildingName,
  streetAddr,
}: ExerciseDetailParams): Promise<ExerciseDetailResponse> => {
  const res = await api.get(`/api/buildings/exercises/${date}`, {
    params: {
      buildingName,
      streetAddr,
    },
  });
  return res.data.data;
};
