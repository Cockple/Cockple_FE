// 내 운동 상세 로딩 스켈레톤 UI

const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gy-100 animate-pulse rounded ${className}`} />
);

// 장소 정보 박스 스켈레톤
const PlaceInfoSkeleton = () => (
  <div className="mt-5 flex flex-col gap-3 p-4 w-full">
    {/* 공지 줄 */}
    <div className="flex items-center gap-2">
      <SkeletonBox className="w-5 h-5 rounded-full shrink-0" />
      <SkeletonBox className="h-[0.875rem] w-[10rem]" />
    </div>
    {/* 장소 줄 */}
    <div className="flex items-start gap-2">
      <SkeletonBox className="w-5 h-5 rounded-full shrink-0" />
      <div className="flex flex-col gap-1 flex-1">
        <SkeletonBox className="h-[0.875rem] w-[8rem]" />
        <SkeletonBox className="h-[0.875rem] w-[12rem]" />
      </div>
    </div>
  </div>
);

// 인원 헤더 스켈레톤 (참여/대기)
const MemberHeaderSkeleton = () => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <SkeletonBox className="h-[1rem] w-[4rem]" />
      <SkeletonBox className="h-[1rem] w-[2.5rem]" />
    </div>
    <div className="flex items-center gap-2">
      <SkeletonBox className="w-4 h-4 rounded-full" />
      <SkeletonBox className="h-[0.875rem] w-[1rem]" />
      <SkeletonBox className="w-4 h-4 rounded-full" />
      <SkeletonBox className="h-[0.875rem] w-[1rem]" />
    </div>
  </div>
);

// 멤버 카드 스켈레톤
const MemberCardSkeleton = () => (
  <div>
    <div className="flex items-center gap-3 px-1 py-3">
      {/* 번호 */}
      <SkeletonBox className="h-[0.75rem] w-[1rem]" />
      {/* 프로필 이미지 */}
      <SkeletonBox className="w-10 h-10 rounded-full shrink-0" />
      {/* 이름 + 레벨 */}
      <div className="flex flex-col gap-1 flex-1">
        <SkeletonBox className="h-[0.875rem] w-[5rem]" />
        <SkeletonBox className="h-[0.75rem] w-[3rem]" />
      </div>
      {/* 삭제 버튼 자리 */}
      <SkeletonBox className="w-6 h-6 rounded-full" />
    </div>
    <div className="border-t border-gy-100 mx-1" />
  </div>
);

export const MyExerciseDetailSkeleton = () => (
  <div className="flex flex-col gap-8">
    <PlaceInfoSkeleton />

    {/* 참여 인원 */}
    <div className="flex flex-col gap-2">
      <MemberHeaderSkeleton />
      {Array.from({ length: 4 }).map((_, i) => (
        <MemberCardSkeleton key={i} />
      ))}
    </div>
  </div>
);
