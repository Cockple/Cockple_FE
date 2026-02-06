import type { ContestRecordRequest } from "@/api/contest/contestmy";

// 옵션 상수
export const FORM_OPTIONS = ["혼복", "여복", "남복", "단식"] as const;
export const LEVEL_OPTIONS = ["왕초심", "초심", "D조", "C조", "B조", "A조", "준자강", "자강"];

// 매핑 테이블
export const TYPE_MAP: Record<typeof FORM_OPTIONS[number], ContestRecordRequest["type"]> = {
  "단식": "SINGLE",
  "남복": "MEN_DOUBLES",
  "여복": "WOMEN_DOUBLES",
  "혼복": "MIX_DOUBLES",
};

export const LEVEL_MAP: Record<string, ContestRecordRequest["level"]> = {
  "왕초심": "NOVICE",
  "초심": "BEGINNER",
  "D조": "D",
  "C조": "C",
  "B조": "B",
  "A조": "A",
  "준자강": "SEMI_EXPERT",
  "자강": "EXPERT",
  "급수 없음": "NONE",
};

// URL 유틸 함수
export const sanitizeUrl = (url: string) => {
  let decoded = decodeURIComponent(url);
  if (decoded.includes("https%3A")) {
      decoded = decodeURIComponent(decoded);
  }
  const httpSplit = decoded.split("https://");
  if (httpSplit.length > 2) {
     return "https://" + httpSplit[httpSplit.length - 1];
  }
  return decoded;
};

export const extractKeyFromUrl = (url: string) => {
  if (!url.startsWith("http")) return url;
  const bucketName = "cockple-bucket/"; 
  const parts = url.split(bucketName);
  
  if (parts.length > 1) {
    return decodeURIComponent(parts[1]); 
  }
  return url;
};