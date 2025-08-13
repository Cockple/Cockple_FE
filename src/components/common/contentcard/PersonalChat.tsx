import { useState } from "react";
import { Num_Noti } from "./Num_Noti";

export interface PersonalChatProps {
  imageSrc: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const PersonalChat = ({
  imageSrc,
  userName,
  lastMessage,
  lastMessageTime,
  unreadCount,
}: PersonalChatProps) => {
  const [pressing, setPressing] = useState(false);

  return (
    <div
      className={`w-[21.4375rem] h-[5rem] p-[0.5rem] gap-[0.75rem] rounded-[0.75rem] flex items-center transition-colors 
        ${pressing ? "bg-[#F4F5F6]" : "bg-white"}`}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => setPressing(false)}
    >
      {/* <img
        src={imageSrc || undefined}
        alt={userName}
        className="w-[4rem] h-[4rem] rounded-[0.5rem]"
      /> */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={userName}
          className="w-[4rem] h-[4rem] rounded-[0.5rem] flex-shrink-0"
        />
      ) : (
        <div
          aria-label={`${userName} profile placeholder`}
          className="w-[4rem] h-[4rem] rounded-[0.5rem] bg-[#F0F1F3] flex items-center justify-center flex-shrink-0"
        >
          <span className="body-md-500 text-[#9195A1]">
            {userName?.[0] ?? "?"}
          </span>
        </div>
      )}

      <div className="flex flex-col justify-between w-[11.9375rem] h-[4rem]">
        <div className="flex items-center gap-[0.25rem] max-w-full overflow-hidden">
          <p className="body-md-500 truncate max-w-[12rem]" title={userName}>
            {userName}
          </p>
        </div>

        <span
          className="body-rg-400 block text-left"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "144%",
          }}
        >
          {lastMessage}
        </span>
      </div>

      <div className="flex flex-col justify-between w-[4rem] h-[4rem] items-center">
        <p className="body-sm-400 text-[#9195A1]">{lastMessageTime}</p>

        <div className="flex items-center justify-center w-full">
          {unreadCount > 0 && <Num_Noti unreadCount={unreadCount} />}
        </div>
      </div>
    </div>
  );
};
