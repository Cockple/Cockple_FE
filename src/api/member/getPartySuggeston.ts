import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import api from "../api";

export interface PartySuggestion {
  partyId: number;
  partyName: string;
  addr1: string;
  addr2: string;
  femaleLevel: string[];
  maleLevel: string[];
  nextExerciseInfo: string;
  totalExerciseCount: number;
  partyImgUrl: string | null;
}

export interface PartySuggestionsPage {
  content: PartySuggestion[];
  pageNumber: number; // 현재 페이지 번호
  pageSize: number; // 요청한 페이지 크기
  numberOfElements: number; // 이번 페이지에 담긴 실제 개수
}

const DEFAULT_PAGE_SIZE = 20;

const fetchPartySuggestionPage = async (
  page = 0,
  size = DEFAULT_PAGE_SIZE,
  isCockpleRecommend = true,
): Promise<PartySuggestionsPage> => {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: PartySuggestionsPage;
  }>("/api/my/parties/suggestions", {
    params: { isCockpleRecommend, page, size },
  });
  return data.data;
};

/** ✅ 기본: 파라미터 없이 호출하면 20개 1페이지만 */
export const usePartySuggestion = (opts?: {
  page?: number;
  size?: number;
  isCockpleRecommend?: boolean; // 기본 true
}) => {
  const page = opts?.page ?? 0;
  const size = opts?.size ?? DEFAULT_PAGE_SIZE;
  const isCockpleRecommend = opts?.isCockpleRecommend ?? true;

  return useQuery({
    queryKey: ["partySuggestion", { page, size, isCockpleRecommend }],
    queryFn: () => fetchPartySuggestionPage(page, size, isCockpleRecommend),
    staleTime: 60_000,
  });
};

/** ♾️ 세로 무한스크롤용 */
export const usePartySuggestionInfinite = (opts?: {
  initialPage?: number;
  size?: number;
  isCockpleRecommend?: boolean; // 기본 true
}) => {
  const initialPage = opts?.initialPage ?? 0;
  const size = opts?.size ?? DEFAULT_PAGE_SIZE;
  const isCockpleRecommend = opts?.isCockpleRecommend ?? true;

  return useInfiniteQuery({
    queryKey: ["partySuggestionInfinite", { size, isCockpleRecommend }],
    initialPageParam: initialPage,
    queryFn: ({ pageParam }) =>
      fetchPartySuggestionPage(pageParam as number, size, isCockpleRecommend),
    getNextPageParam: lastPage => {
      // 더 가져올 게 없으면 종료 (이번 페이지 개수가 pageSize보다 작으면 끝)
      if (lastPage.content.length < lastPage.pageSize) return undefined;
      return lastPage.pageNumber + 1;
    },
    staleTime: 60_000,
  });
};
