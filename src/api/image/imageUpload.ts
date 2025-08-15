import api from "../api";
import type {
  ApiEnvelope,
  ImageDomainType,
  ImageUploadData,
} from "../../types/image";

// 단일 이미지 업로드
export async function uploadImage(
  file: File,
  domainType: ImageDomainType,
  opts?: {
    signal?: AbortSignal;
    /** 업로드 진행률 콜백 (0~1) */
    onProgress?: (ratio: number) => void;
  },
): Promise<ImageUploadData> {
  const form = new FormData();
  form.append("image", file);

  const res = await api.post<ApiEnvelope<ImageUploadData>>(
    "/api/s3/upload/img",
    form,
    {
      params: { domainType }, // ← 스웨거 그대로
      // Content-Type은 생략(브라우저가 boundary 포함해서 자동 지정)
      signal: opts?.signal,
      onUploadProgress: e => {
        if (opts?.onProgress && e.total) opts.onProgress(e.loaded / e.total);
      },
    },
  );

  const body = res.data;
  if (!body?.success) {
    throw new Error(body?.errorReason?.message || "이미지 업로드 실패");
  }
  return body.data;
}

// 여러 이미지 업로드
export async function uploadImages(
  files: File[],
  domainType: ImageDomainType,
  opts?: {
    signal?: AbortSignal;
    onEachProgress?: (index: number, ratio: number) => void;
  },
): Promise<ImageUploadData[]> {
  return Promise.all(
    files.map((f, i) =>
      uploadImage(f, domainType, {
        signal: opts?.signal,
        onProgress: r => opts?.onEachProgress?.(i, r),
      }),
    ),
  );
}
