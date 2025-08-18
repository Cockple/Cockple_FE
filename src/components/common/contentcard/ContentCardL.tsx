import { useEffect, useState } from "react";
import Calendar from "../../../assets/icons/calendar.svg?react";
import Clock from "../../../assets/icons/clock.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import People from "../../../assets/icons/people.svg?react";
import Vector from "../../../assets/icons/Vector.svg?react";
import RightAngle from "../../../assets/icons/arrow_right.svg?react";
import RD500_S_Icon from "../Btn_Static/Icon_Btn/RD500_S_Icon";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bookmarkExercise,
  unbookmarkExercise,
} from "../../../api/bookmark/bookmark";
import {
  joinExercise,
  cancelExercise,
} from "../../../api/exercise/exerciseApi";
import CautionExerciseModals from "../../like/CautionExerciseModal";

interface ContentCardLProps {
  id: number;
  isUserJoined: boolean;
  isGuestAllowedByOwner: boolean;
  isCompleted: boolean; // 참여 완료일때 버튼X
  title: string;
  date: string;
  location: string;
  time: string;
  femaleLevel: string[];
  maleLevel: string[];
  currentCount: number;
  totalCount: number;
  like?: boolean;
  LikeCount?: number;
  onToggleFavorite?: (id: number) => void;
  isParticipating?: boolean;
}
export type { ContentCardLProps };

export const ContentCardL = ({
  id,
  isUserJoined,
  isGuestAllowedByOwner,
  isCompleted,
  title,
  date,
  location,
  time,
  femaleLevel,
  maleLevel,
  currentCount,
  totalCount,
  like = false,
  LikeCount,
  onToggleFavorite,
  isParticipating,
}: ContentCardLProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isStarted, setIsStarted] = useState(isParticipating);
  const [isStartPressing, setIsStartPressing] = useState(false);
  const [isGuestPressing, setIsGuestPressing] = useState(false);
  const [current, setCurrent] = useState(currentCount);

  const showGuestButton = isUserJoined && isGuestAllowedByOwner;
  const containerPressed = isStartPressing || isGuestPressing;
  const [showFavoriteLimitModal, setShowFavoriteLimitModal] = useState(false); //운동 50개 넘어가면 모달창
  //const queryClient = useQueryClient();
  const [favorite, setFavorite] = useState(like);
  const [isLoading, setIsLoading] = useState(false);

  const loca = useLocation();

  useEffect(() => {
    setFavorite(like);
  }, [like]);

  const bookmarkMutation = useMutation({
    mutationFn: bookmarkExercise,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["exerciseBookmarks"] });
    // },
    // onError: () => {
    //   setFavorite(false); // rollback
    // },
  });

  const unbookmarkMutation = useMutation({
    mutationFn: unbookmarkExercise,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["exerciseBookmarks"] });
    // },
    // onError: () => {
    //   setFavorite(true); // rollback
    // },
  });

  const handleToggleFavorite = () => {
    if (!favorite && (LikeCount ?? 0) >= 50) {
      setShowFavoriteLimitModal(true);
      return;
    }

    const newFavorite = !favorite;
    setFavorite(newFavorite);
    onToggleFavorite?.(id);

    if (newFavorite) {
      bookmarkMutation.mutate(id);
    } else {
      unbookmarkMutation.mutate(id);
    }
  };

  function getDayOfWeek(dateString: string): string {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dateObj = new Date(dateString);
    return days[dateObj.getDay()];
  }
  const day = getDayOfWeek(date);

  const handleJoin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const originalIsJoined = isStarted;
    setIsStarted(!originalIsJoined);

    try {
      if (!originalIsJoined) {
        await joinExercise(id);
        setCurrent(current + 1);
      } else {
        await cancelExercise(id);
        setCurrent(current - 1);
      }
      await queryClient.invalidateQueries({ queryKey: ["partyCalendar"] });
      await queryClient.invalidateQueries({ queryKey: ["partyDetail"] });
    } catch (err) {
      console.log("운동 신청, 취소 오류: ", err);
      setIsStarted(originalIsJoined);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-full rounded-[1rem] p-3 mb-3 space-y-3 transition-colors duration-150
        ${containerPressed ? "bg-[#F4F5F6]" : "bg-white"} shadow-ds100`}
    >
      {/* 상단 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-[16rem]">
          <p className="body-md-500 truncate">{title}</p>
          <RD500_S_Icon
            isActive={favorite}
            onClick={() => handleToggleFavorite()}
          />
        </div>
        <RightAngle
          className="w-4 h-4"
          // onClick={() => navigate(`/group/Mygroup/MyExerciseDetail/${id}`)}

          onClick={() =>
            navigate(
              `/group/Mygroup/MyExerciseDetail/${id}?returnPath=${loca.pathname}`,
            )
          }
        />
      </div>

      {/* 정보 */}
      <div className="flex flex-col gap-[0.375rem] text-black body-sm-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-[0.875rem] h-[0.875rem]" />
          <span>{`${date} (${day})`}</span>
        </div>
        <div className="flex items-center gap-1">
          <Vector className="w-[0.875rem] h-[0.875rem]" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-[0.875rem] h-[0.875rem]" />
          <span>{time}</span>
        </div>

        <div className="w-[19.9375rem] flex gap-[0.8125rem]">
          <div className="flex items-center gap-1 w-[9rem] truncate">
            <Female className="w-[0.875rem] h-[0.875rem] shrink-0" />
            <span className="truncate">{femaleLevel}</span>
          </div>
          <div className="flex items-center gap-1 w-[9rem] truncate">
            <Male className="w-[0.875rem] h-[0.875rem] shrink-0" />
            <span className="truncate">{maleLevel}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <People className="w-[0.875rem] h-[0.875rem]" />
          <span>{`${current} / ${totalCount}`}</span>
        </div>
      </div>

      {/* 버튼 */}
      {!isCompleted && (
        <div
          className={`flex ${showGuestButton ? "gap-[0.8125rem]" : ""} w-[19.9375rem]`}
        >
          <button
            onClick={handleJoin}
            onMouseDown={() => setIsStartPressing(true)}
            onMouseUp={() => setIsStartPressing(false)}
            onMouseLeave={() => setIsStartPressing(false)}
            onTouchStart={() => setIsStartPressing(true)}
            onTouchEnd={() => setIsStartPressing(false)}
            className={`h-[2.25rem] rounded body-rg-500 
              bg-[#F4F5F6] transition-colors duration-150
              ${showGuestButton ? "w-[9.5625rem]" : "w-[19.9375rem]"}
              ${isStarted ? "text-red-500" : "text-[#0B9A4E]"}`}
          >
            {isStarted ? "운동 취소하기" : "운동 시작하기"}
          </button>

          {showGuestButton && (
            <button
              onMouseDown={() => setIsGuestPressing(true)}
              onMouseUp={() => setIsGuestPressing(false)}
              onMouseLeave={() => setIsGuestPressing(false)}
              onTouchStart={() => setIsGuestPressing(true)}
              onTouchEnd={() => setIsGuestPressing(false)}
              className="w-[9.5625rem] h-[2.25rem] rounded bg-[#F4F5F6] body-rg-500 text-black transition-colors duration-150"
              onClick={() => navigate(`/group/inviteGuest/${id}`)}
            >
              게스트 초대하기
            </button>
          )}
        </div>
      )}
      {showFavoriteLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <CautionExerciseModals
            onClose={() => setShowFavoriteLimitModal(false)}
            onApprove={() => {
              setShowFavoriteLimitModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
};
