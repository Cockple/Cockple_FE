import { useMemo, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import CheckBoxBtn from "../../components/common/DynamicBtn/CheckBoxBtn";
import FilterBtn from "../../components/common/DynamicBtn/FilterBtn";
import Sort from "../../components/common/Sort";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import {
  isFilterDirty,
  useGroupRecommendFilterState,
} from "../../store/useGroupRecommendFilterStore";
import { usePartySuggestionInfinite } from "../../api/party/getPartySuggeston";
import { Group_M } from "../../components/common/contentcard/Group_M";
import appIcon from "@/assets/images/app_icon.png?url";

type SortLabel = "최신순" | "운동 많은 순";
const mapSortToApi = (label: SortLabel) =>
  label === "운동 많은 순" ? "운동 많은 순" : "최신순";

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
    resetFilter,
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
    size: 7,
    sort: mapSortToApi(sortOption),
  });

  console.log(data);
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
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onBackClick = () => {
    resetFilter();
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-2">
      <PageHeader title="모임 추천" onBackClick={onBackClick} />
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

          {items.length ? (
            items.map(it => (
              <div
                className="flex flex-col pb-3 border-b-[1px] border-gy-200"
                key={it.partyId}
              >
                <Group_M
                  id={it.partyId}
                  groupName={it.partyName}
                  femaleLevel={it.femaleLevel}
                  maleLevel={it.maleLevel}
                  location={`${it.addr1} ${it.addr2}`}
                  groupImage={it.partyImgUrl || appIcon}
                  nextActivitDate={it.nextExerciseInfo}
                  upcomingCount={it.totalExerciseCount}
                  isMine={false}
                  like={it.isBookmarked}
                  onClick={() => navigate(`/group/${it.partyId}`)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              콕플 추천 모임이 없습니다
            </div>
          )}

          {hasNextPage && <div ref={sentinelRef} className="h-6" />}
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
