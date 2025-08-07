//나중에 삭제-------------------->
export type CommonResponse<T> = {
  code: string;
  message: string;
  data: T;
  errorReason: ErrorReasonDTO;
  success: boolean;
};

export type ErrorReasonDTO = {
  code: string;
  message: string;
  httpStatus: string;
};
//------------------------------->

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

export type ResponseAlertDto = {
  notificationId: number;
  partyId: number; // 모임 이동시 필요
  title: string;
  content: string;
  type: AlertType;
  isRead: boolean;
  imgUrl: string;
  data?: AlertData; //운동 id, 날짜
};

export type AlertListResponse = CommonResponse<ResponseAlertDto[]>;
