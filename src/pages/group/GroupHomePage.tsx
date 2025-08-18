import { useEffect, useRef, useState, useMemo } from "react";
import { GroupInfoList } from "../../components/group/home/GroupInfoList";
import FemaleIcon from "@/assets/icons/female.svg?react";
import MaleIcon from "@/assets/icons/male.svg?react";
import White_XS from "../../components/common/Btn_Static/Text/White_XS";
import UpIcon from "@/assets/icons/arrow_up.svg?url";
import DownIcon from "@/assets/icons/arrow_down.svg?url";
import HashIcon from "@/assets/icons/hash.svg?url";
import CautionIcon from "@/assets/icons/caution.svg?url";
import { ContentCardL } from "../../components/common/contentcard/ContentCardL";
import { FloatingButton } from "../../components/common/system/FloatingButton";
import PlusIcon from "@/assets/icons/add_white.svg?url";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Grad_Mix_L from "../../components/common/Btn_Static/Text/Grad_Mix_L";
import {
  usePartyDetail,
  type PartyDetailResponse,
} from "../../api/exercise/getpartyDetail";
import { useGroupNameStore } from "../../store/useGroupNameStore";
import { getJoinParty } from "../../api/party/getJoinParty";
import api from "../../api/api";
import type { MemberJoinRequestResponse } from "../../types/memberJoinRequest";
import clsx from "clsx";

import CustomWeekly from "../../components/home/CustomWeekly";
import {
  fetchPartyCalendar,
  type CalExercise,
  type CalWeek,
  addDays as addDaysStr,
} from "../../api/exercise/getPartyCalendar";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import appIcon from "@/assets/images/app_icon.png?url";
import { generateWeeksFromRange } from "../../utils/dateUtils";
import type { Week } from "../../types/calendar";

// 오늘 YYYY-MM-DD
const todayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function uiWeeksToCalWeeks(ui: Week[]): CalWeek[] {
  return ui.map(w => ({
    weekStartDate: w.weekStartDate,
    weekEndDate: w.weekEndDate,
    days: w.days.map(d => ({
      date: d.date,
      dayOfWeek: d.dayOfWeek,
      exercises: [] as CalExercise[],
    })),
  }));
}

function calWeeksToUiWeeks(
  cal: CalWeek[],
  partyDetail: PartyDetailResponse,
): Week[] {
  return cal.map(w => ({
    weekStartDate: w.weekStartDate,
    weekEndDate: w.weekEndDate,
    days: w.days.map(d => ({
      date: d.date,
      dayOfWeek: d.dayOfWeek,
      exercises: d.exercises.map(ex => ({
        ...ex,

        partyId: partyDetail.partyId,
        partyName: partyDetail.partyName,
        profileImageUrl: partyDetail.partyImgUrl || "",
      })),
    })),
  }));
}

function ensureCalWeeks(startDate: string, endDate: string, weeks: CalWeek[]) {
  if (weeks && weeks.length > 0) return weeks;
  const ui = generateWeeksFromRange(startDate, endDate);
  return uiWeeksToCalWeeks(ui);
}

