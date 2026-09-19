import { useEffect, useState } from "react";
import DefaultProfile from "@/assets/images/base_profile_img.png";
import GR400_L from "@/components/common/Btn_Static/Text/GR400_L";
import GR400_M from "@/components/common/Btn_Static/Text/GR400_M";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { getGameDuplicateCheck } from "@/api/game/duplicateCheck";
import {
  getMatchupKey,
  type GameMember,
  type MatchupInfo,
  type MatchupType,
} from "./mockGameBoardData";

const LEGEND_ITEMS: {
  type: MatchupType;
  label: string;
  dotClass: string;
  textClass: string;
}[] = [
  {
    type: "recent",
    label: "직전 경기",
    dotClass: "bg-rd-500",
    textClass: "text-rd-500",
  },
  {
    type: "first",
    label: "첫 경기",
    dotClass: "bg-gy-500",
    textClass: "text-gy-700",
  },
  {
    type: "previous",
    label: "이전 경기",
    dotClass: "bg-gr-700",
    textClass: "text-gr-700",
  },
];

const MATCHUP_BADGE_STYLE: Record<MatchupType, string> = {
  recent: "border border-rd-500 shadow-[0_0_4px_rgba(246,45,45,0.16)]",
  previous: "border border-gr-500 shadow-[0_0_4px_rgba(26,187,101,0.16)]",
  first: "shadow-[0_0_8px_rgba(18,18,18,0.16)]",
};

const MATCHUP_LINE_COLOR: Record<MatchupType, string> = {
  recent: "#F62D2D",
  previous: "#1ABB65",
  first: "#E4E7EA",
};

interface MatchBadgeProps {
  className?: string;
  info: { count: number; type: MatchupType };
}

const MatchBadge = ({ className, info }: MatchBadgeProps) => (
  <div
    className={`flex size-8 items-center justify-center rounded-full bg-white header-h5 text-black ${MATCHUP_BADGE_STYLE[info.type]} ${className ?? ""}`}
  >
    {info.count}
  </div>
);

const Avatar = ({ member }: { member: GameMember }) => (
  <img
    src={member.imgUrl ?? DefaultProfile}
    alt={`${member.name} 프로필`}
    className="size-10 shrink-0 rounded-full object-cover"
  />
);

