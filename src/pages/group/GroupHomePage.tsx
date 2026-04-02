import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ContentCardL } from "@/components/common/contentcard/ContentCardL";
import { GroupInfoSection } from "@/components/group/home/GroupInfoSection";
import { GroupOwnerActions } from "@/components/group/home/GroupOwnerActions";
import CustomWeekly from "@/components/home/CustomWeekly";
import { usePartyDetail } from "@/api/exercise/getpartyDetail";
import { useGroupNameStore } from "@/store/useGroupNameStore";
import { usePartyMembershipStore } from "@/store/usePartyMembershipStore";
import api from "@/api/api";
import type { MemberJoinRequestResponse } from "@/types/memberJoinRequest";
import { useGroupCalendar } from "@/hooks/useGroupCalendar";
import "swiper/css";

export const GroupHomePage = () => {
  const { groupId } = useParams();
  const [requestCount, setRequestCount] = useState(0);

  const [searchParams] = useSearchParams();
  const initialDateParam = searchParams.get("date") ?? undefined;

  const { setGroupName } = useGroupNameStore();
  const { data: partyDetail, status, error } = usePartyDetail(Number(groupId));

  const isOwner =
    partyDetail?.memberRole === "PARTY_MANAGER" ||
    partyDetail?.memberRole === "PARTY_SUBMANAGER";
  const isJoined = partyDetail?.memberStatus === "MEMBER";

  useEffect(() => {
    if (partyDetail?.partyName) setGroupName(partyDetail.partyName);
  }, [partyDetail?.partyName, setGroupName]);

  useEffect(() => {
    if (partyDetail) {
      usePartyMembershipStore.getState().setMembershipInfo({
        memberStatus: partyDetail.memberStatus,
        memberRole: partyDetail.memberRole,
        hasPendingJoinRequest: partyDetail.hasPendingJoinRequest,
      });
    }
  }, [partyDetail]);

  useEffect(() => {
    if (!groupId || !isOwner) return;
    const requestMemberCount = async () => {
      const { data } = await api.get<MemberJoinRequestResponse>(
        `/api/parties/${groupId}/join-requests?status=PENDING`,
      );
      setRequestCount(data.data.content.length);
    };
    requestMemberCount();
  }, [groupId, isOwner]);

  const {
    selectedDate,
    setSelectedDate,
    loadingCal,
    exerciseDays,
    selectedDayExercises,
    onSlideChange,
    swiperRef,
    processedWeeks,
  } = useGroupCalendar(groupId, partyDetail, initialDateParam);

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

  return (
    <div className="flex flex-col gap-8 pb-15">
      <GroupInfoSection partyDetail={partyDetail} />

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
          selectedDayExercises.map(ex => {
            const exerciseEnd = new Date(`${selectedDate}T${ex.startTime}`);
            const now = new Date();
            const isCompleted = exerciseEnd < now;
            return (
              <div
                className="border-b-1 border-gy-200 mb-3"
                key={ex.exerciseId}
              >
                <ContentCardL
                  id={ex.exerciseId}
                  isUserJoined={!!isJoined}
                  isGuestAllowedByOwner
                  isCompleted={isCompleted}
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
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500">
            선택한 날짜에 등록된 운동이 없어요.
          </div>
        )}
      </div>

      {isOwner && groupId && (
        <GroupOwnerActions groupId={groupId} requestCount={requestCount} />
      )}
    </div>
  );
};
