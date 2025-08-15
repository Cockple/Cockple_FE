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
}

interface GetMyGroupsParams {
  created?: boolean;
  sort?: string;
  page?: number;
  size?: number;
}

//내 모임 조회
export const getMyGroups = async ({
  created = false,
  sort = "최신순",
  page = 0,
  size = 20,
}: GetMyGroupsParams): Promise<PartyData[]> => {
  const response = await api.get("/api/my/parties", {
    params: {
      created,
      sort,
      "pageable.page": page,
      "pageable.size": size,
    },
  });
    console.log("내 모임 조회 응답 결과:", response.data);

  return response.data?.data?.content ?? [];
};

//모임 탈퇴
export const leaveParty = async (partyId: number) => {
  try {
    const res = await api.delete(`/api/parties/${partyId}/members/my`);
    return res; // ✅ axios 전체 응답 반환
  } catch (err: any) {
    if (err.response?.status === 403) {
      return { data: { success: false, code: 403, message: "모임장은 탈퇴할 수 없습니다." } };
    } else if (err.response?.status === 404) {
      return { data: { success: false, code: 404, message: "존재하지 않는 모임 또는 사용자입니다." } };
    } else {
      console.error(err);
      return { data: { success: false, code: 500, message: "모임 탈퇴 중 오류" } };
    }
  }
};
