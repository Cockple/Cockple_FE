import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { CommonResponse } from "../../types/common";

export interface ExerciseEditData {
  date: string;
  buildingName: string;
  roadAddress: string;
  latitude: number;
  longitude: number;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  allowMemberGuestsInvitation: boolean;
  allowExternalGuests: boolean;
  notice: string;
}

export const useExerciseEditDetail = (exerciseId: string | number) => {
  return useQuery({
    queryKey: ["exerciseEditDetail", exerciseId],
    queryFn: () =>
      api
        .get<
          CommonResponse<ExerciseEditData>
        >(`/api/exercises/${exerciseId}/for-edit`)
        .then(res => res.data.data),
    enabled: !!exerciseId,
  });
};
