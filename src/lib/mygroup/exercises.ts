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

// 우리가 쓸 UI용 멤버 타입 (MemberProps 예시)
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

// 최종 프론트에서 사용할 타입 (ExerciseDetailResponse)
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


export const getExerciseDetail = async (exerciseId: number): Promise<ExerciseDetailResponse> => {
  const response = await api.get(`/api/exercises/${exerciseId}`);
  console.log("API response data:", response.data);
  const raw = response.data.data;

  // raw 데이터를 ExerciseDetailResponse 타입으로 변환
  const converted: ExerciseDetailResponse = {
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
      imgUrl: p.imgUrl ?? null,
      canCancel: p.canCancel,
      guest: p.guest,
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
      position: w.position,
      imgUrl: w.imgUrl ?? null,
      canCancel: w.canCancel,
      guest: w.guest,
    })),
  };

  return converted;
};


// 멤버 삭제 (예시)
export const deleteParticipantMember = async (exerciseId: number, memberId: number) => {
  const response = await api.delete(`/api/exercises/${exerciseId}/participants/${memberId}`);
  return response.data;
};