export const GroupHomePage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rightOffset, setRightOffset] = useState(0);
  const [plusModalOpen, setPlusModalOpen] = useState(false);
  const { groupId } = useParams();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [requestCount, setRequestCount] = useState(0);

  const [searchParams] = useSearchParams();
  const initialDateParam = searchParams.get("date");
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDateParam ?? todayStr(),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        plusModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setPlusModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [plusModalOpen]);

  useEffect(() => {
    const updateOffset = () => {
      const screenWidth = window.innerWidth;
      const contentWidth = Math.min(screenWidth, 444);
      const offset = (screenWidth - contentWidth) / 2 + 16;
      setRightOffset(offset);
    };
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  const formatActivityDays = (days?: string[] | null) =>
    Array.isArray(days) ? days.join(" ") : "";

  const toLevelString = (arr?: string[] | null) => {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    if (arr.length === 1) return `${arr[0]} 이상`;
    return `${arr[0]} ~ ${arr[arr.length - 1]}`;
  };
  const LevelBlock = ({
    female,
    male,
  }: {
    female?: string[] | null;
    male?: string[] | null;
  }) => {
    const femaleText = toLevelString(female);
    const maleText = toLevelString(male);
    if (!femaleText && !maleText) return null;
    return (
      <div className="flex flex-col gap-1">
        {femaleText && (
          <div className="flex gap-1 items-center">
            <FemaleIcon />
            <span>{femaleText}</span>
          </div>
        )}
        {maleText && (
          <div className="flex gap-1 items-center">
            <MaleIcon />
            <span>{maleText}</span>
          </div>
        )}
      </div>
    );
  };

  const { setGroupName } = useGroupNameStore();
  const { data: partyDetail, status, error } = usePartyDetail(Number(groupId));
  console.log(partyDetail);
  useEffect(() => {
    if (partyDetail?.partyName) setGroupName(partyDetail.partyName);
  }, [partyDetail?.partyName, setGroupName]);

  const isOwner =
    partyDetail?.memberRole === "party_MANAGER" ||
    partyDetail?.memberRole === "party_SUBMANAGER";
  const isJoined = partyDetail?.memberStatus === "MEMBER";
  const [hasPending, setHasPending] = useState(
    partyDetail?.hasPendingJoinRequest ?? false,
  );

  useEffect(() => {
    if (partyDetail) {
      setHasPending(partyDetail.hasPendingJoinRequest);
    }
  }, [partyDetail]);

  useEffect(() => {
    const requestMemberCount = async () => {
      if (!groupId) return;
      if (isOwner) {
        const { data } = await api.get<MemberJoinRequestResponse>(
          `/api/parties/${groupId}/join-requests?status=PENDING`,
        );
        setRequestCount(data.data.content.length);
      }
    };
    requestMemberCount();
  }, [groupId]);

  const items = useMemo(
    () => [
      {
        label: "지역",
        value: partyDetail ? `${partyDetail.addr1} / ${partyDetail.addr2}` : "",
      },
      { label: "날짜", value: formatActivityDays(partyDetail?.activityDays) },
      { label: "시간", value: partyDetail?.activityTime ?? "" },
      {
        label: "급수",
        value: partyDetail ? (
          <LevelBlock
            female={partyDetail.femaleLevel}
            male={partyDetail.maleLevel}
          />
        ) : null,
      },
      {
        label: "나이",
        value:
          partyDetail?.minBirthYear && partyDetail?.maxBirthYear
            ? `${partyDetail.minBirthYear} ~ ${partyDetail.maxBirthYear}`
            : "",
      },
      { label: "회비", value: partyDetail?.price ?? "" },
      { label: "가입비", value: partyDetail?.joinPrice ?? "" },
      { label: "지정콕", value: partyDetail?.designatedCock ?? "" },
    ],
    [partyDetail],
  );
  const visibleItems = isExpanded ? items : items.slice(0, 4);

  const [cal, setCal] = useState<{
    startDate: string;
    endDate: string;
    weeks: CalWeek[];
  } | null>(null);
  const [loadingCal, setLoadingCal] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    if (!groupId) return;
    (async () => {
      setLoadingCal(true);
      try {
        const res = await fetchPartyCalendar({
          partyId: Number(groupId),
          startDate: null,
          endDate: null,
        });
        const filledWeeks = ensureCalWeeks(
          res.startDate,
          res.endDate,
          res.weeks,
        );
        setCal({
          startDate: res.startDate,
          endDate: res.endDate,
          weeks: filledWeeks,
        });

        setSelectedDate(prev =>
          prev
            ? prev
            : todayStr() >= res.startDate && todayStr() <= res.endDate
              ? todayStr()
              : res.startDate,
        );
      } finally {
        setLoadingCal(false);
      }
    })();
  }, [groupId]);

  const exerciseDays = useMemo(() => {
    if (!cal) return [];
    const set = new Set<string>();
    cal.weeks.forEach(w =>
      w.days.forEach(d => d.exercises.length && set.add(d.date)),
    );
    return Array.from(set);
  }, [cal]);

  const selectedDayExercises: CalExercise[] = useMemo(() => {
    if (!cal) return [];
    const found = cal.weeks
      .flatMap(w => w.days)
      .find(d => d.date === selectedDate);
    return found?.exercises ?? [];
  }, [cal, selectedDate]);

  const mergeWeeks = (base: CalWeek[], incoming: CalWeek[]) => {
    const seen = new Set(base.map(w => w.weekStartDate));
    const uniq = incoming.filter(w => !seen.has(w.weekStartDate));
    return [...base, ...uniq];
  };

  const onSlideChange = async (swiper: SwiperClass) => {
    if (!cal || fetchingMore) return;
    const buffer = 1;
    const atEnd = swiper.activeIndex >= cal.weeks.length - 1 - buffer;
    const atStart = swiper.activeIndex <= buffer;

    if (atEnd) {
      setFetchingMore(true);
      try {
        const nextStart = addDaysStr(cal.endDate, 1);
        const nextEnd = addDaysStr(nextStart, 13);
        const res = await fetchPartyCalendar({
          partyId: Number(groupId),
          startDate: nextStart,
          endDate: nextEnd,
        });
        const filled = ensureCalWeeks(res.startDate, res.endDate, res.weeks);
        setCal(prev =>
          !prev
            ? { startDate: res.startDate, endDate: res.endDate, weeks: filled }
            : {
                startDate: prev.startDate,
                endDate: res.endDate,
                weeks: mergeWeeks(prev.weeks, filled),
              },
        );
      } finally {
        setFetchingMore(false);
      }
    }

    if (atStart) {
      setFetchingMore(true);
      try {
        const prevEnd = addDaysStr(cal.startDate, -1);
        const prevStart = addDaysStr(prevEnd, -13);
        const res = await fetchPartyCalendar({
          partyId: Number(groupId),
          startDate: prevStart,
          endDate: prevEnd,
        });
        const filled = ensureCalWeeks(res.startDate, res.endDate, res.weeks);

        const current = swiper.activeIndex;
        const added = filled.filter(
          w => !cal.weeks.some(x => x.weekStartDate === w.weekStartDate),
        ).length;

        setCal(prev =>
          !prev
            ? { startDate: res.startDate, endDate: res.endDate, weeks: filled }
            : {
                startDate: res.startDate,
                endDate: prev.endDate,
                weeks: mergeWeeks(filled, prev.weeks),
              },
        );

        if (added > 0) {
          setTimeout(() => swiper.slideTo(current + added, 0), 0);
        }
      } finally {
        setFetchingMore(false);
      }
    }
  };

  const processedWeeks: Week[] | null = useMemo(() => {
    if (!cal || !cal.weeks || !partyDetail) return null;

    return calWeeksToUiWeeks(cal.weeks, partyDetail);
  }, [cal, partyDetail]);

  // 가입 버튼
  const onClickJoin = async () => {
    if (groupId) {
      await getJoinParty(Number(groupId));
      setHasPending(true);
    }
  };

  // 로딩/에러
  if (status === "pending") {
    return <div className="p-4 text-gray-500">불러오는 중…</div>;
  }
  if (status === "error") {
    return (
      <div className="p-4 text-red-500">
        {(error as Error)?.message || "오류가 발생했어요."}
      </div>
    );
  }

  const onClickChat = async () => {
    try {
      const { data } = await api.post("/api/chats/direct", null, {
        params: {
          targetMemberId: partyDetail.ownerId,
        },
      });

      navigate(`/chat/personal/${data.data.chatRoomId}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-15">
      {/* 상단 소개 */}
      <div className="flex flex-col gap-3">
        <div className="flex p-3 gap-3">
          <div
            className={clsx(
              "w-30 h-30 border-hard shrink-0 overflow-hidden flex items-center",
            )}
          >
            <img src={partyDetail.partyImgUrl ?? appIcon} />
          </div>
          <div className="flex flex-col flex-1">
            <div className="body-rg-500 text-left mb-2">
              {partyDetail?.partyName}
            </div>

            <div className="flex flex-col gap-2">
              {visibleItems.map(item => (
                <GroupInfoList items={item} key={item.label} />
              ))}
            </div>

            <div className="relative z-10">
              {!isExpanded && (
                <div className="absolute bottom-8 left-0 right-0 h-16 bg-[linear-gradient(180deg,rgba(252,252,255,0)_0%,rgba(252,252,255,0.8)_50%,#FCFCFF_90%)] pointer-events-none z-0" />
              )}
              <White_XS
                label={isExpanded ? "간략하게" : "더보기"}
                icon={isExpanded ? UpIcon : DownIcon}
                onClick={() => setIsExpanded(prev => !prev)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {partyDetail?.keywords && partyDetail.keywords.length > 0 && (
          <div className="flex gap-3 overflow-x-scroll whitespace-nowrap scrollbar-hide">
            {partyDetail.keywords.map((kw: string, idx: number) => (
              <div
                className="inline-flex items-center gap-1 rounded-full py-2 pl-2.5 pr-3 border-1 border-gy-200 shadow-ds50 body-rg-500"
                key={`${kw}-${idx}`}
              >
                <img src={HashIcon} className="w-4 h-4 shrink-0" />
                <span>{kw}</span>
              </div>
            ))}
          </div>
        )}

        {partyDetail?.content && (
          <div className="w-full p-4 flex items-center gap-2 border-1 border-gr-500 border-soft">
            <img src={CautionIcon} className="size-5" />
            <div className="text-left body-rg-500">{partyDetail.content}</div>
          </div>
        )}
      </div>

      <div className="w-full h-17">
        {processedWeeks && (
          <CustomWeekly
            shadow={false}
            weeks={processedWeeks}
            selectedDate={selectedDate}
            onClick={setSelectedDate}
            exerciseDays={exerciseDays}
            initialSlide={(() => {
              const idx = processedWeeks.findIndex(w =>
                w.days.some(d => d.date === selectedDate),
              );
              return idx >= 0 ? idx : 0;
            })()}
            onSlideChange={onSlideChange}
            setSwiperRef={swiper => (swiperRef.current = swiper)}
          />
        )}
      </div>

      <div className="flex flex-col">
        {loadingCal ? (
          <div className="py-6 text-gray-500">운동을 불러오는 중…</div>
        ) : selectedDayExercises.length > 0 ? (
          selectedDayExercises.map(ex => (
            <div className="border-b-1 border-gy-200 mb-3" key={ex.exerciseId}>
              <ContentCardL
                id={ex.exerciseId}
                isUserJoined={!!isJoined}
                isGuestAllowedByOwner
                isCompleted={false}
                title={partyDetail?.partyName ?? "모임 운동"}
                date={selectedDate}
                location={ex.buildingName}
                time={`${ex.startTime} ~ ${ex.endTime}`}
                femaleLevel={ex.femaleLevel}
                maleLevel={ex.maleLevel}
                currentCount={ex.currentParticipants}
                totalCount={ex.maxCapacity}
                like={ex.isBookmarked}
                onToggleFavorite={() => {}}
                isParticipating={ex.isParticipating}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            선택한 날짜에 등록된 운동이 없어요.
          </div>
        )}
      </div>

      {isOwner && (
        <>
          {plusModalOpen && (
            <div
              ref={modalRef}
              className="fixed z-[60] w-39 bg-white border-soft shadow-ds400 flex flex-col p-1"
              style={{ right: rightOffset, bottom: "6rem" }}
            >
              <div
                className="w-full px-2 pt-1.5 pb-2.5 border-b-1 border-gy-200 body-rg-400 flex items-center"
                onClick={() => navigate(`/group/exercise/${groupId}/create`)}
              >
                운동 만들기
              </div>
              <div
                className="w-full px-2 pt-1.5 pb-2.5 border-b-1 border-gy-200 body-rg-400 flex items-center"
                onClick={() => navigate(`/group/making/member/${groupId}`)}
              >
                신규 멤버 초대하기
              </div>
              <div
                className="w-full px-2 pt-1.5 pb-2.5 flex items-center justify-between body-rg-400"
                onClick={() => navigate("member-request")}
              >
                <span>멤버 신청 관리</span>
                {requestCount > 0 && (
                  <span className="ml-2 rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                    {requestCount > 99 ? "99+" : requestCount}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="fixed z-50 bottom-8" style={{ right: rightOffset }}>
            <div className="relative">
              <FloatingButton
                size="L"
                color="green"
                icon={PlusIcon}
                onClick={() => setPlusModalOpen(true)}
              />
              {requestCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <span className="rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                    {requestCount > 99 ? "99+" : requestCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!isJoined && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 px-4">
          <Grad_Mix_L
            type="chat_question"
            label="모임 가입하기"
            onClick={onClickJoin}
            onImageClick={onClickChat}
            initialStatus={hasPending ? "disabled" : "default"}
          />
        </div>
      )}
    </div>
  );
};