// 정확히 4명 선택 시, 4명이 이루는 다이아몬드 대진 관계(변 4개 + 대각선 2개 = 총 6쌍)를 그대로 시각화한다.
const DiamondMatchup = ({
  members,
  matchups,
}: {
  members: GameMember[];
  matchups: Map<string, MatchupInfo>;
}) => {
  const [topLeft, bottomLeft, topRight, bottomRight] = members;
  const infoFor = (a: GameMember, b: GameMember) =>
    matchups.get(getMatchupKey(a.id, b.id)) ?? {
      count: 0,
      type: "first" as const,
    };

  return (
    <div className="relative h-[18.75rem] w-full rounded-2xl bg-gy-50">
      {/* overflow-visible: 외곽 4개 선이 viewBox 경계(0/160)에 걸쳐 있어 기본 clip 시
          stroke의 절반이 잘려 대각선보다 얇게 보이므로, 잘리지 않도록 노출한다. */}
      <svg
        className="absolute left-[5.75rem] top-[4.375rem] size-40 overflow-visible"
        viewBox="0 0 160 160"
        fill="none"
      >
        <line
          x1="0"
          y1="0"
          x2="160"
          y2="0"
          stroke={MATCHUP_LINE_COLOR[infoFor(topLeft, topRight).type]}
          strokeWidth="3"
        />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="160"
          stroke={MATCHUP_LINE_COLOR[infoFor(topLeft, bottomLeft).type]}
          strokeWidth="3"
        />
        <line
          x1="160"
          y1="0"
          x2="160"
          y2="160"
          stroke={MATCHUP_LINE_COLOR[infoFor(topRight, bottomRight).type]}
          strokeWidth="3"
        />
        <line
          x1="0"
          y1="160"
          x2="160"
          y2="160"
          stroke={MATCHUP_LINE_COLOR[infoFor(bottomLeft, bottomRight).type]}
          strokeWidth="3"
        />
        <line
          x1="0"
          y1="0"
          x2="160"
          y2="160"
          stroke={MATCHUP_LINE_COLOR[infoFor(topLeft, bottomRight).type]}
          strokeWidth="3"
        />
        <line
          x1="160"
          y1="0"
          x2="0"
          y2="160"
          stroke={MATCHUP_LINE_COLOR[infoFor(topRight, bottomLeft).type]}
          strokeWidth="3"
        />
      </svg>

      {/* 노드는 아바타 폭(w-10)으로 고정해 그리드 꼭짓점(x=92/252)에 정확히 중앙 정렬한다.
          이름은 whitespace-nowrap으로 양옆 대칭 오버플로우시켜 아바타 위치에 영향을 주지 않게 한다. */}
      <div className="absolute left-[4.5rem] top-[1.4375rem] flex w-10 flex-col items-center gap-1">
        <span className="header-h5 whitespace-nowrap text-black">
          {topLeft.name}
        </span>
        <Avatar member={topLeft} />
      </div>
      <div className="absolute left-[4.5rem] top-[13.0625rem] flex w-10 flex-col items-center gap-1">
        <Avatar member={bottomLeft} />
        <span className="header-h5 whitespace-nowrap text-black">
          {bottomLeft.name}
        </span>
      </div>
      <div className="absolute left-[14.5rem] top-[1.4375rem] flex w-10 flex-col items-center gap-1">
        <span className="header-h5 whitespace-nowrap text-black">
          {topRight.name}
        </span>
        <Avatar member={topRight} />
      </div>
      <div className="absolute left-[14.5rem] top-[13.0625rem] flex w-10 flex-col items-center gap-1">
        <Avatar member={bottomRight} />
        <span className="header-h5 whitespace-nowrap text-black">
          {bottomRight.name}
        </span>
      </div>

      <MatchBadge
        className="absolute left-[9.75rem] top-[3.375rem]"
        info={infoFor(topLeft, topRight)}
      />
      <MatchBadge
        className="absolute left-[4.75rem] top-[8.375rem]"
        info={infoFor(topLeft, bottomLeft)}
      />
      <MatchBadge
        className="absolute left-[14.75rem] top-[8.375rem]"
        info={infoFor(topRight, bottomRight)}
      />
      <MatchBadge
        className="absolute left-[9.75rem] top-[13.375rem]"
        info={infoFor(bottomLeft, bottomRight)}
      />
      <MatchBadge
        className="absolute left-[11.75rem] top-[10.375rem]"
        info={infoFor(topLeft, bottomRight)}
      />
      <MatchBadge
        className="absolute left-[11.75rem] top-[6.375rem]"
        info={infoFor(topRight, bottomLeft)}
      />
    </div>
  );
};

