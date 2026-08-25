import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import Pen from "@/assets/icons/pen.svg";
import Reject from "@/assets/icons/reject.svg";
import type { GamePlayer } from "./mockGameBoardData";

export const courtDroppableId = (courtId: number) => `court-${courtId}`;
export const waitingDraggableId = (waitingGroupId: number) =>
  `waiting-${waitingGroupId}`;

export const PlayerBadge = ({ name, group, color }: GamePlayer) => (
  <div
    className={clsx(
      "flex h-7 w-[5.5rem] items-center justify-center gap-0.5 rounded-lg px-1.5 py-1",
      color === "pink" ? "bg-[#feecf4]" : "bg-[#e1eefe]",
    )}
  >
    <span className="body-rg-600 min-w-0 flex-1 truncate text-black">
      {name}
    </span>
    <span className="body-sm-500 shrink-0 truncate text-gy-700">{group}</span>
  </div>
);

interface CourtCardProps {
  courtId: number;
  label: string;
  timer?: string;
  players: GamePlayer[] | null;
  onComplete?: () => void;
  onReturnToWaiting?: () => void;
  onCancelGame?: () => void;
}

export const CourtCard = ({
  courtId,
  label,
  timer,
  players,
  onComplete,
  onReturnToWaiting,
  onCancelGame,
}: CourtCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressNextClick = useRef(false);
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: courtDroppableId(courtId),
  });

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
    setMenuPosition(clampMenuPosition(x, y, MENU_WIDTH, MENU_HEIGHT));
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

  if (!players) {
    return (
      <div
        ref={setDropRef}
        className={clsx(
          "flex w-[12.5rem] shrink-0 flex-col gap-2 rounded-2xl bg-white p-2 shadow-ds100 transition-colors",
          isOver && "bg-gr-100 ring-2 ring-gr-500",
        )}
      >
        <div className="flex h-6 items-center pl-1">
          <span className="body-sm-500 text-black">{label}</span>
        </div>
        <div className="flex h-16 w-full items-center justify-center rounded-lg bg-gy-50">
          <span className="body-sm-500 text-gy-700">빈 코트</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={node => {
        cardRef.current = node;
        setDropRef(node);
      }}
      className={clsx(
        "flex w-[12.5rem] shrink-0 cursor-pointer flex-col gap-2 rounded-2xl bg-white p-2 shadow-ds100 transition-colors",
        isOver && "ring-2 ring-gr-500",
      )}
      onClick={() => {
        if (suppressNextClick.current) {
          suppressNextClick.current = false;
          return;
        }
        onReturnToWaiting?.();
      }}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={clearLongPressTimer}
      onTouchMove={clearLongPressTimer}
    >
      <div className="flex h-6 items-center justify-between pl-1">
        <div className="flex items-center gap-1">
          <span className="body-sm-500 text-black">{label}</span>
          {timer && <span className="body-sm-500 text-gr-700">{timer}</span>}
        </div>
        <button
          type="button"
          className="rounded-lg bg-gy-100 px-2 py-1 body-sm-400 text-rd-500"
          onClick={e => {
            e.stopPropagation();
            onComplete?.();
          }}
        >
          완료
        </button>
      </div>
      <div className="flex flex-wrap justify-between gap-y-2">
        {players.map(p => (
          <PlayerBadge key={p.id} {...p} />
        ))}
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
                onReturnToWaiting?.();
              }}
            >
              대기로 되돌리기
            </button>
            <div className="my-1 h-px w-full bg-gy-100" />
            <button
              type="button"
              className="flex h-8 w-[9.3125rem] items-center justify-start rounded-lg px-2 py-1.5 body-rg-400 text-rd-500 hover:bg-gy-100"
              onClick={() => {
                setIsMenuOpen(false);
                onCancelGame?.();
              }}
            >
              경기 취소
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
};

interface WaitingCardProps {
  waitingGroupId: number;
  label: string;
  players: GamePlayer[];
  courts: { id: number; label: string }[];
  onMoveToCourt?: (courtId: number) => void;
  onChange?: () => void;
  onReject?: () => void;
}

const LONG_PRESS_MS = 600;
const MENU_WIDTH = 149;
const MENU_HEIGHT = 84;
const MENU_EDGE_MARGIN = 8;

