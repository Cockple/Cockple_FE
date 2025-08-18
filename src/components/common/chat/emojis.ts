// 채팅 이모티콘들(귀여움❤️)
import E01 from "@/assets/images/emoji_hello.png?url";
import E02 from "@/assets/images/emoji_attend.png?url";
import E03 from "@/assets/images/emoji_notAttend.png?url";
import E04 from "@/assets/images/emoji_womenDouble.png?url";
import E05 from "@/assets/images/emoji_menDouble.png?url";
import E06 from "@/assets/images/emoji_mixedDouble.png?url";
import E07 from "@/assets/images/emoji_guest.png?url";
import E08 from "@/assets/images/emoji_calculate.png?url";
import E09 from "@/assets/images/emoji_exercise.png?url";

export const EMOJIS = [
  { name: "안녕하세요", url: E01 },
  { name: "참석해요", url: E02 },
  { name: "불참해요", url: E03 },
  { name: "여복칠랭", url: E04 },
  { name: "남복칠랭", url: E05 },
  { name: "혼복칠랭", url: E06 },
  { name: "게스트데려가요", url: E07 },
  { name: "정사타임", url: E08 },
  { name: "운동있어요", url: E09 },
];
// src/components/common/chat/emojis.ts
// 이 파일은 "이모티콘 = S3 키"를 진실로 두고, 화면/전송 시 공개 URL로 변환합니다.

// export type EmojiItem = {
//   /** 스토리지 키 (예: 'emoji/hello.png') */
//   key: string;
//   /** 표시용 라벨 (선택) */
//   label: string;
//   /** 공개 접근 가능한 URL (S3/CDN) */
//   url: string;
// };

// // 공개 URL Prefix는 .env에서 주입 (예: https://s3.ap-northeast-2.amazonaws.com/cockple-bucket/public/)
// const S3_BASE = (import.meta.env.VITE_S3_PUBLIC_BASE ?? "").replace(
//   /\/?$/,
//   "/",
// );

// // 내부 유틸: 키 → URL
// export const resolveFromKey = (key?: string | null) =>
//   key ? S3_BASE + String(key).replace(/^\/+/, "") : "";

// /** 이모티콘 키 목록 (필요한 만큼 추가) */
// export const EMOJI_KEYS = [
//   "emoji_hello.png",
//   "emoji_attend.png",
//   "emoji_notAttend.png",
//   "emoji_womenDouble.png",
//   "emoji_menDouble.png",
//   "emoji_mixedDouble.png",
//   "emoji_guest.png",
//   "emoji_calculate.png",
//   "emoji_exercise.png",
// ] as const;

// /** 라벨은 파일명에서 자동 추출 */
// const keyToLabel = (key: string) =>
//   (key.split("/").pop() ?? key).replace(/\.[^.]+$/, "").replace(/_/g, " ");

// /** 픽커/렌더링에 바로 쓸 수 있는 리스트 */
// export const EMOJIS: EmojiItem[] = (EMOJI_KEYS as readonly string[]).map(
//   key => ({
//     key,
//     label: keyToLabel(key),
//     url: resolveFromKey(key),
//   }),
// );

// /** 이모티콘 클릭 시 전송에 사용할 URL 생성기 (키만 받아 URL 반환) */
// export const getEmojiUrl = (key: string) => resolveFromKey(key);
