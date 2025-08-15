import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import api from "../api";
import { useGroupRecommendFilterState } from "../../store/useGroupRecommendFilterStore";

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
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
}

const DEFAULT_PAGE_SIZE = 20;

const buildSuggestionParams = (
  {
    recommend,
    region,
    level,
    style,
    day,
    time,
    keyword,
  }: {
    recommend: boolean;
    region: string[];
    level: string[];
    style: string;
    day: string[];
    time: string;
    keyword: string[];
  },
  page: number,
  size: number,
  sort?: string,
) => {
  const params: Record<string, unknown> = {
    isCockpleRecommend: recommend,
    page,
    size,
  };

  if (sort) params.sort = sort;

  if (!recommend) {
    if (region?.[0]) params.addr1 = region[0];
    if (region?.[1]) params.addr2 = region[1];
    if (level?.length) params.level = level;
    if (style) params.partyType = style;
    if (day?.length) params.activityDay = day;
    if (time) params.activityTime = time;
    if (keyword?.length) params.keyword = keyword;
  }

  return params;
};

const fetchPartySuggestionPage = async (params: Record<string, unknown>) => {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: PartySuggestionsPage;
  }>("/api/my/parties/suggestions", {
    params,
    paramsSerializer: {
      serialize: (p: Record<string, unknown>) => {
        const usp = new URLSearchParams();
        Object.entries(p).forEach(([k, v]) => {
          if (v === undefined || v === null || v === "") return;
          if (Array.isArray(v)) {
            v.forEach(item => usp.append(k, String(item)));
          } else {
            usp.append(k, String(v));
          }
        });
        return usp.toString();
      },
    },
  });

  console.log(data.data);
  return data.data;
};

export const usePartySuggestion = (opts?: {
  page?: number;
  size?: number;
  sort?: string;
}) => {
  const page = opts?.page ?? 0;
  const size = opts?.size ?? DEFAULT_PAGE_SIZE;
  const sort = opts?.sort;

  const { recommend, region, level, style, day, time, keyword } =
    useGroupRecommendFilterState();

  const params = buildSuggestionParams(
    { recommend, region, level, style, day, time, keyword },
    page,
    size,
    sort,
  );

  return useQuery({
    queryKey: ["partySuggestion", params],
    queryFn: () => fetchPartySuggestionPage(params),
    staleTime: 60_000,
  });
};

export const usePartySuggestionInfinite = (opts?: {
  initialPage?: number;
  size?: number;
  sort?: string;
}) => {
  const initialPage = opts?.initialPage ?? 0;
  const size = opts?.size ?? DEFAULT_PAGE_SIZE;
  const sort = opts?.sort;

  const { recommend, region, level, style, day, time, keyword } =
    useGroupRecommendFilterState();

  return useInfiniteQuery({
    queryKey: [
      "partySuggestionInfinite",
      { recommend, region, level, style, day, time, keyword, size, sort },
    ],
    initialPageParam: initialPage,
    queryFn: ({ pageParam }) => {
      const params = buildSuggestionParams(
        { recommend, region, level, style, day, time, keyword },
        pageParam as number,
        size,
        sort,
      );
      return fetchPartySuggestionPage(params);
    },
    getNextPageParam: lastPage => {
      if (lastPage.content.length < lastPage.pageSize) return undefined;
      return lastPage.pageNumber + 1;
    },
    staleTime: 60_000,
  });
};
