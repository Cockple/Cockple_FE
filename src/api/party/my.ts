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
