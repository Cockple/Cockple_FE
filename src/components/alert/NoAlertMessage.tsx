interface NoAlertMessageProps {
  message?: string;
}

export const NoAlertMessage = ({ message }: NoAlertMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-2 gap-[var(--Gaps-Vertical-Section_S, 1.25rem)]">
      <div className="w-[11.25rem] h-[11.25rem] bg-gy-100 flex items-center justify-center text-center header-h5 text-black px-[2.41rem]">
        이모티콘 캐릭터
        <br />
        삽입 예정
      </div>
      {message ? (
        <div className="header-h5">{message}이 없어요!</div>
      ) : (
        <div className="header-h5">아직 알림이 없어요!</div>
      )}
      {/* <div className="header-h5">아직 알림이 없어요!</div> */}
    </div>
  );
};
