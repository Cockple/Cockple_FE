//게스트 초대 응답
export type ResponseInviteGuest = {
  guestId: number;
  gender: string;
  inviterName: string;
  isWaiting: boolean;
  level: string;
  name: string;
  participantNumber?: number;
};
