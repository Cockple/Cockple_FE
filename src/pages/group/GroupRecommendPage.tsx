import { useMemo, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import CheckBoxBtn from "../../components/common/DynamicBtn/CheckBoxBtn";
import FilterBtn from "../../components/common/DynamicBtn/FilterBtn";
import Sort from "../../components/common/Sort";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import {
  isFilterDirty,
  useGroupRecommendFilterState,
} from "../../store/useGroupRecommendFilterStore";
import { fetchPartySuggestionPage } from "../../api/party/getPartySuggestion";
import { Group_M } from "../../components/common/contentcard/Group_M";
import DefaultGroupImg from "@/assets/icons/defaultGroupImg.svg?url";
import Search from "../../assets/icons/search.svg?react";

type SortLabel = "최신순" | "운동 많은 순";
const mapSortToApi = (label: SortLabel) =>
  label === "운동 많은 순" ? "운동 많은 순" : "최신순";

export const GroupRecommendPage = () => {
  const navigate = useNavigate();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortLabel>("최신순");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText.trim());
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleSearch = () => {
    setDebouncedSearchText(searchText.trim());
  };

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
  } = useInfiniteQuery({
    queryKey: [
      "partySuggestionInfinite",
      {
        region,
        level,
        style,
        day,
        time,
        keyword,
        sort: mapSortToApi(sortOption),
        size: 7,
        search: debouncedSearchText,
      },
    ],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchPartySuggestionPage({
        isCockpleRecommend: false,
        page: pageParam,
        size: 7,
        sort: mapSortToApi(sortOption),
        search: debouncedSearchText,
        ...(region?.[0] ? { addr1: region[0] } : {}),
        ...(region?.[1] ? { addr2: region[1] } : {}),
        ...(level?.length ? { level } : {}),
        ...(style ? { partyType: style } : {}),
        ...(day?.length ? { activityDay: day } : {}),
        ...(time ? { activityTime: time } : {}),
        ...(keyword?.length ? { keyword } : {}),
      }),
    getNextPageParam: lastPage => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
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
        <div className="relative">
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="모임 이름으로 검색"
            className="w-full border rounded-xl p-2 pr-14 body-md-500 text-black border-[#E4E7EA] focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
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
                  groupImage={it.partyImgUrl ?? DefaultGroupImg}
                  nextActivitDate={it.nextExerciseInfo}
                  upcomingCount={it.totalExerciseCount}
                  isMine={false}
                  like={it.isBookmarked}
                  onClick={() => navigate(`/group/${it.partyId}`)}
                />
              </div>
            ))
          ) : status === "success" ? (
            <div className="text-center py-8 text-gray-500">
              콕플 추천 모임이 없습니다
            </div>
          ) : null}

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
