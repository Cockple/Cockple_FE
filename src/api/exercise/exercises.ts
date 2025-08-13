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

// 운동 상세 조회
export const getExerciseDetail = async (exerciseId: number): Promise<ExerciseDetailResponse> => {
  const response = await api.get<{ code: string; message: string; data: RawExerciseResponse; success: boolean }>(
    `/api/exercises/${exerciseId}`
  );

  const raw = response.data.data; 

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
    participantMembers: raw.participants.list.map((p: any) => ({
      id: p.participantId,
      status: "Participating",
      name: p.name,
      gender: p.gender,
      level: p.level,
      isMe: false,
      isLeader: p.position === "모임장",
      position: p.position,
      imgUrl: p.profileImageUrl ?? null,
      canCancel: true,
      guest: p.inviterName ?? null,
    })),
    waitingCount: raw.waiting.totalCount,
    waitingGenderCount: {
      male: raw.waiting.manCount,
      female: raw.waiting.womenCount,
    },
    waitingMembers: raw.waiting.list.map((w: any) => ({
      id: w.participantId,
      status: "waiting",
      name: w.name,
      gender: w.gender,
      level: w.level,
      isMe: false,
      isLeader: false,
      position: w.partyPosition,
      imgUrl: w.profileImageUrl ?? null,
      canCancel: true,
      guest: w.inviterName ?? null,
    })),
  };
};

// 멤버 삭제
export const cancelSelf = async (exerciseId: number, memberId: number) => {
  const response = await api.delete(`/api/exercises/${exerciseId}/participants/${memberId}`);
  return response.data;
};
