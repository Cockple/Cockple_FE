// 채팅 내부 로딩 스켈레톤 UI

const ChatBubbleSkeleton = ({ isMe }: { isMe: boolean }) => {
  return (
    <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {/* 프로필 이미지 (상대방만) */}
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-gy-100 animate-pulse flex-shrink-0" />
      )}

      <div className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
        {/* 닉네임 (상대방만) */}
        {!isMe && (
          <div className="h-3 w-16 bg-gy-100 rounded animate-pulse" />
        )}
        {/* 말풍선 */}
        <div
          className={`h-9 rounded-2xl bg-gy-100 animate-pulse ${
            isMe ? "w-40" : "w-52"
          }`}
        />
      </div>

      {/* 시간 */}
      <div className="h-3 w-8 bg-gy-100 rounded animate-pulse self-end mb-1" />
    </div>
  );
};

export const ChatDetailSkeleton = () => {
  const pattern = [false, true, false, false, true, true, false, true];

  return (
    <div className="flex flex-col gap-5 p-4">
      {pattern.map((isMe, i) => (
        <ChatBubbleSkeleton key={i} isMe={isMe} />
      ))}
    </div>
  );
};
