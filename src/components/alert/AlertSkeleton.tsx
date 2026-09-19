const AlertCardSkeleton = () => {
  return (
    <div className="flex w-[21.4375rem] flex-col gap-3 border-soft bg-white p-2">
      <div className="flex w-full gap-3">
        {/* 이미지 */}
        <div className="h-10 w-10 flex-shrink-0 bg-gy-100 rounded animate-pulse" />
        {/* 텍스트 영역 */}
        <div className="flex flex-1 flex-col gap-1">
          <div className="h-[1rem] w-[6rem] bg-gy-100 rounded animate-pulse" />
          <div className="h-[0.875rem] w-full bg-gy-100 rounded animate-pulse" />
          <div className="h-[0.875rem] w-[70%] bg-gy-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const AlertSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="flex flex-col w-full items-center gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <AlertCardSkeleton key={i} />
      ))}
    </div>
  );
};
