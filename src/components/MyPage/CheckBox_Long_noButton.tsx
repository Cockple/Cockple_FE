import { useState, useEffect, useRef } from "react";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import CicleSRED from "../../assets/icons/cicle_s_red.svg?react";

interface CheckBoxLongnoButton {
  title?: string;
  Label? : string;
  maxLength?: number;
  showIcon?: boolean;
  onChange?: (checked: boolean, value: string) => void;
  showLengthIndicator?: boolean; 
}

export const CheckBox_Long_noButton = ({
  title,
  Label,
  maxLength,
  showIcon = false,
  showLengthIndicator = false, 
  onChange,
}: CheckBoxLongnoButton) => {
  const [Texts, setTexts] = useState<string[]>([""]);
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
    Texts.forEach((_, idx) => {
      adjustHeight(idx);
    });
  }, [Texts]);

  const onChangeText = (idx: number, value: string) => {
    if (isPrivate) return;
    if (maxLength && value.length > maxLength) return;

    const newTexts = [...Texts];
    newTexts[idx] = value;
    setTexts(newTexts);

    if (isRecordFocused.length < Texts.length) {
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
            {showIcon && <CicleSRED/>} 

          </div>
          <div className="flex items-center gap-2">
            <button
              // onClick={() => setIsPrivate(prev => !prev)}
            onClick={() => {
              const newChecked = !isPrivate;
              setIsPrivate(newChecked);
              onChange?.(newChecked, Texts[0] || "");
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
            <label className={`body-rg-500 px-1`}>{Label}</label>
          </div>
        </div>
      </div>

      {Texts.map((text, idx) => (
        <div key={idx} className="relative">
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
            {showLengthIndicator && (
              <div className="body-rg-500 absolute bottom-5 right-3 text-[#D6DAE0]">
                ({text.length}/{maxLength})
              </div>
            )}
        </div>
      ))}
    </div>
  );
};