// 4명이 아닌 인원수(1~3명, 5명 이상)에서는 다이아몬드 도형이 성립하지 않으므로,
// 동일한 배지 색 규칙을 유지하는 쌍별 리스트로 대체한다.
const PairListMatchup = ({
  members,
  matchups,
}: {
  members: GameMember[];
  matchups: Map<string, MatchupInfo>;
}) => {
  const pairs: [GameMember, GameMember][] = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      pairs.push([members[i], members[j]]);
    }
  }

  if (pairs.length === 0) {
    return (
      <div className="flex h-[18.75rem] w-full items-center justify-center rounded-2xl bg-gy-50">
        <span className="body-rg-500 text-gy-700">비교할 상대가 없어요.</span>
      </div>
    );
  }

  return (
    <div className="flex max-h-[18.75rem] w-full flex-col gap-7 overflow-y-auto rounded-2xl bg-gy-50 px-3 pb-3 pt-8">
      {pairs.map(([a, b]) => {
        const info = matchups.get(getMatchupKey(a.id, b.id)) ?? {
          count: 0,
          type: "first" as const,
        };
        return (
          <div
            key={getMatchupKey(a.id, b.id)}
            className="flex w-full items-center justify-center"
          >
            <div className="relative shrink-0">
              <span className="header-h5 absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap text-black">
                {a.name}
              </span>
              <Avatar member={a} />
            </div>
            <div
              className="h-[3px] w-11"
              style={{ backgroundColor: MATCHUP_LINE_COLOR[info.type] }}
            />
            <MatchBadge info={info} />
            <div
              className="h-[3px] w-11"
              style={{ backgroundColor: MATCHUP_LINE_COLOR[info.type] }}
            />
            <div className="relative shrink-0">
              <span className="header-h5 absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap text-black">
                {b.name}
              </span>
              <Avatar member={b} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface GameDuplicateCheckModalProps {
  variant?: "sheet" | "overlay";
  gameBoardId: number;
  members: GameMember[];
  onClose: () => void;
  onConfirm: () => void;
}

const deriveMatchupType = (
  count: number,
  playedInLastGame: boolean,
): MatchupType =>
  playedInLastGame ? "recent" : count === 0 ? "first" : "previous";

export const GameDuplicateCheckModal = ({
  variant = "sheet",
  gameBoardId,
  members,
  onClose,
  onConfirm,
}: GameDuplicateCheckModalProps) => {
  useLockBodyScroll(true);
  const isOverlay = variant === "overlay";

  const [matchups, setMatchups] = useState<Map<string, MatchupInfo> | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    setMatchups(null);
    getGameDuplicateCheck(
      gameBoardId,
      members.map(m => m.id),
    ).then(res => {
      if (!active) return;
      const next = new Map<string, MatchupInfo>();
      res.pairs.forEach(p => {
        next.set(getMatchupKey(p.memberIdA, p.memberIdB), {
          count: p.count,
          type: deriveMatchupType(p.count, p.playedInLastGame),
        });
      });
      setMatchups(next);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameBoardId, members.map(m => m.id).join(",")]);

  const content = (
    <>
      <span className="header-h5 text-black">게임 중복 체크</span>

      <div className="flex w-full items-center justify-between px-3">
        <div className="flex w-[11.125rem] shrink-0 flex-col gap-0.5 text-left text-black">
          <span className="body-rg-500">이 조합, 얼마나 겹쳤을까요?</span>
          <span className="body-sm-400 text-gy-700">
            선수들이 이전에 서로 경기한 횟수에요.
          </span>
        </div>
        <div className="flex w-[6.875rem] shrink-0 flex-wrap items-center gap-x-2 gap-y-0.5">
          {LEGEND_ITEMS.map(item => (
            <div key={item.type} className="flex items-center gap-1">
              <span className={`size-2 rounded-full ${item.dotClass}`} />
              <span className={`body-sm-400 ${item.textClass}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {matchups === null ? (
        <div className="flex h-[18.75rem] w-full items-center justify-center rounded-2xl bg-gy-50">
          <span className="body-rg-500 text-gy-700">불러오는 중이에요...</span>
        </div>
      ) : members.length === 4 ? (
        <DiamondMatchup members={members} matchups={matchups} />
      ) : (
        <PairListMatchup members={members} matchups={matchups} />
      )}

      {isOverlay ? (
        <GR400_M label="대기열 추가" onClick={onConfirm} />
      ) : (
        <GR400_L label="대기열 추가" onClick={onConfirm} />
      )}
    </>
  );

  if (isOverlay) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
        onClick={onClose}
      >
        <div
          className="flex w-full max-w-[23.4375rem] flex-col items-center gap-5 rounded-3xl bg-white p-4"
          onClick={e => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-1/2 z-50 h-full w-full max-w-[444px] -translate-x-1/2 bg-black/20"
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 left-1/2 flex w-full max-w-[444px] -translate-x-1/2 flex-col items-center gap-5 rounded-t-3xl bg-white px-4 pb-10 pt-4"
        onClick={e => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};
