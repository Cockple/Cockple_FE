// src/pages/group/GroupPage.tsx
import Clear_XS from "../../components/common/Btn_Static/Icon_Btn/Clear_XS";
import White_L_Test from "../../components/common/Btn_Static/Text/White_L_Test";
import { Group_S } from "../../components/common/contentcard/Group_S";
import { MainHeader } from "../../components/common/system/header/MainHeader";
import ArrowRight from "@/assets/icons/arrow_right.svg";
import { Group_M } from "../../components/common/contentcard/Group_M";
import { Empty } from "../../components/group/main/Empty";
import AddIcon from "@/assets/icons/add.svg";
import { useNavigate } from "react-router-dom";
import { useGroupRecommendFilterState } from "../../store/useGroupRecommendFilterStore";
import { useEffect, useMemo, useRef } from "react";
import { useGetMyPartySimple } from "../../api/party/getMyPartySimple";
import {
  usePartySuggestion,
  type PartySuggestion,
} from "../../api/party/getPartySuggeston";
import { formatLevel } from "../../utils/formatLevel";

export const GroupPage = () => {
  const navigate = useNavigate();
  const { resetFilter } = useGroupRecommendFilterState();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useGetMyPartySimple(10);

  const { data: partySuggestion } = usePartySuggestion();

  const myParties = useMemo(
    () => (data ? data.pages.flatMap(p => p.content) : []),
    [data],
  );

  const onClickGroupRecommend = () => {
    resetFilter();
    navigate("/group/recommend");
  };

  useEffect(() => {
    resetFilter();
  }, [resetFilter]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current || !sentinelRef.current) return;
    if (!hasNextPage) return;

    const rootEl = scrollRef.current;
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: rootEl,
        threshold: 0.1,
        rootMargin: "0px 200px 0px 0px",
      },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 200;
    if (nearEnd) fetchNextPage();
  };

  return (
    <div className="flex flex-col">
      <MainHeader />
      <div className="flex flex-col mt-5 gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between header-h4 ">
            내 모임
            {myParties.length > 0 && (
              <Clear_XS
                iconMap={{
                  disabled: ArrowRight,
                  default: ArrowRight,
                  pressing: ArrowRight,
                  clicked: ArrowRight,
                }}
                onClick={() => navigate("/mypage/mygroup")}
              />
            )}
          </div>

          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex gap-1 overflow-x-auto scrollbar-hide"
          >
            {status === "error" ? (
              <div className="px-4 py-6 text-red-500">
                {(error as Error)?.message || "불러오기 실패"}
              </div>
            ) : myParties.length > 0 ? (
              <>
                <span onClick={() => navigate("/group/making/basic")}>
                  <White_L_Test label="모임 만들기" icon={AddIcon} />
                </span>

                {myParties.map(item => (
                  <div
                    key={item.partyId}
                    onClick={() => navigate(`/group/${item.partyId}`)}
                  >
                    <Group_S
                      title={item.partyName}
                      location={`${item.addr1}/${item.addr2}`}
                      imageSrc={item.partyImgUrl ?? "a"}
                    />
                  </div>
                ))}

                <div ref={sentinelRef} className="w-4 shrink-0" />
              </>
            ) : (
              <Empty />
            )}
          </div>

          {isFetchingNextPage && (
            <div className="pt-2 text-gray-400 text-sm">더 불러오는 중…</div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between header-h4 ">
            모임 추천
            <Clear_XS
              iconMap={{
                disabled: ArrowRight,
                default: ArrowRight,
                pressing: ArrowRight,
                clicked: ArrowRight,
              }}
              onClick={onClickGroupRecommend}
            />
          </div>

          <div className="flex flex-col gap-2">
            {partySuggestion?.content.map((item: PartySuggestion) => (
              <Group_M
                key={item.partyId}
                id={item.partyId}
                groupName={item.partyName}
                location={item.addr1 + "/" + item.addr2}
                femaleLevel={formatLevel(item.femaleLevel)}
                maleLevel={formatLevel(item.maleLevel)}
                nextActivitDate={item.nextExerciseInfo}
                groupImage={item.partyImgUrl ?? "a"}
                upcomingCount={item.totalExerciseCount}
                isMine={true}
                onClick={() => navigate(`/group/${item.partyId}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
