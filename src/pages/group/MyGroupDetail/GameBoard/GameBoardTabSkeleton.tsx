// 게임판(게임 코트 / 대기 / 명단) 로딩 스켈레톤 UI

const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gy-100 animate-pulse rounded ${className}`} />
);

// 코트/대기 카드 안에 들어가는 선수 뱃지 자리
const PlayerBadgeSkeleton = () => (
  <SkeletonBox className="h-7 w-[5.5rem] rounded-lg" />
);

// 코트 카드 한 장 (경기 중 상태 기준: 헤더 + 선수 4명)
const CourtCardSkeleton = () => (
  <div className="flex w-[12.5rem] shrink-0 flex-col gap-2 rounded-2xl bg-white p-2 shadow-ds100">
    <div className="flex h-6 items-center justify-between pl-1">
      <SkeletonBox className="h-3.5 w-16" />
      <SkeletonBox className="h-6 w-12 rounded-lg" />
    </div>
    <div className="flex flex-wrap justify-between gap-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <PlayerBadgeSkeleton key={i} />
      ))}
    </div>
  </div>
);

// 대기 카드 한 장
const WaitingCardSkeleton = () => (
  <div className="flex w-[12.5rem] shrink-0 flex-col gap-2 rounded-2xl bg-white p-2 shadow-ds100">
    <div className="flex h-6 items-center justify-between pl-1">
      <SkeletonBox className="h-3.5 w-14" />
      <div className="flex items-center gap-1">
        <SkeletonBox className="size-6 rounded-lg" />
        <SkeletonBox className="size-6 rounded-lg" />
      </div>
    </div>
    <div className="flex flex-wrap justify-between gap-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <PlayerBadgeSkeleton key={i} />
      ))}
    </div>
  </div>
);

// 명단 멤버 카드 한 장
const MemberCardSkeleton = () => (
  <div className="flex w-[10.3125rem] flex-col gap-2 rounded-2xl bg-white p-2 shadow-ds100">
    <div className="flex h-6 items-center justify-between pl-1">
      <SkeletonBox className="h-5 w-10 rounded-lg" />
      <SkeletonBox className="h-5 w-8 rounded-lg" />
    </div>
    <div className="flex items-center gap-2">
      <SkeletonBox className="size-6 shrink-0 rounded-full" />
      <SkeletonBox className="h-4 w-20" />
    </div>
    <div className="flex items-center gap-1">
      <SkeletonBox className="size-4 shrink-0 rounded-full" />
      <SkeletonBox className="h-3.5 w-10" />
      <SkeletonBox className="h-3.5 w-8" />
    </div>
  </div>
);

export const GameBoardTabSkeleton = () => (
  <div className="flex min-w-0 flex-col gap-8 pb-28">
    {/* 게임 코트 */}
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-5 w-20" />
        <div className="flex items-center gap-2">
          <SkeletonBox className="size-8 rounded-lg" />
          <SkeletonBox className="h-8 w-20 rounded-lg" />
        </div>
      </div>
      <div className="w-full min-w-0 overflow-hidden rounded-[1.5rem] bg-gr-100">
        <div className="flex w-max gap-3 p-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <CourtCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>

    {/* 대기 */}
    <div className="flex min-w-0 flex-col gap-3">
      <SkeletonBox className="h-5 w-12" />
      <div className="w-full min-w-0 overflow-hidden rounded-[1.5rem] bg-[#fff4d2]">
        <div className="flex w-max gap-3 p-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <WaitingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>

    {/* 명단 */}
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-5 w-12" />
        <SkeletonBox className="size-6 rounded-lg" />
      </div>
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-4 w-14" />
        <SkeletonBox className="h-8 w-16 rounded-lg" />
      </div>
      <div className="flex flex-wrap justify-between gap-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MemberCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);
