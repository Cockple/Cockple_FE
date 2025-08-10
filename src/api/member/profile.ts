import api from "../api";

export interface ProfileResponseData {
  memberName: string;
  birth: string;
  gender: "MALE" | "FEMALE";
  level: string;
  profileImgUrl: string;
  myPartyCnt: number;
  myGoldMedalCnt: number;
  mySilverMedalCnt: number;
  myBronzeMedalCnt: number;
  myGroupCount: number;
}

// 다른 사람 프로필 조회
export const getProfile = async (memberId: number): Promise<ProfileResponseData> => {
  const response = await api.get(`/api/profile/${memberId}`);
  if (!response.data.success) {
    throw new Error(response.data.message || "프로필 조회 실패");
  }
  return response.data.data;
};

