export type AlertType =
  | "invite"
  | "invite_accept"
  | "invite_reject"
  | "change"
  | "simple";

export interface AlertData {
  exerciseId?: number;
  exerciseDate?: string; // YYYY-MM-DD
}

export interface AlertItem {
  notificationId: number;
  partyId: number; // 모임 이동시 필요
  title: string;
  content: string;
  type: AlertType;
  isRead: boolean;
  imgKey: string;
  data?: AlertData; //운동 id, 날짜
}
