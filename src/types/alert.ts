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

// V2 알림 응답: type/partyId 대신 이동 대상 정보(destination)가 내려온다.
export interface AlertDestination {
  resourceType: string; // 예: "EXERCISE" | "GAME_BOARD"
  resourceId: number;
  action: string; // 예: "VIEW"
}

export type ResponseAlertDto = {
  notificationId: number;
  partyId?: number; // 모임 이동시 필요 (구 응답)
  title: string;
  content: string;
  type?: AlertType; // 구 응답에만 존재
  destination?: AlertDestination;
  isRead: boolean;
  imgUrl: string;
  data?: AlertData; //운동 id, 날짜
};

// 커서 기반 페이징 응답 구조
export interface AlertListPage {
  notifications: ResponseAlertDto[];
  hasNext: boolean;
  nextCursor: number | null;
  totalElements: number;
}

export type AlertListResponse = CommonResponse<AlertListPage>;
