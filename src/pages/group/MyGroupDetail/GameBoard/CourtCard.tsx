import clsx from "clsx";
import Pen from "@/assets/icons/pen.svg";
import Reject from "@/assets/icons/reject.svg";
import type { GamePlayer } from "./mockGameBoardData";

const PlayerBadge = ({ name, group, color }: GamePlayer) => (
  <div
    className={clsx(
      "flex gap-0.5 h-7 w-[5.5rem] items-center justify-center rounded-lg px-1.5 py-1",
      color === "pink" ? "bg-[#feecf4]" : "bg-[#e1eefe]",
    )}
  >
    <span className="body-rg-600 text-black">{name}</span>
    <span className="body-sm-500 text-gy-700">{group}</span>
  </div>
);

interface CourtCardProps {
  label: string;
  timer?: string;
  players: GamePlayer[] | null;
  onComplete?: () => void;
}

export const CourtCard = ({
  label,
  timer,
  players,
  onComplete,
}: CourtCardProps) => {
  if (!players) {
    return (
      <div className="flex w-[12.5rem] shrink-0 flex-col gap-2 rounded-2xl bg-white p-2 shadow-ds100">
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
    <div className="flex w-[12.5rem] shrink-0 cursor-pointer flex-col gap-2 rounded-2xl bg-white p-2 shadow-ds100">
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
    </div>
  );
};

interface WaitingCardProps {
  label: string;
  players: GamePlayer[];
  onEdit?: () => void;
  onReject?: () => void;
}

export const WaitingCard = ({
  label,
  players,
  onEdit,
  onReject,
}: WaitingCardProps) => (
  <div className="flex w-[12.5rem] shrink-0 flex-col gap-2 rounded-2xl bg-white p-2 shadow-ds100">
    <div className="flex h-6 items-center justify-between pl-1">
      <span className="body-sm-500 text-black">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex size-6 items-center justify-center rounded-lg bg-gy-100"
          onClick={onEdit}
        >
          <img src={Pen} alt="수정" className="size-4" />
        </button>
        <button
          type="button"
          className="flex size-6 items-center justify-center rounded-lg bg-gy-100"
          onClick={onReject}
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
  </div>
);
