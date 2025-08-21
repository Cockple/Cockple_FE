//모임 페이지에 EditGroupInfoDefault 사용하는 컴포입니다.
import { useState, useEffect, useRef } from "react";

interface InputFieldProps {
  title?: string;
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void; 
}

export const InputField = ({ title, maxLength, value = "", onChange }: InputFieldProps) => {
  const [recordText, setRecordText] = useState(value);
  const [isRecordFocused, setIsRecordFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  };

  // 부모 값이 바뀌면 업데이트
  useEffect(() => {
    setRecordText(value);
  }, [value]);

  useEffect(() => {
    adjustHeight();
  }, [recordText]);

  const handleChange = (val: string) => {
    if (maxLength && val.length > maxLength) {
      val = val.slice(0, maxLength);
    }
    setRecordText(val);
    onChange?.(val);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="header-h5 text-black">{title}</label>
      </div>
      <div className="relative">
        <textarea
          ref={textAreaRef}
          value={recordText}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setIsRecordFocused(true)}
          onBlur={() => setIsRecordFocused(false)}
          rows={1}
          style={{ resize: "none", overflow: "hidden" }}
          className={`w-full rounded-xl body-md-500 p-3 pb-8 leading-snug border
            ${isRecordFocused ? "border-[#87C95E]" : "border-[#E4E7EA] text-black"}
            focus:outline-none
          `}
        />
        {maxLength && (
          <div className="body-rg-500 absolute bottom-3 right-3 text-[#D6DAE0]">
            ({recordText.length}/{maxLength})
          </div>
        )}
      </div>
    </div>
  );
};

