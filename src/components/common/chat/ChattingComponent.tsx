//채팅창 말풍선 컴포넌트

import React, { useState, useEffect, useMemo } from "react";
import type { ChatMessageResponse } from "../../../types/chat";

interface ChattingComponentProps {
  message: ChatMessageResponse;
  isMe: boolean;
  unreadCount?: number;
  onImageClick?: (src: string) => void;
  time: string;
}

const ChattingComponent = ({
  // nickname,
  // profile,
  // chatting,
  // time,
  // isMe,
  // unreadCount,
  // imageUrls = [],
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

  //메세지 포맷팅 함수 정의 (개행 문자를 <br/>로 변환)
  const formatMessage = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  //🌟
  // const renderImage = () => (
  //   <div className="flex flex-wrap gap-2 mt-1">
  //     {/* {imageUrls.map((src, idx) => (
  //       <img
  //         key={idx}
  //         src={src}
  //         alt={`img-${idx}`}
  //         className="w-40 h-40 object-cover rounded-lg cursor-pointer"
  //         onClick={() => onImageClick?.(src)}
  //       />
  //     ))} */}
  //     {/* {message.fileInfo?.fileUrl ? (
  //       <img
  //         src={message.fileInfo.fileUrl}
  //         alt={message.fileInfo.fileName}
  //         className="w-40 h-40 object-cover rounded-lg cursor-pointer"
  //         onClick={() => onImageClick?.(message.fileInfo!.fileUrl)}
  //       />
  //     ) : null} */}
  //   </div>
  // );
  // 렌더링용 이미지 배열 (IMAGE 타입이 아니어도 imgUrls가 있으면 보여줌)
  const imgs = useMemo(() => message.imgUrls ?? [], [message.imgUrls]);
  const hasImages = imgs && imgs.length > 0;

  const ImageTiles: React.FC<{
    urls: string[];
    onClick?: (src: string) => void;
  }> = ({ urls, onClick }) => {
    const count = urls.length;

    // 1장일 때는 그리드가 아니라 단일 이미지로 꽉 채움 (빈칸 X)
    if (count === 1) {
      const src = urls[0];
      return (
        <button
          type="button"
          className="block max-w-[15rem] focus:outline-none"
          onClick={() => onClick?.(src)}
          aria-label="image-1"
        >
          <img
            src={src}
            alt="img-1"
            className="w-full h-auto rounded-lg object-cover"
            loading="lazy"
          />
        </button>
      );
    }

    // 2/4장: 2열 그리드, 3/5장 이상: 3열 그리드
    const cols = count === 2 || count === 4 ? 2 : 3;

    return (
      <div className={`grid grid-cols-${cols} gap-2 max-w-[15rem]`}>
        {urls.map((src, idx) => (
          <button
            key={idx}
            type="button"
            className="block focus:outline-none"
            onClick={() => onClick?.(src)}
            aria-label={`image-${idx + 1}`}
          >
            <img
              src={src}
              alt={`img-${idx + 1}`}
              className="w-full aspect-square object-cover rounded-lg"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    );
  };

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
            {message.messageType === "TEXT" && (
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
            {message.messageType === "IMAGE" && hasImages && (
              <div className="mr-3 flex flex-col items-end max-w-[15rem]">
                <ImageTiles urls={imgs} onClick={onImageClick} />
              </div>
            )}
          </div>

          {/* 이미지 메시지 */}
          {/* {imageUrls.length > 0 && (
            <>
              <div className="flex flex-col justify-center items-end body-sm-500">
                {unreadCount !== undefined && unreadCount > 0 && (
                  <span className="text-gr-500">{unreadCount}</span>
                )}
                <span className="text-gy-700">{time}</span>
              </div>
              <div className="mr-3 flex flex-col items-end gap-1">
                <div className="flex flex-wrap gap-2">{renderImageList()}</div>
              </div>
            </>
          )} */}
        </div>
      ) : (
        // 상대 메시지
        <div id="you" className="flex items-start gap-3 self-stretch">
          <div className="py-2 items-center justify-center gap-[0.625rem]">
            <img
              src={message.senderProfileImage}
              alt="profile"
              className="w-10 h-10 aspect-square rounded-[2.75rem]"
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <p id="nickname" className="body-rg-500">
              {chatNick}
            </p>

            {/* 텍스트 메시지 */}
            {message.messageType === "TEXT" && (
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

            {/* <div className="flex items-end flex-wrap gap-2 self-stretch">
                    {renderImage()}
                    <div className="flex flex-col justify-center items-start body-sm-500">
                      {unreadCount && unreadCount > 0 && (
                        <span className="text-gr-500">{unreadCount}</span>
                      )}
                      <span className="text-gy-700">{message.timestamp}</span>
                    </div>
                  </div> */}

            {/*IMAGE*/}
            {message.messageType === "IMAGE" && hasImages && (
              <div className="mr-3 flex flex-col items-end gap-1">
                <ImageTiles urls={imgs} onClick={onImageClick} />
              </div>
            )}
            {/* 이미지 메시지 */}
            {/* {imageUrls.length > 0 && (
              <div className="flex items-end flex-wrap gap-2 self-stretch">
                {renderImageList()}
                <div className="flex flex-col justify-center items-start body-sg-500">
                  {unreadCount !== undefined && unreadCount > 0 && (
                    <span className="text-gr-500">{unreadCount}</span>
                  )}
                  <span className="text-gy-700">{time}</span>
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChattingComponent;