const clampMenuPosition = (
  x: number,
  y: number,
  width: number,
  height: number,
) => ({
  left: Math.min(
    Math.max(x - width, MENU_EDGE_MARGIN),
    window.innerWidth - width - MENU_EDGE_MARGIN,
  ),
  top: Math.min(
    Math.max(y, MENU_EDGE_MARGIN),
    window.innerHeight - height - MENU_EDGE_MARGIN,
  ),
});

export const WaitingCard = ({
  waitingGroupId,
  label,
  players,
  courts,
  onMoveToCourt,
  onChange,
  onReject,
}: WaitingCardProps) => {
  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({ id: waitingDraggableId(waitingGroupId) });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [clickPoint, setClickPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !cardRef.current?.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // 코트 개수에 따라 메뉴 높이가 달라지므로 렌더된 실제 크기를 측정해 위치를 보정한다.
  // clickPoint는 openMenuAt마다 새 객체로 갱신되어, 메뉴가 이미 열려 있는 상태에서
  // 같은 카드를 다시 우클릭/롱프레스해도 이 effect가 다시 실행된다.
  useLayoutEffect(() => {
    if (!isMenuOpen || !clickPoint || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const corrected = clampMenuPosition(
      clickPoint.x,
      clickPoint.y,
      rect.width,
      rect.height,
    );
    setMenuPosition(prev =>
      prev.top === corrected.top && prev.left === corrected.left
        ? prev
        : corrected,
    );
  }, [isMenuOpen, clickPoint, courts.length]);

  const openMenuAt = (x: number, y: number) => {
    setClickPoint({ x, y });
    setMenuPosition(clampMenuPosition(x, y, MENU_WIDTH, 0));
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
      ref={node => {
        cardRef.current = node;
        setDragRef(node);
      }}
      className={clsx(
        "flex w-[12.5rem] shrink-0 touch-pan-x flex-col gap-2 rounded-2xl bg-white p-2 shadow-ds100",
        isDragging && "opacity-40",
      )}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={clearLongPressTimer}
      onTouchMove={clearLongPressTimer}
      {...dragAttributes}
      {...dragListeners}
    >
      <div className="flex h-6 items-center justify-between pl-1">
        <span className="body-sm-500 text-black">{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex size-6 items-center justify-center rounded-lg bg-gy-100"
            onClick={onChange}
            onTouchStart={e => e.stopPropagation()}
            onContextMenu={e => e.stopPropagation()}
          >
            <img src={Pen} alt="변경" className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-6 items-center justify-center rounded-lg bg-gy-100"
            onClick={onReject}
            onTouchStart={e => e.stopPropagation()}
            onContextMenu={e => e.stopPropagation()}
          >
            <img src={Reject} alt="삭제" className="size-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-y-2">
        {players.map(p => (
          <PlayerBadge key={p.id} {...p} />
        ))}
      </div>

      {isMenuOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: menuPosition.top, left: menuPosition.left }}
            className="fixed z-50 flex flex-col items-start rounded-xl bg-white p-1 shadow-ds400"
          >
            {courts.map((court, index) => (
              <div key={court.id} className="flex w-full flex-col items-start">
                {index > 0 && <div className="my-1 h-px w-full bg-gy-100" />}
                <button
                  type="button"
                  className="flex h-8 w-[9.3125rem] items-center justify-start rounded-lg px-2 py-1.5 body-rg-400 text-black hover:bg-gy-100"
                  onClick={() => {
                    onMoveToCourt?.(court.id);
                    setIsMenuOpen(false);
                  }}
                >
                  {court.label}로 이동
                </button>
              </div>
            ))}
            <div className="my-1 h-px w-full bg-gy-100" />
            <button
              type="button"
              className="flex h-8 w-[9.3125rem] items-center justify-start rounded-lg px-2 py-1.5 body-rg-400 text-black hover:bg-gy-100"
              onClick={() => {
                setIsMenuOpen(false);
                onChange?.();
              }}
            >
              변경
            </button>
            <button
              type="button"
              className="flex h-8 w-[9.3125rem] items-center justify-start rounded-lg px-2 py-1.5 body-rg-400 text-rd-500 hover:bg-gy-100"
              onClick={() => {
                setIsMenuOpen(false);
                onReject?.();
              }}
            >
              취소
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
};
