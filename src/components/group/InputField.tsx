//모임 페이지에 EditGroupInfoDefault 사용하는 컴포입니다.
import { useState, useEffect, useRef } from "react";

interface CheckBoxLongnoButton {
  title?: string;
  maxLength?: number;
}

export const InputField = ({ title, maxLength }: CheckBoxLongnoButton) => {
  const [recordTexts, setRecordTexts] = useState<string[]>([""]);

  // ‼️ 배포 오류를 위한 임시 코드
  const isPrivate = false;
  // const [isPrivate, setIsPrivate] = useState(false);

  const [isRecordFocused, setIsRecordFocused] = useState<boolean[]>([false]);

  const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const adjustHeight = (idx: number) => {
    const textarea = textAreaRefs.current[idx];
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    recordTexts.forEach((_, idx) => {
      adjustHeight(idx);
    });
  }, [recordTexts]);

  const onChangeText = (idx: number, value: string) => {
    if (isPrivate) return;

    if (maxLength !== undefined && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    const newTexts = [...recordTexts];
    newTexts[idx] = value;
    setRecordTexts(newTexts);

    if (isRecordFocused.length < recordTexts.length) {
      setIsRecordFocused(prev => [...prev, false]);
    }
  };

  const onFocus = (idx: number) => {
    const newFocus = [...isRecordFocused];
    newFocus[idx] = true;
    setIsRecordFocused(newFocus);
  };

  const onBlur = (idx: number) => {
    const newFocus = [...isRecordFocused];
    newFocus[idx] = false;
    setIsRecordFocused(newFocus);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <label
              className={`header-h5 ${isPrivate ? "text-[#9195A1]" : "text-black"}`}
            >
              {title}
            </label>
          </div>
        </div>
      </div>

      {recordTexts.map((text, idx) => (
        <div key={idx} className="relative mb-4">
          <div className="relative">
            <textarea
              ref={el => {
                textAreaRefs.current[idx] = el;
              }}
              value={text}
              onChange={e => onChangeText(idx, e.target.value)}
              onFocus={() => onFocus(idx)}
              onBlur={() => onBlur(idx)}
              disabled={isPrivate}
              maxLength={maxLength}
              rows={1}
              style={{ resize: "none", overflow: "hidden" }}
              className={`w-full rounded-xl body-md-500 p-3 pb-8 leading-snug border
                ${
                  isPrivate
                    ? "border-[#E4E7EA] cursor-not-allowed"
                    : isRecordFocused[idx]
                      ? "border-[#87C95E]"
                      : "border-[#E4E7EA] text-black"
                }
                focus:outline-none
              `}
            />
            <div className="body-rg-500 absolute bottom-3 right-3 text-[#D6DAE0]">
              ({text.length}/{maxLength})
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
