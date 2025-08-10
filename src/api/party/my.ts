import api from "../api";

export interface PartyData {
  partyId: number;
  createdAt: string;
  groupName: string;
  groupImage: string;
  location: string;
  femaleLevel: string;
  maleLevel: string;
  nextActivitDate: string;
  upcomingCount: number;
  like?: boolean;
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
