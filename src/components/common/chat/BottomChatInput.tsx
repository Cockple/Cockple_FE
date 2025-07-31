import React, { useRef, useState } from "react";
import Clear_M from "../Btn_Static/Icon_Btn/Clear_M";
import Camera from "../../../assets/icons/camera.svg";
import Imogi from "../../../assets/icons/emoji_smile.svg";
import Chat from "../../../assets/icons/chat.svg";
import ChatGY400 from "../../../assets/icons/chat_GY.svg";

interface BottomChatInputProps {
  input: string;
  isComposing: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onCompositionStart: () => void;
  onCompositionEnd: (e: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const BottomChatInput = ({
  input,
  onInputChange,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  onSendMessage,
  onImageUpload,
  fileInputRef,
}: BottomChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMultiLine, setIsMultiLine] = useState(false);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "2px"; // 기본 높이 (h-14)
    const height = textarea.scrollHeight;
    textarea.style.height = `${Math.min(height, 72)}px`; // 최대 3줄(72px)까지

    // scrollHeight가 기본보다 크면 위 정렬로 변경
    setIsMultiLine(height > 24);
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    onInputChange(value);
    adjustTextareaHeight();
    console.log("scrollHeight:", textareaRef.current?.scrollHeight);
    console.log("isMultiline: ", isMultiLine);
  };

  return (
    <div
      className={`flex px-4 pt-2 pb-2 items-center justify-center gap-2 bg-white shadow-ds50 `}
    >
      {/* 이미지 업로드 */}
      <Clear_M
        iconMap={{
          disabled: Camera,
          default: Camera,
          pressing: Camera,
          clicked: Camera,
        }}
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={onImageUpload}
      />

      {/* 텍스트 입력 */}
      <div
        className={`flex px-3 flex-end items-center gap-2 border border-gy-200 border-soft ${isMultiLine ? "h-auto min-h-14 max-h-32" : "h-14 py-[0.625rem]"}`}
      >
        {/* <input
          type="text"
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          className="outline-0 w-full"
        /> */}
        <textarea
          value={input}
          ref={textareaRef}
          //onChange={e => onInputChange(e.target.value)};
          onInput={handleInput}
          onKeyDown={onKeyDown}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          //className="w-full max-h-[72px] resize-none overflow-auto outline-none body-md-500 leading-[24px] border-0 focus:ring-0"
          className={`outline-0 w-full body-md-500 overflow-hidden resize-none ${isMultiLine ? "h-auto h-min-14 h-max-32" : ""}`}
          rows={1}
        />
        <Clear_M
          iconMap={{
            disabled: Imogi,
            default: Imogi,
            pressing: Imogi,
            clicked: Imogi,
          }}
          onClick={() => {}}
        />
      </div>

      {/* 전송 버튼 */}
      <Clear_M
        initialStatus={input.trim() === "" ? "disabled" : "default"}
        iconMap={{
          disabled: ChatGY400,
          default: Chat,
          pressing: Chat,
          clicked: Chat,
        }}
        onClick={input.trim() === "" ? undefined : onSendMessage}
      />
    </div>
  );
};

export default BottomChatInput;
