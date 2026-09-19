import { useState } from "react";
import { Num_Noti } from "./Num_Noti";

// 이미지
import DefaultGroupImg from "@/assets/icons/defaultGroupImg.svg?url";
import clsx from "clsx";

export interface PersonalChatProps {
  imageSrc: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isAloneWithdrawn?: boolean;
}

export const PersonalChat = ({
  imageSrc,
  userName,
  lastMessage,
  lastMessageTime,
  unreadCount,
  isAloneWithdrawn,
}: PersonalChatProps) => {
  const [pressing, setPressing] = useState(false);

  return (
    <div
      className={clsx(
        "w-full h-[5rem] px-[0.5rem] gap-[0.75rem] rounded-[0.75rem] flex items-center transition-colors",
        pressing ? "bg-[#F4F5F6]" : "bg-white",
      )}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => setPressing(false)}
    >
      {/* 프로필 이미지 - 개인채팅은 원형 */}
      <img
        src={imageSrc ? imageSrc : DefaultGroupImg}
        alt={userName}
        className={clsx(
          "w-[4rem] h-[4rem] rounded-full flex-shrink-0 object-cover",
          isAloneWithdrawn && "opacity-20",
        )}
      />

      {/* 텍스트 영역 */}
      <div className="flex flex-col flex-1 min-w-0 min-h-[4rem] gap-[0.25rem]">
        <p className="body-md-500 truncate text-left" title={userName}>
          {userName}
        </p>

        <span
          className="body-rg-400 text-left"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "144%",
          }}
        >
          {lastMessage}
        </span>
      </div>

      <div className="flex flex-col h-[4rem] items-center flex-shrink-0">
        <p className="body-sm-400 text-[#9195A1] whitespace-nowrap">
          {lastMessageTime}
        </p>
        <div className="flex flex-1 items-center justify-center">
          {unreadCount > 0 && <Num_Noti unreadCount={unreadCount} />}
        </div>
      </div>
    </div>
  );
};
