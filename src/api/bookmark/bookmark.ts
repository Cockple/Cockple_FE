// src/api/bookmark.ts
import api from "../api";
import type {
  GroupCardResponse,
  ExerciseCardResponse,
} from "../../types/liked";

// 모임 찜 조회
export const fetchGroupBookmarks = async (
  orderType: string,
): Promise<GroupCardResponse> => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get("/api/parties/bookmarks", {
    params: { orderType },
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("모임 찜 조회: ", res.data);
  return res.data;
};

// 찜한 모임 ID 목록 가져오기
export const fetchLikedGroupIds = async (): Promise<number[]> => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get("/api/parties/bookmarks", {
    params: { orderType: "LATEST" },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.map((group: any) => group.partyId);
};

// 운동 찜 조회
export const fetchExerciseBookmarks = async (
  orderType: string,
): Promise<ExerciseCardResponse> => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get("/api/exercises/bookmarks", {
    params: { orderType },
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("운동 찜 조회: ", res.data);
  return res.data;
};

// 찜한 운동 ID 목록 가져오기
export const fetchLikedExerciseIds = async (): Promise<number[]> => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get("/api/exercises/bookmarks", {
    params: { orderType: "LATEST" },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.map((exercise: any) => exercise.exerciseId);
};

// 모임 찜
export const bookmarkGroup = async (partyId: number) => {
  const token = localStorage.getItem("accessToken");
  const res = await api.post(`/api/parties/${partyId}/bookmark`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("모임 찜! : ", partyId);
  return res;
};

// 모임 찜 해제
export const unbookmarkGroup = async (partyId: number) => {
  const token = localStorage.getItem("accessToken");
  const res = await api.delete(`/api/parties/${partyId}/bookmark`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("모임 찜 해제!: ", partyId);
  return res;
};

// 운동 찜
export const bookmarkExercise = async (exerciseId: number) => {
  const token = localStorage.getItem("accessToken");
  const res = await api.post(`/api/exercises/${exerciseId}/bookmark`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("운동 찜! : ", exerciseId);
  return res;
};

// 운동 찜 해제
export const unbookmarkExercise = async (exerciseId: number) => {
  const token = localStorage.getItem("accessToken");
  const res = await api.delete(`/api/exercises/${exerciseId}/bookmark`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("운동 찜 해제! : ", exerciseId);
  return res;
};
