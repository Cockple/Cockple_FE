// src/api/image/upload.ts
import api from "../api";
import type {
  DomainType,
  ImageUploadItem,
  MultiImageUploadResponse,
  SingleImageUploadResponse,
} from "../../types/image";

/**
 * 단일 이미지 업로드
 * @param domainType PROFILE | PARTY | CONTEST | CHAT
 * @param imageFile  업로드할 File
 * @returns { imgUrl, imgKey, raw }
 */

// 단일 이미지 업로드
export const uploadImage = async (domainType: DomainType, imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await api.post<SingleImageUploadResponse>(
    `/api/s3/upload/img`,
    formData,
    {
      params: { domainType }, // ?domainType=CHAT
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  console.log(
    `imageUrl: ${res.data.data.imgUrl}, imageKey: ${res.data.data.imgKey}`,
  );
  //return response.data;
  // 사용하기 편하도록 평탄화해서 반환
  return {
    imgUrl: res.data.data.imgUrl,
    imgKey: res.data.data.imgKey,
    raw: res.data, //원본 응답값
  };
};

/**
 * 여러 장 이미지 업로드
 * @param domainType PROFILE | PARTY | CONTEST | CHAT
 * @param imageFiles 업로드할 File 배열
 * @returns { images: [{ imgUrl, imgKey }, ...], raw }
 */
export const uploadImages = async (
  domainType: DomainType,
  imageFiles: File[],
): Promise<{
  images: ImageUploadItem[];
  raw: MultiImageUploadResponse;
}> => {
  const formData = new FormData();
  // 백엔드가 "image"를 반복 필드로 받도록 구현되어 있음
  imageFiles.forEach(file => formData.append("image", file));

  const res = await api.post<MultiImageUploadResponse>(
    "/api/s3/upload/imgs",
    formData,
    {
      params: { domainType }, // ?domainType=CHAT
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return {
    images: res.data.data, // [{ imgUrl, imgKey }, ...]
    raw: res.data,
  };
};
