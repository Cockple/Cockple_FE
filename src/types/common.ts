export type CommenResponse<T> = {
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
