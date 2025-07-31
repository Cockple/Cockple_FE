export type AlertType =
  | "invite"
  | "invite_accept"
  | "invite_reject"
  | "change"
  | "simple";

export interface AlertItem {
  notificationId: number;
  title: string;
  content: string;
  type: AlertType;
  isRead: boolean;
  imgKey: string;
  groupId: number; // 모임 이동시 필요
}
