// 채팅 목록 로딩 스켈레톤 UI

interface ChatListSkeletonProps {
  type?: "group" | "personal";
  count?: number;
}

const ChatCardSkeleton = ({ type = "group" }: { type?: "group" | "personal" }) => {
  return (
    <div className="w-full h-[5rem] px-[0.5rem] gap-[0.75rem] flex items-center border-b border-gy-200 pb-1">
      {/* 프로필 이미지 */}
      <div
        className={`w-[4rem] h-[4rem] flex-shrink-0 bg-gy-100 animate-pulse ${
          type === "personal" ? "rounded-full" : "rounded-[0.5rem]"
        }`}
      />

      {/* 텍스트 영역 */}
      <div className="flex flex-col flex-1 min-w-0 min-h-[4rem] gap-[0.5rem] justify-center">
        {/* 이름 줄 (그룹은 이름 + 인원 아이콘) */}
        <div className="flex items-center gap-[0.5rem]">
          <div className="h-[1rem] w-[6rem] bg-gy-100 rounded animate-pulse" />
          {type === "group" && (
            <div className="h-[0.75rem] w-[2rem] bg-gy-100 rounded animate-pulse" />
          )}
        </div>
        {/* 메시지 줄 */}
        <div className="h-[0.875rem] w-full bg-gy-100 rounded animate-pulse" />
        <div className="h-[0.875rem] w-[70%] bg-gy-100 rounded animate-pulse" />
      </div>

      {/* 시간 + 뱃지 영역 */}
      <div className="flex flex-col h-[4rem] items-center flex-shrink-0 gap-[0.5rem] justify-center">
        <div className="h-[0.75rem] w-[3rem] bg-gy-100 rounded animate-pulse" />
        <div className="h-[1.25rem] w-[1.25rem] bg-gy-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export const ChatListSkeleton = ({ type = "group", count = 6 }: ChatListSkeletonProps) => {
  return (
    <div className="flex flex-col w-full">
      {Array.from({ length: count }).map((_, i) => (
        <ChatCardSkeleton key={i} type={type} />
      ))}
    </div>
  );
};
