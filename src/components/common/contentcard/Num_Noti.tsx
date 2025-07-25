interface NumNotiProps {
  unreadCount: number;
}
//unreadCount 100을 넘으면 자동으로 99+로 보입니다.
export const Num_Noti = ({ unreadCount }: NumNotiProps) => {
  const displayCount = unreadCount > 99 ? "99+" : `${unreadCount}`;

  return (
    <div className="min-w-[2rem] h-5 bg-[#F62D2D] rounded-3xl px-1 flex items-center justify-center body-sm-500 text-white">
      <p className="truncate">{displayCount}</p>
    </div>
  );
};
