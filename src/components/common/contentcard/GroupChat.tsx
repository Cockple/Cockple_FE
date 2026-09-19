import { useState } from "react";
import Peopel from "@/assets/icons/people.svg?react";
import { Num_Noti } from "./Num_Noti";
import clsx from "clsx";

// 이미지
import DefaultGroupImg from "@/assets/icons/defaultGroupImg.svg?url";

export interface GroupChatProps {
  imageSrc: string;
  chatName: string;
  memberCount: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const GroupChat = ({
  imageSrc,
  chatName,
  memberCount,
  lastMessage,
  lastMessageTime,
  unreadCount,
}: GroupChatProps) => {
  const [pressing, setPressing] = useState(false);

  return (
    <div
      className={clsx(
        "w-full h-[5rem] px-[0.5rem] gap-[0.75rem] rounded-[0.75rem] flex items-center transition-colors",
        pressing ? "bg-[#F4F5F6]" : "bg-[#FAFAFA]",
      )}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => setPressing(false)}
    >
      {/* 프로필 이미지 */}
      <img
        src={imageSrc ? imageSrc : DefaultGroupImg}
        alt={chatName}
        className="w-[4rem] h-[4rem] rounded-[0.5rem] flex-shrink-0 object-cover"
      />

      {/* 텍스트 영역 */}
      <div className="flex flex-col flex-1 min-w-0 min-h-[4rem] gap-[0.25rem]">
        {/* 채팅방 이름 및 인원 */}
        <div className="flex items-center gap-[0.25rem] min-w-0">
          <p className="body-md-500 truncate" title={chatName}>
            {chatName}
          </p>
          <Peopel className="w-[0.875rem] h-[0.875rem] flex-shrink-0" />
          <p className="body-sm-400 flex-shrink-0">{memberCount}</p>
        </div>

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

      {/* 시간 + 알림 뱃지 */}
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
