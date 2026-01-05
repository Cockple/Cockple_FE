// 마이페이지 > 내 운동 유틸 함수 및 상수 분리 파일
import type { FilterType, OrderType } from "../api/exercise/my";

export const mapTabToFilterType = (tab: string): FilterType => {
  switch (tab) {
    case "참여 예정": return "UPCOMING";
    case "참여 완료": return "COMPLETED";
    default: return "ALL";
  }
};

export const mapSortToOrderType = (sort: string): OrderType => {
  return sort === "오래된 순" ? "OLDEST" : "LATEST";
};

export const TAB_OPTIONS = [
  { label: "전체", value: "전체" },
  { label: "참여 예정", value: "참여 예정" },
  { label: "참여 완료", value: "참여 완료" },
];