//채팅창 말풍선 컴포넌트

import React, { useState, useEffect } from "react";
import type { ChattingComponentProps } from "../../../types/chat";

interface Props extends ChattingComponentProps {
  onImageClick?: (src: string) => void;
}

const ChattingComponent = ({
  nickname,
  profile,
  chatting,
  time,
  isMe,
  unreadCount,
  imageUrls = [],
  onImageClick,
}: Props) => {
  //chatNick 상태 변수와 setChatNick 함수 정의
  const [chatNick, setChatNick] = useState("");

  //isMe와 nickname에 따라 chatNick을 설정
  useEffect(() => {
    setChatNick(isMe ? "나" : nickname);
  }, [isMe, nickname]);

  //메세지 포맷팅 함수 정의 (개행 문자를 <br/>로 변환)
  const formatMessage = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const renderImageList = () => (
    <div className="flex flex-wrap gap-2 mt-1">
      {imageUrls.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`img-${idx}`}
          className="w-40 h-40 object-cover rounded-lg cursor-pointer"
          onClick={() => onImageClick?.(src)}
        />
      ))}
    </div>
  );

  return (
    <div>
      {/* 채팅 입력한 사람이 나(본인)인 경우 : 채팅 입력한 사람이 타인인 경우 */}
      {isMe ? (
        <div
          id="me"
          className="flex justify-end items-end gap-2 shrink-0 self-stretch"
        >
          {/* 텍스트 메시지 말풍선 */}
          {chatting && (
            <>
              <div className="flex flex-col justify-center items-end body-sm-500">
                {unreadCount !== undefined && unreadCount > 0 && (
                  <span className="text-gr-500">{unreadCount}</span>
                )}
                <span className="text-gy-700">{time}</span>
              </div>
              <div className="mr-3">
                <div
                  id="chatting"
                  className="flex max-w-[15rem] px-3 py-2 text-left items-start gap-[0.625rem] bg-white border-round"
                >
                  <span className="body-rg-500 text-black">
                    {formatMessage(chatting)}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* 이미지 메시지 */}
          {imageUrls.length > 0 && (
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
          )}
        </div>
      ) : (
        <div id="you" className="flex items-start gap-3 self-stretch">
          <div className="py-2 items-center justify-center gap-[0.625rem]">
            <img
              src={profile}
              alt="profile"
              className="w-10 h-10 aspect-square rounded-[2.75rem]"
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <p id="nickname" className="body-rg-500">
              {chatNick}
            </p>

            {/* 텍스트 메시지 */}
            {chatting && (
              <>
                <div className="flex items-end gap-2 self-stretch">
                  <div
                    id="chatting"
                    className="flex max-w-[15rem] px-3 py-2 items-start text-left gap-[0.625rem] bg-white border-round"
                  >
                    <span className="body-rg-500">
                      {formatMessage(chatting)}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-start body-sm-500">
                    {unreadCount !== undefined && unreadCount > 0 && (
                      <span className="text-gr-500">{unreadCount}</span>
                    )}
                    <span className="text-gy-700">{time}</span>
                  </div>
                </div>
              </>
            )}

            {/* 이미지 메시지 */}
            {imageUrls.length > 0 && (
              <div className="flex items-end flex-wrap gap-2 self-stretch">
                {renderImageList()}
                <div className="flex flex-col justify-center items-start body-sg-500">
                  {unreadCount !== undefined && unreadCount > 0 && (
                    <span className="text-gr-500">{unreadCount}</span>
                  )}
                  <span className="text-gy-700">{time}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChattingComponent;
