import { useQuery } from "@tanstack/react-query";
import api from "../api";

// 1. 개별 건물 정보
export interface MonthlyBuilding {
  buildingName: string;
  streetAddr: string;
  latitude: number;
  longitude: number;
}

// 2. 날짜별 건물 리스트
export type MonthlyBuildingsByDate = Record<string, MonthlyBuilding[]>;

// 3. 전체 응답 타입
export interface MonthlyBuildingsResponse {
  year: number;
  month: number;
  centerLatitude: number;
  centerLongitude: number;
  radiusKm: number;
  buildings: MonthlyBuildingsByDate;
}

// 4. API 호출 시 사용하는 파라미터 타입
export interface MonthlyBuildingParams {
  date: string;
  latitude: number;
  longitude: number;
  radiusKm?: number; // 기본값 8
}

// 📌 API 요청 함수
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

// 📌 React Query 훅
export const useMonthlyBuildings = ({
  date,
  latitude,
  longitude,
  radiusKm = 8,
}: MonthlyBuildingParams) => {
  return useQuery({
    queryKey: ["monthly-buildings", date, latitude, longitude, radiusKm],
    queryFn: () =>
      fetchMonthlyBuildings({ date, latitude, longitude, radiusKm }),
    enabled: !!date && !!latitude && !!longitude,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
};
