// GroupHomePage 로딩 스켈레톤 UI

const SkeletonBox = ({
  className = "",
}: {
  className?: string;
}) => (
  <div className={`bg-gy-100 animate-pulse rounded ${className}`} />
);

// GroupInfoSection 스켈레톤
const GroupInfoSectionSkeleton = () => (
  <div className="flex flex-col gap-3">
    {/* 이미지 + 정보 영역 */}
    <div className="flex p-3 gap-3">
      {/* 그룹 이미지 */}
      <div className="w-30 h-30 rounded-[0.5rem] bg-gy-100 animate-pulse shrink-0" />

      {/* 텍스트 정보 */}
      <div className="flex flex-col flex-1 gap-2">
        {/* 그룹명 */}
        <SkeletonBox className="h-[1.125rem] w-[7rem] mb-1" />
        {/* 정보 rows */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <SkeletonBox className="h-[0.75rem] w-[2rem]" />
            <SkeletonBox className="h-[0.75rem] w-[5rem]" />
          </div>
        ))}
        {/* 더보기 버튼 */}
        <SkeletonBox className="h-[2rem] w-full mt-1" />
      </div>
    </div>

    {/* 키워드 chips */}
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonBox key={i} className="h-[2rem] w-[4.5rem] rounded-full" />
      ))}
    </div>

    {/* 설명 박스 */}
    <SkeletonBox className="h-[3.5rem] w-full rounded-[0.5rem]" />
  </div>
);

// 주간 캘린더 스켈레톤
const WeeklyCalendarSkeleton = () => (
  <div className="flex justify-between px-3">
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="flex flex-col items-center gap-1">
        <SkeletonBox className="h-[0.75rem] w-[1.25rem]" />
        <SkeletonBox className="h-[2rem] w-[2rem] rounded-full" />
      </div>
    ))}
  </div>
);

// 운동 카드 스켈레톤
const ExerciseCardSkeleton = () => (
  <div className="flex flex-col gap-2 p-4 border-b border-gy-200">
    <SkeletonBox className="h-[1rem] w-[8rem]" />
    <SkeletonBox className="h-[0.875rem] w-[12rem]" />
    <SkeletonBox className="h-[0.875rem] w-[6rem]" />
  </div>
);

export const GroupHomePageSkeleton = () => (
  <div className="flex flex-col gap-8 pb-15">
    <GroupInfoSectionSkeleton />
    <div className="w-full h-17">
      <WeeklyCalendarSkeleton />
    </div>
    <div className="flex flex-col">
      {Array.from({ length: 3 }).map((_, i) => (
        <ExerciseCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// 운동 목록만 로딩 중일 때 쓰는 스켈레톤
export const ExerciseListSkeleton = () => (
  <div className="flex flex-col">
    {Array.from({ length: 3 }).map((_, i) => (
      <ExerciseCardSkeleton key={i} />
    ))}
  </div>
);
