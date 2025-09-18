import api from "../api";

export interface PartyData {
  partyId: number;
  partyName: string;
  addr1: string;
  addr2: string;
  femaleLevel: string[];
  maleLevel: string[];
  nextExerciseInfo: string | null;
  totalExerciseCount: number;
  partyImgUrl: string;
  isMine: boolean;
  isBookmarked: boolean;
}

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

// 다른 사람 모임 조회
export const getParties = async (
  memberId: number,
  page: number,
  size: number,
  sort: string,
): Promise<PartyData[]> => {
  const response = await api.get(`/api/members/${memberId}/parties`, {
    params: {
      created: false, 
      sort,
      page,
      size,
    },
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "다른 유저의 모임 조회 실패");
  }
  return response.data.data?.content ?? [];
};
