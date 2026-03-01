import api from "../api";

export interface Member {
  memberId: number;
  nickname: string;
  profileImageUrl?: string | null;
  role: string;
  gender: "MALE" | "FEMALE";
  level: string;
  isMe: boolean;
  lastExerciseDate:string;
}

export interface PartyMembersResponse {
  success: boolean;
  message: string;
  data: {
    summary: {
      totalCount: number;
      femaleCount: number;
      maleCount: number;
    };
    members: Member[]; 
  };
}
// 모임 멤버 조회 -> 마지막 운동일 추가
export const getPartyMembers = async (partyId: number) => {
  const response = await api.get<PartyMembersResponse>(
    `/api/parties/${partyId}/members`
  );
  return response.data;
};

// 다른 멤버 추방 (모임장/부모임장 전용)
export const removeMemberFromParty = async (partyId: number, memberId: number) => {
  return await api.delete(`/api/parties/${partyId}/members/${memberId}`);
};

// 부모임장 지정 및 해제 API 테스트 서버용
export const updateMemberRole = async (
  partyId: number,
  memberId: number,
  role: "party_SUBMANAGER" | "party_MEMBER"
) => {
  try {
    // 💡 api.patch 안의 주소 앞에 임시로 스테이징 주소를 통째로 붙여줍니다!
    const response = await api.patch(
      `https://staging.cockple.store/api/parties/${partyId}/members/${memberId}/role`,
      { role }
    );
    return response.data;
  } catch (error) {
    console.error("멤버 역할 변경 실패:", error);
    throw error;
  }
};

// //부모임장 지정 및 해제 API
// export const updateMemberRole = async (
//   partyId: number,
//   memberId: number,
//   role: "party_SUBMANAGER" | "party_MEMBER"
// ) => {
//   try {
//     const response = await api.patch(
//       `/api/parties/${partyId}/members/${memberId}/role`,
//       { role }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("멤버 역할 변경 실패:", error);
//     throw error;
//   }
// };