import { useState, useEffect, useRef } from "react";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import VectorRed from "../../assets/icons/Vector_red.svg?react";

interface CheckBoxLongnoButton {
  title?: string;
  Label? : string;
  maxLength?: number;
  showIcon?: boolean;
  onChange?: (checked: boolean, value: string) => void;
}

export const CheckBox_Long_noButton = ({
  title,
  Label,
  maxLength,
  showIcon = false,
  onChange,
}: CheckBoxLongnoButton) => {
  const [recordTexts, setRecordTexts] = useState<string[]>([""]);
  const [isPrivate, setIsPrivate] = useState(false);
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

    const newTexts = [...recordTexts];
    newTexts[idx] = value;
    setRecordTexts(newTexts);

    if (isRecordFocused.length < recordTexts.length) {
      setIsRecordFocused(prev => [...prev, false]);
    }
      onChange?.(false, newTexts[0] || "");

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
            {showIcon && <VectorRed className="ml-1 w-2 h-2" />} 

          </div>
          <div className="flex items-center gap-2">
            <button
              // onClick={() => setIsPrivate(prev => !prev)}
            onClick={() => {
              const newChecked = !isPrivate;
              setIsPrivate(newChecked);
              onChange?.(newChecked, recordTexts[0] || "");
            }}
              type="button"
              className="focus:outline-none"
            >
              {isPrivate ? (
                <CheckCircledFilled className="w-4 h-4" />
              ) : (
                <CheckCircled className="w-4 h-4" />
              )}
            </button>
            <label className={`body-rg-500`}>{Label}</label>
          </div>
        </div>
      </div>

      {recordTexts.map((text, idx) => (
        <div key={idx} className="relative mb-4">
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
            className={`w-full rounded-xl body-md-500 p-3 leading-snug border
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
          <div className="body-rg-500 absolute bottom-5 right-3 text-[#D6DAE0]">
            {/* ({text.length}/{maxLength}) */}
          </div>
        </div>
      ))}
    </div>
  );
};
