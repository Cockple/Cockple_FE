import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../api";
import type { CommonResponse } from "../../types/common";

export interface Party {
  partyId: number;
  partyName: string;
  addr1: string;
  addr2: string;
  partyImgUrl: string | null;
}

export interface MyPartiesPage {
  content: Party[];
  pageable?: { pageNumber: number; pageSize: number };
  number: number;
  size: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

async function fetchMyPartiesPage({
  pageParam = 0,
  pageSize = 10,
}: {
  pageParam?: number;
  pageSize?: number;
}): Promise<MyPartiesPage> {
  const { data } = await api.get<CommonResponse<MyPartiesPage>>(
    "/api/my/parties/simple",
    {
      params: {
        page: pageParam,
        size: pageSize,
        "pageable.page": pageParam,
        "pageable.size": pageSize,
      },
      paramsSerializer: {
        serialize: p => {
          const usp = new URLSearchParams();
          Object.entries(p).forEach(([k, v]) => usp.append(k, String(v)));
          return usp.toString();
        },
      },
    },
  );

  return data.data;
}

export function useGetMyPartySimple(pageSize = 10) {
  return useInfiniteQuery({
    queryKey: ["myPartiesSimpleInfinite", { pageSize }],
    queryFn: ({ pageParam }) =>
      fetchMyPartiesPage({ pageParam: (pageParam as number) ?? 0, pageSize }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last) return undefined;

      if (lastPage.numberOfElements < lastPage.size) return undefined;

      if (allPages.length >= 2) {
        const prev = allPages[allPages.length - 2];
        if (prev.number === lastPage.number) return undefined;
      }

      return lastPage.number + 1;
    },
    refetchOnWindowFocus: false,
  });
}
