import { useState, useEffect } from "react";
import Calendar from "../../../assets/icons/calendar.svg?react";
import Clock from "../../../assets/icons/clock.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import People from "../../../assets/icons/people.svg?react";
import Vector from "../../../assets/icons/Vector.svg?react";
import RightAngle from "../../../assets/icons/arrow_right.svg?react";
import RD500_S_Icon from "../Btn_Static/Icon_Btn/RD500_S_Icon";
import { useNavigate } from "react-router-dom";
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
  femaleLevel: string;
  maleLevel: string;
  currentCount: number;
  totalCount: number;
  like?: boolean;
  LikeCount?: number; 
  onToggleFavorite?: (id: number) => void;
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
}: ContentCardLProps) => {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [isStartPressing, setIsStartPressing] = useState(false);
  const [isGuestPressing, setIsGuestPressing] = useState(false);

  const showGuestButton = isUserJoined && isGuestAllowedByOwner;
  const containerPressed = isStartPressing || isGuestPressing;
  const [showFavoriteLimitModal, setShowFavoriteLimitModal] = useState(false); //운동 50개 넘어가면 모달창
  const [favorite, setFavorite] = useState(like);

  const handleToggleFavorite = () => {
    if (!favorite && (LikeCount ?? 0) >= 50) {
      setShowFavoriteLimitModal(true);
      return;
    }

    const newFavorite = !favorite;
    setFavorite(newFavorite);
    onToggleFavorite?.(id);
  };


  function getDayOfWeek(dateString: string): string {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dateObj = new Date(dateString);
    return days[dateObj.getDay()];
  }
  const day = getDayOfWeek(date);

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
          onClick={() => navigate("/group/Mygroup/MyExerciseDetail")}
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
          <span>{`${currentCount} / ${totalCount}`}</span>
        </div>
      </div>

      {/* 버튼 */}
      {!isCompleted && (
        <div
          className={`flex ${showGuestButton ? "gap-[0.8125rem]" : ""} w-[19.9375rem]`}
        >
          <button
            onClick={() => setIsStarted(prev => !prev)}
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
              onClick={() => navigate("/group/detail/inviteGuest")}
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
