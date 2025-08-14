import { useMemo, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import CheckBoxBtn from "../../components/common/DynamicBtn/CheckBoxBtn";
import FilterBtn from "../../components/common/DynamicBtn/FilterBtn";
import Sort from "../../components/common/Sort";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import { Exercise_M } from "../../components/common/contentcard/Exercise_M";
import {
  isFilterDirty,
  useGroupRecommendFilterState,
} from "../../store/useGroupRecommendFilterStore";
import { usePartySuggestionInfinite } from "../../api/party/getPartySuggeston";

type SortLabel = "최신순" | "운동 많은 순";
const mapSortToApi = (label: SortLabel) =>
  label === "운동 많은 순" ? "POPULARITY" : "LATEST";

export const GroupRecommendPage = () => {
  const navigate = useNavigate();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortLabel>("최신순");

  const {
    recommend,
    toggleRecommend,
    region,
    level,
    style,
    day,
    time,
    keyword,
  } = useGroupRecommendFilterState();

  const filterStatus = isFilterDirty({
    region,
    level,
    style,
    day,
    time,
    keyword,
    recommend,
  })
    ? "clicked"
    : "default";

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    status,
    error,
  } = usePartySuggestionInfinite({
    size: 10,
    sort: mapSortToApi(sortOption),
  });
  const items = useMemo(() => {
    const flat = data ? data.pages.flatMap(p => p.content) : [];
    const seen = new Set<number>();
    return flat.filter(it => {
      if (seen.has(it.partyId)) return false;
      seen.add(it.partyId);
      return true;
    });
  }, [data]);

  const pullingRef = useRef(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    if (!hasNextPage) return;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!hasNextPage) return;
        if (isFetchingNextPage) return;
        if (pullingRef.current) return;

        try {
          pullingRef.current = true;
          await fetchNextPage();
        } finally {
          setTimeout(() => {
            pullingRef.current = false;
          }, 150);
        }
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px 200px 0px",
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col gap-2">
      <PageHeader title="모임 추천" />
      <div className="flex flex-col gap-3">
        <div className="flex justify-between w-full h-7">
          <CheckBoxBtn checked={recommend} onClick={toggleRecommend}>
            <span>콕플 추천</span>
          </CheckBoxBtn>

          <div className="flex items-center">
            <FilterBtn
              onClick={() => navigate("/group/recommend-filter")}
              forceStatus={filterStatus}
              disabled={recommend}
            >
              <span>필터</span>
            </FilterBtn>
            <div className="h-4 w-px bg-gray-200 mx-1" />
            <Sort
              label={sortOption}
              isOpen={isSortOpen}
              onClick={() => setIsSortOpen(!isSortOpen)}
              disabled={recommend}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {status === "pending" && <div>불러오는 중…</div>}
          {status === "error" && (
            <div className="text-red-500">
              {(error as Error)?.message || "불러오기 실패"}
            </div>
          )}

          {items.map(it => (
            <div
              className="flex flex-col pb-3 border-b-[1px] border-gy-200"
              key={it.partyId}
            >
              <Exercise_M
                id={it.partyId}
                title={it.partyName}
                date={it.nextExerciseInfo}
                time=""
                location={`${it.addr1} ${it.addr2}`}
                imageSrc={it.partyImgUrl || "a"}
                onClick={() => navigate(`/group/${it.partyId}`)}
              />
            </div>
          ))}

          {hasNextPage && <div ref={sentinelRef} className="h-6" />}

          {isFetchingNextPage && (
            <div className="text-gray-400">더 불러오는 중…</div>
          )}
        </div>
      </div>

      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selected={sortOption}
        onSelect={opt => setSortOption(opt as SortLabel)}
        options={["최신순", "운동 많은 순"]}
      />
    </div>
  );
};
