import { useState } from "react";
import Peopel from "../../../assets/icons/people.svg?react";
import { Num_Noti } from "./Num_Noti";

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
      className={`w-[21.4375rem] h-[5rem] p-[0.5rem] gap-[0.75rem] rounded-[0.75rem] flex items-center transition-colors ${
        pressing ? "bg-[#F4F5F6]" : "bg-[#FAFAFA]"
      }`}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => setPressing(false)}
    >
      <img
        src={imageSrc ? imageSrc : DefaultGroupImg}
        alt={chatName}
        className="w-[4rem] h-[4rem] rounded-[0.5rem] flex-shrink-0"
      />
      {/* {imageSrc ? (
        <img
          src={imageSrc}
          alt={chatName}
          className="w-[4rem] h-[4rem] rounded-[0.5rem] flex-shrink-0"
        />
      ) : (
        <div
          aria-label={`${chatName} profile placeholder`}
          className="w-[4rem] h-[4rem] rounded-[0.5rem] bg-[#F0F1F3] flex items-center justify-center flex-shrink-0"
        >
          <span className="body-md-500 text-[#9195A1]">
            {chatName?.[0] ?? "?"}
          </span>
        </div>
      )} */}

      <div className="flex flex-col flex-grow h-[4rem] overflow-hidden">
        {/* 채팅방 이름 및 인원 */}
        <div className="flex items-center gap-[0.25rem] min-w-0">
          <p className="body-md-500 truncate max-w-[calc(100%-2.5rem)]">
            {chatName}
          </p>
          <Peopel className="w-[1rem] h-[1rem] flex-shrink-0" />
          <p className="body-sm-400 flex-shrink-0">{memberCount}</p>
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

      {/* 시간 및 알림 */}
      <div className="flex flex-col justify-between w-[3rem] h-[4rem] items-center flex-shrink-0">
        {" "}
        {/* flex-shrink-0으로 축소 방지 */}
        <p className="body-sm-400 text-[#9195A1]">{lastMessageTime}</p>
        <div className="flex items-center justify-center w-full">
          {unreadCount > 0 && <Num_Noti unreadCount={unreadCount} />}
        </div>
      </div>
    </div>
  );
};
