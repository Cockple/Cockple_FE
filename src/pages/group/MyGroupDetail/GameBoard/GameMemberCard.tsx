import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import DefaultProfile from "@/assets/images/base_profile_img.png";
import Female from "@/assets/icons/female.svg";
import Male from "@/assets/icons/male.svg";
import CircleS from "@/assets/icons/circle_s.svg";
import Exercise from "@/assets/icons/Exercise.svg";
import ExerciseFilled from "@/assets/icons/Exercise_filled.svg";
import type { GameMember, MemberTag } from "./mockGameBoardData";

const TAG_STYLE: Record<MemberTag, string> = {
  운동: "bg-gr-100 text-gr-700",
  대기: "bg-[#fff4d2] text-[#d96303]",
  미참: "bg-gy-100 text-gy-700",
};

const LONG_PRESS_MS = 600;
const MENU_WIDTH = 149;
const MENU_HEIGHT = 84;
const MENU_EDGE_MARGIN = 8;

interface GameMemberCardProps {
  member: GameMember;
  selected: boolean;
  onToggleSelect: () => void;
  onEditInfo?: () => void;
  onToggleParticipation?: () => void;
}

export const GameMemberCard = ({
  member,
  selected,
  onToggleSelect,
  onEditInfo,
  onToggleParticipation,
}: GameMemberCardProps) => {
  const {
    name,
    gender,
    ageGroup,
    group,
    playCount,
    tags,
    imgUrl,
    selectable,
    shuttlecockSubmitted,
  } = member;
  const isWithdrawn = tags.includes("미참");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressNextClick = useRef(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (cardRef.current?.contains(e.target as Node)) {
          suppressNextClick.current = true;
        }
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const openMenuAt = (x: number, y: number) => {
    const left = Math.min(
      Math.max(x - MENU_WIDTH, MENU_EDGE_MARGIN),
      window.innerWidth - MENU_WIDTH - MENU_EDGE_MARGIN,
    );
    const top = Math.min(
      Math.max(y, MENU_EDGE_MARGIN),
      window.innerHeight - MENU_HEIGHT - MENU_EDGE_MARGIN,
    );
    setMenuPosition({ top, left });
    setIsMenuOpen(true);
  };

  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleContextMenu = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    openMenuAt(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    clearLongPressTimer();
    longPressTimer.current = setTimeout(() => {
      openMenuAt(touch.clientX, touch.clientY);
    }, LONG_PRESS_MS);
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={selectable ? 0 : -1}
      onClick={() => {
        if (suppressNextClick.current) {
          suppressNextClick.current = false;
          return;
        }
        if (selectable) onToggleSelect();
      }}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={clearLongPressTimer}
      onTouchMove={clearLongPressTimer}
      className={clsx(
        "flex w-[10.3125rem] flex-col gap-2 rounded-2xl p-2 text-left",
        selectable ? "cursor-pointer" : "cursor-default",
        isWithdrawn
          ? "bg-gy-100 opacity-50 shadow-ds100"
          : selected
            ? "bg-[#f1f9f3] shadow-ds200-gr"
            : "bg-white shadow-ds100",
      )}
    >
      <div className="flex h-6 items-center justify-between pl-1">
        <div className="flex items-start gap-1">
          {tags.map(tag => (
            <span
              key={tag}
              className={clsx(
                "flex items-center justify-center rounded-lg px-1 py-0.5 body-sm-500",
                TAG_STYLE[tag],
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="flex items-center justify-center rounded-lg bg-gy-100 px-1 py-0.5 body-sm-500 text-gy-700">
          {playCount}회
        </span>
      </div>

      <div className="flex items-center gap-2">
        <img
          src={imgUrl ?? DefaultProfile}
          alt={`${name} 프로필`}
          className={clsx(
            "size-6 rounded-full object-cover",
            isWithdrawn && "opacity-20",
          )}
        />
        <span className="header-h5 truncate text-black">{name}</span>
      </div>

      <div className="flex items-center justify-center gap-1">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          {gender && (
            <img
              src={gender === "FEMALE" ? Female : Male}
              alt=""
              className="size-4 shrink-0"
            />
          )}
          <span className="body-sm-500 text-black">{group}</span>
          <img src={CircleS} alt="" className="size-2 shrink-0" />
          <span className="body-sm-500 whitespace-nowrap text-black">
            {ageGroup}
          </span>
        </div>
        <span
          className={clsx(
            "flex size-6 shrink-0 items-center justify-center rounded-lg p-1",
            selectable ? "bg-white/50" : "bg-transparent",
          )}
        >
          <img
            src={shuttlecockSubmitted ? ExerciseFilled : Exercise}
            alt={shuttlecockSubmitted ? "셔틀콕 제출함" : "셔틀콕 미제출"}
            className="size-4"
          />
        </span>
      </div>

      {isMenuOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: menuPosition.top, left: menuPosition.left }}
            className="fixed z-50 flex flex-col items-start rounded-xl bg-white p-1 shadow-ds400"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="flex h-8 w-[9.3125rem] items-center justify-start rounded-lg px-2 py-1.5 body-rg-400 text-black hover:bg-gy-100"
              onClick={() => {
                setIsMenuOpen(false);
                onEditInfo?.();
              }}
            >
              정보 수정
            </button>
            <div className="my-1 h-px w-full bg-gy-100" />
            <button
              type="button"
              className="flex h-8 w-[9.3125rem] items-center justify-start rounded-lg px-2 py-1.5 body-rg-400 text-rd-500 hover:bg-gy-100"
              onClick={() => {
                setIsMenuOpen(false);
                onToggleParticipation?.();
              }}
            >
              {isWithdrawn ? "참여로 변경" : "미참여로 변경"}
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
};
