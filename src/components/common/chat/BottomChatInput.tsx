import React from "react";
import Clear_M from "../Btn_Static/Icon_Btn/Clear_M";
import Camera from "../../../assets/icons/camera.svg";
import Imogi from "../../../assets/icons/emoji_smile.svg";
import Chat from "../../../assets/icons/chat.svg";
import ChatGY400 from "../../../assets/icons/chat_GY.svg";

interface BottomChatInputProps {
  input: string;
  isComposing: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCompositionStart: () => void;
  onCompositionEnd: (e: React.CompositionEvent<HTMLInputElement>) => void;
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
  return (
    <div className="flex px-4 pt-2 pb-2 items-center justify-center gap-2 bg-white shadow-ds50">
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
      <div className="flex h-14 py-[0.625rem] px-3 flex-end items-center gap-2 border border-gy-200 border-soft">
        <input
          type="text"
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          className="outline-0 w-full"
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
