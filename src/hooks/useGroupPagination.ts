// 마이페이지 > 내 모임 훅
import { useState, useEffect, useRef, useCallback } from "react";
import { getMyGroups, type PartyData } from "../api/party/my";
import { getParties } from "../api/member/profile";

export const useGroupPagination = (
  memberId: string | null,
  isCreatedByMe: boolean,
  sortOption: string
) => {
  const [groups, setGroups] = useState<PartyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
  const pageSize = 50;
  const isMinePage = !memberId;
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 필터/정렬 변경 시 초기화
  useEffect(() => {
    setPage(0);
    setGroups([]);
    setHasMore(true);
  }, [isCreatedByMe, sortOption, memberId]);

  // 데이터 Fetching
  useEffect(() => {
    const fetchGroups = async () => {
      // 페이지가 0이 아니고 이미 로딩중이거나 더 가져올게 없으면 스킵
      // 단, page 0일때는 groups가 비어있어도 실행되어야 함
      if (isLoading) return; 
      if (!hasMore && page > 0) return;

      setIsLoading(true);

      try {
        let result: PartyData[];

        if (isMinePage) {
          result = await getMyGroups({
            created: isCreatedByMe,
            sort: sortOption,
            page,
            size: pageSize,
          });
        } else {
          result = await getParties(
            Number(memberId),
            page,
            pageSize,
            sortOption
          );
        }

        setGroups((prev) => {
          if (page === 0) return result;
          
          const merged = [...prev, ...result];
          const uniqueMap = new Map(merged.map((item) => [item.partyId, item]));
          return Array.from(uniqueMap.values());
        });

        setHasMore(result.length === pageSize);
      } catch (err) {
        console.error("모임 데이터를 불러오는 데 실패했습니다.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [page, isCreatedByMe, sortOption, memberId, isMinePage]);

  // 무한 스크롤
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1 });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return { groups, isLoading, hasMore, observerRef };
};