//나중에 삭제-------------------->
// export type CommonResponse<T> = {
//   code: string;
//   message: string;
//   data: T;
//   errorReason: ErrorReasonDTO;
//   success: boolean;
// };

// export type ErrorReasonDTO = {
//   code: string;
//   message: string;
//   httpStatus: string;
// };
//------------------------------->
import type { CommonResponse } from "./common";

export type AlertType =
  | "INVITE"
  | "INVITE_ACCEPT"
  | "INVITE_REJECT"
  | "CHANGE"
  | "SIMPLE";

export interface AlertData {
  exerciseId?: number;
  exerciseDate?: string; // YYYY-MM-DD
  invitationId?: number; // type이 invite인 경우 모임 api에 사용
}

export type ResponseAlertDto = {
  notificationId: number;
  partyId: number; // 모임 이동시 필요
  title: string;
  content: string;
  type: AlertType;
  isRead: boolean;
  imgKey: string;
  data?: AlertData; //운동 id, 날짜
};

export type AlertListResponse = CommonResponse<ResponseAlertDto[]>;
