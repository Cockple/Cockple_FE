// 마이페이지 스토어
import { create } from "zustand";
import { getMyProfile } from "../api/member/my";
import { convertLevel } from "../utils/convertLevel";
import type { UserProfile } from "../types/member";

interface MyPageState {
  profile: UserProfile | null;
  isLoading: boolean;
  
  fetchMyProfile: () => Promise<void>;
  resetProfile: () => void; 
}

export const useMyPageStore = create<MyPageState>((set) => ({
  profile: null,
  isLoading: false,

  fetchMyProfile: async () => {
    set({ isLoading: true });
    try {
      const data = await getMyProfile();
      
      const mappedProfile: UserProfile = {
        name: data.memberName,
        gender: data.gender === "MALE" ? "MALE" : "FEMALE",
        level: convertLevel(data.level),
        birth: data.birth,
        goldCount: data.myGoldMedalCnt,
        silverCount: data.mySilverMedalCnt,
        bronzeCount: data.myBronzeMedalCnt,
        myGroupCount: data.myPartyCnt,
        myExerciseCount: data.myExerciseCnt,
        myMedalTotal:
          data.myGoldMedalCnt + data.mySilverMedalCnt + data.myBronzeMedalCnt,
        profileImage: data.profileImgUrl || undefined,
      };

      set({ profile: mappedProfile, isLoading: false });
    } catch (error) {
      console.error("프로필 로드 실패", error);
      set({ isLoading: false });
    }
  },

  resetProfile: () => set({ profile: null }),
}));