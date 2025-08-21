//채팅창 말풍선 컴포넌트

import React, { useState, useEffect, useMemo } from "react";
import type { ChatMessageResponse, ImageInfo } from "../../../types/chat";

import BaseProfileImage from "@/assets/images/base_profile_img.png";

import clsx from "clsx"; // 상단에 추가

interface ChattingComponentProps {
  message: ChatMessageResponse;
  isMe: boolean;
  unreadCount?: number;
  //🌟onImageClick?: (src: string) => void;
  onImageClick?: (p: { url: string; isEmoji: boolean }) => void;
  time: string;
}

// 이미지 URL 판별 (이모티콘 TEXT 보정용)
// const looksLikeImageUrl = (u?: string | null) =>
//   !!u && /^https?:\/\/.+\.(png|jpe?g|gif|webp|jfif|svg)$/i.test(u);

const ChattingComponent = ({
  message,
  isMe,
  unreadCount,
  onImageClick,
  time,
}: ChattingComponentProps) => {
  //chatNick 상태 변수와 setChatNick 함수 정의
  const [chatNick, setChatNick] = useState("");

  //isMe와 nickname에 따라 chatNick을 설정
  useEffect(() => {
    setChatNick(isMe ? "나" : message.senderName);
  }, [isMe, message.senderName]);

  const formatMessage = (raw?: string | null) => {
    const text = raw ?? ""; // null/undefined 방어
    if (text === "") return null; // 내용 없으면 아무것도 렌더하지 않음
    return text.split(/\r?\n/).map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const imgs = useMemo<ImageInfo[]>(() => message.images ?? [], [message]);
  const hasImages = imgs.length > 0;

  const ImageTiles: React.FC<{
    images: ImageInfo[];
    onClick?: (p: { url: string; isEmoji: boolean }) => void;
  }> = ({ images, onClick }) => {
    const count = images.length;

    if (count === 1) {
      const img = images[0];
      //🌟
      const isEmoji = !!img.isEmoji;

      // 이모티콘: 고정 소형(원하면 56px/64px 등으로 바꿔도 됨)
      if (isEmoji) {
        return (
          <button
            type="button"
            className="block focus:outline-none"
            //onClick={() => onClick?.({ url: img.imageUrl, isEmoji })}
            aria-label="emoji-1"
          >
            <img
              src={img.imageUrl}
              alt="emoji-1"
              className="w-[10rem] h-[10rem] rounded-xl object-contain"
              loading="lazy"
              draggable={false}
            />
          </button>
        );
      }

      return (
        <button
          type="button"
          className="block max-w-[15rem] focus:outline-none"
          onClick={() => onClick?.({ url: img.imageUrl, isEmoji: img.isEmoji })}
          aria-label="image-1"
        >
          <img
            src={img.imageUrl}
            alt="img-1"
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </button>
      );
    }

    // 2/4장: 2열 그리드, 3/5장 이상: 3열 그리드
    //const cols = count === 2 || count === 4 ? 2 : 3;
    const colsClass =
      count === 2 || count === 4 ? "grid-cols-2" : "grid-cols-3";

    return (
      // <div className={`grid grid-cols-${cols} gap-2 max-w-[15rem]`}>
      <div
        className={clsx(
          "grid gap-2 w-full max-w-[15rem] min-h-[1px] [contain:layout]", // ★ w-full/min-h/contain 추가
          colsClass, // ★ 빌드 타임 클래스 보장
        )}
      >
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            className="block focus:outline-none"
            onClick={() =>
              onClick?.({ url: img.imageUrl, isEmoji: img.isEmoji })
            }
            aria-label={`image-${idx + 1}`}
          >
            <img
              src={img.imageUrl}
              alt={`img-${idx + 1}`}
              className="w-full aspect-square object-cover rounded-lg"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    );
  };

  if (message.messageType === "SYSTEM") {
    return (
      <div className="w-full flex justify-center my-2">
        <span className="text-gy-700 body-sm-500">
          {formatMessage(message.content)}
        </span>
      </div>
    );
  }

  //🌟
  const profileSrc =
    message.senderProfileImageUrl && message.senderProfileImageUrl.trim()
      ? message.senderProfileImageUrl
      : BaseProfileImage;

  return (
    <div>
      {/* 채팅 입력한 사람이 나(본인)인 경우 : 채팅 입력한 사람이 타인인 경우 */}
      {isMe ? (
        <div
          id="me"
          className="flex justify-end items-end gap-2 shrink-0 self-stretch"
        >
          {/* 텍스트/이미지 공통 시간+읽음 */}
          <div className="flex flex-col justify-center items-end body-sm-500">
            {unreadCount && unreadCount > 0 && (
              <span className="text-gr-500">{unreadCount}</span>
            )}
            <span className="text-gy-700">{time}</span>
          </div>

          <div className="mr-3">
            {/* TEXT */}
            {/* TEXT: content가 있고, 이미지가 없을 때만 말풍선 렌더 */}
            {(message.content ?? "") !== "" && !hasImages && (
              <div
                id="chatting"
                className="flex max-w-[15rem] px-3 py-2 text-left items-start gap-[0.625rem] bg-white border-round"
              >
                <span
                  className="body-rg-500 break-words"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {formatMessage(message.content)}
                </span>
              </div>
            )}

            {/*IMAGE*/}
            {/* IMAGE: messageType이 TEXT더라도 imgs가 있으면 이미지 출력 */}
            {hasImages && (
              <div className="mr-3 flex flex-col items-end max-w-[15rem] min-w-0 min-h-[1px] [contain:layout]">
                <ImageTiles images={imgs} onClick={onImageClick} />
              </div>
            )}
          </div>
        </div>
      ) : (
        // 상대 메시지
        <div id="you" className="flex items-start gap-3 self-stretch">
          <div className="py-2 items-center justify-center gap-[0.625rem]">
            <img
              //🌟src={message.senderProfileImageUrl}
              src={profileSrc}
              alt="profile"
              className="w-10 h-10 aspect-square rounded-[2.75rem]"
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <p id="nickname" className="body-rg-500">
              {chatNick}
            </p>

            {/* TEXT: content가 있고, 이미지가 없을 때만 말풍선 렌더 */}
            {(message.content ?? "") !== "" && !hasImages && (
              <div className="flex items-end gap-2 self-stretch">
                <div
                  id="chatting"
                  className="flex max-w-[15rem] px-3 py-2 items-start text-left gap-[0.625rem] bg-white border-round"
                >
                  <span
                    className="body-rg-500 break-words"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {formatMessage(message.content)}
                  </span>
                </div>
                <div className="flex flex-col justify-center items-start body-sm-500">
                  {unreadCount !== undefined && unreadCount > 0 && (
                    <span className="text-gr-500">{unreadCount}</span>
                  )}
                  <span className="text-gy-700">{time}</span>
                </div>
              </div>
            )}

            {/*IMAGE*/}
            {/* IMAGE: messageType이 TEXT더라도 imgs가 있으면 이미지 출력 */}
            {hasImages && (
              <div className="mr-3 flex flex-col items-end max-w-[15rem] min-w-0 min-h-[1px] [contain:layout]">
                <ImageTiles images={imgs} onClick={onImageClick} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChattingComponent;
