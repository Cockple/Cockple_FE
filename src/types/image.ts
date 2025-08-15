// 이미지 업로드 API Response 타입
// export interface ImageUploadResponse {
//   code: string;
//   message: string;
//   data: {
//     imgUrl: string; // 업로드된 이미지 접근 URL
//     imgKey: string; // 이미지 Key (DB 저장용)
//   };
//   success: boolean;
// }

import type { CommonResponse } from "./common";

// 이미지 업로드 API Request params 타입
export type DomainType = "PROFILE" | "PARTY" | "CONTEST" | "CHAT"; // Swagger에 정의된 값에 맞게 확장 가능

// 업로드된 단일 이미지 정보
export type ImageUploadItem = {
  /** S3 퍼블릭 접근 URL */
  imgUrl: string;
  /** DB 저장용 Key (API 요청 시 서버로 넘겨줄 값) */
  imgKey: string;
};

/** 단일 이미지 업로드 응답 (data: ImageUploadItem) */
export type SingleImageUploadResponse = CommonResponse<ImageUploadItem>;

/** 여러 장 이미지 업로드 응답 (data: ImageUploadItem[]) */
export type MultiImageUploadResponse = CommonResponse<ImageUploadItem[]>;
