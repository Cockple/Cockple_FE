import api from "../api";

interface ProfileUpdatePayload {
  memberName: string;
  birth: string;
  level: string;
  keywords: string[];
  imgKey: string;
}

//내 프로필 조회
export async function getMyProfile() {
  const response = await api.get("/api/my/profile");
  return response.data.data;
}

// 프로필 수정
export const patchMyProfile = async (payload: ProfileUpdatePayload) => {
  const response = await api.patch("/api/my/profile", payload);
  return response.data;
};