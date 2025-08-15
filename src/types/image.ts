export const IMAGE_DOMAIN_TYPES = [
  "PROFILE",
  "CONTEST",
  "CHAT",
  "PARTY",
] as const;
export type ImageDomainType = (typeof IMAGE_DOMAIN_TYPES)[number];

// 공통 응답 래퍼
export interface ApiEnvelope<T> {
  code: string;
  message: string;
  data: T;
  success: boolean;
  errorReason?: {
    code: string;
    message: string;
    httpStatus?: string;
  };
}

// 업로드 성공 시 data 필드
export interface ImageUploadData {
  imgUrl: string; // S3 접근 가능 URL
  imgKey: string; // 이후 API에 전달할 key (DB 저장 대상)
}
