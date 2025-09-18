//운동 상세 조회 및 삭제 /api/exercises/{exerciseId}
import api from "../api";

// 타입 정의 (API 응답에 맞게)
export interface ApiParticipant {
  participantId: number;
  num: number;
  memberId?: number;
  guestId?: number;
  imgUrl: string | null;
  name: string;
  position: string | null;
  gender: string;
  level: string;
  canCancel: boolean;
  guest: string | null;
}

// API 응답 타입
export interface ExerciseApiResponse {
  info: {
    notice: string;
    buildingName: string;
    location: string;
  };
  participants: {
    currentParticipantCount: number;
    totalCount: number;
    manCount: number;
    womenCount: number;
    list: ApiParticipant[];
  };
  waiting: {
    totalCount: number;
    manCount: number;
    womenCount: number;
    list: ApiParticipant[];
  };
}

// UI에서 사용할 멤버 타입
export interface MemberProps {
  id: number;
  status: string;
  name: string;
  gender: string;
  level: string;
  isMe: boolean;
  isLeader: boolean;
  position: string | null;
  imgUrl: string | null;
  canCancel: boolean;
  guest: string | null;
  inviterName: string;

}

// 최종 변환 타입
export interface ExerciseDetailResponse {
  partyId: number;
  notice: string;
  placeName: string;
  placeAddress: string;
  participantsCount: number;
  participantGenderCount: { male: number; female: number };
  participantMembers: MemberProps[];
  waitingCount: number;
  waitingGenderCount: { male: number; female: number };
  waitingMembers: MemberProps[];
  isManager: boolean;
}

interface RawExerciseResponse {
  isManager: boolean;
  info: {
    notice: string;
    buildingName: string;
    location: string;
  };
  participants: {
    currentParticipantCount: number;
    totalCount: number;
    manCount: number;
    womenCount: number;
    list: any[];
  };
  waiting: {
    totalCount: number;
    manCount: number;
    womenCount: number;
    list: any[];
  };
}

export interface CancelSelfResponse {
  code: string;
  message: string;
  data?: any;
  errorReason?: any;
  success: boolean;
}

//게스트 참여 삭제
export interface CancelGuestResponse {
  code: string;
  message: string;
  data?: {
    imgUrl: string;
    imgKey: string;
    originalFileName: string;
    fileSize: number;
    fileType: string;
  };
  errorReason?: {
    code: string;
    message: string;
    httpStatus: string;
  };
  success: boolean;
}

// 운동 상세 조회
export const getExerciseDetail = async (
  exerciseId: number,
  currentUserId?: number,
): Promise<ExerciseDetailResponse> => {
  const response = await api.get<{
    code: string;
    message: string;
    data: RawExerciseResponse;
    success: boolean;
  }>(`/api/exercises/${exerciseId}`);

  const raw = response.data.data;
  console.log("!!", raw);

  const mapLevelToKorean = (level: string) => {
    const levelMap: Record<string, string> = {
      A: "A조",
      B: "B조",
      C: "C조",
      D: "D조",
      BEGINNER: "초심",
      NOVICE: "왕초심",
      NONE: "레벨 미정",
      ADVANCED: "상급",
      SEMI_EXPERT: "준자강",
      EXPERT: "자강",
    };
    return levelMap[level] || level;
  };

  const transformMember = (p: any) => ({
    id: p.participantId,
    memberId: p.participantId,
    status: "Participating",
    name: p.name,
    gender: p.gender,
    level: mapLevelToKorean(p.level),
    isMe: currentUserId === p.participantId,
    isLeader:
      currentUserId === p.participantId
        ? p.partyPosition === "party_MANAGER"
        : false,
    position: p.partyPosition,
    imgUrl: p.profileImageUrl ?? null,
    canCancel: currentUserId === p.participantId || p.canCancel,
    guest: p.inviterName ?? null,
    inviterName: p.inviterName ?? "",   
    isManager: p.isManager,
  });

  return {
    partyId: exerciseId,
    notice: raw.info.notice,
    placeName: raw.info.buildingName,
    placeAddress: raw.info.location,
    participantsCount: raw.participants.totalCount,
    participantGenderCount: {
      male: raw.participants.manCount,
      female: raw.participants.womenCount,
    },
    participantMembers: raw.participants.list.map(transformMember),
    waitingCount: raw.waiting.totalCount,
    waitingGenderCount: {
      male: raw.waiting.manCount,
      female: raw.waiting.womenCount,
    },
    
    isManager: raw.isManager,
    waitingMembers: raw.waiting.list.map(transformMember),
  };
};

// 참여 중인 자신 운동 나가기
export const cancelSelf = async (
  exerciseId: number,
): Promise<CancelSelfResponse> => {
  try {
    const response = await api.delete<CancelSelfResponse>(
      `/api/exercises/${exerciseId}/participants/my`,
    );
    return response.data;
  } catch (error: any) {
    console.error("운동 참여 취소 API 호출 실패:", error);
    throw error.response?.data || error;
  }
};

// 참여하는 운동 삭제하기
export const deleteExercise = async (exerciseId: number) => {
  try {
    const response = await api.delete(`/api/exercises/${exerciseId}`);
    return response.data;
  } catch (error: any) {
    console.error("운동 삭제 API 호출 실패:", error);
    throw error.response?.data || error;
  }
};

