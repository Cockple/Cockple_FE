import { useState, useEffect, useRef } from "react";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import White_L_Thin_Add from "../../components/MyPage/White_L_Thin_Add";
import VectorRed from "../../assets/icons/Vector_red.svg?react";

interface CheckBoxLongProps {
  title?: string;
  maxLength?: number;
  errors?: Record<number, string>;
  onValidate?: (text: string) => string | null;
}

export const CheckBox_Long = ({
  title,
  maxLength = 100,
  errors = {},
  onValidate,
}: CheckBoxLongProps) => {
  const [recordTexts, setRecordTexts] = useState<string[]>([""]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isRecordFocused, setIsRecordFocused] = useState<boolean[]>([false]);
  const [localErrors, setLocalErrors] = useState<Record<number, string>>({});

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

    let errorMsg = "";
    if (onValidate) {
      const validationResult = onValidate(value);
      if (validationResult) errorMsg = validationResult;
    } else {
      if (value.trim() === "") errorMsg = "필수 입력입니다";
    }

    setLocalErrors(prev => ({ ...prev, [idx]: errorMsg }));
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

  const handleAdd = () => {
    setRecordTexts(prev => [...prev, ""]);
    setIsRecordFocused(prev => [...prev, false]);
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
            <VectorRed className="ml-1 w-2 h-2" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPrivate(prev => !prev)}
              type="button"
              className="focus:outline-none"
            >
              {isPrivate ? (
                <CheckCircledFilled className="w-4 h-4" />
              ) : (
                <CheckCircled className="w-4 h-4" />
              )}
            </button>
            <label className={`body-rg-500`}>비공개</label>
          </div>
        </div>
      </div>

      {recordTexts.map((text, idx) => {
        // 우선순위: 외부 errors prop > 내부 localErrors
        const errorMsg = errors[idx] ?? localErrors[idx] ?? "";
        const hasError = !!errorMsg;

        return (
          <div key={idx} className="relative mb-4">
            <textarea
              ref={el => (textAreaRefs.current[idx] = el)}
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
                    : hasError
                      ? "border-[#F62D2D]"
                      : isRecordFocused[idx]
                        ? "border-[#87C95E]"
                        : "border-[#E4E7EA] text-black"
                }
                focus:outline-none
              `}
            />
            <div className="body-rg-500 absolute bottom-5 right-3 text-[#D6DAE0]">
              ({text.length}/{maxLength})
            </div>
            {hasError && (
              <p className="body-sm-500 text-[#F62D2D] text-left mt-1">
                {errorMsg}
              </p>
            )}
          </div>
        );
      })}

      {/* 추가하기 버튼 */}
      {!isPrivate && recordTexts[recordTexts.length - 1].trim() !== "" && (
        <div className="mt-1">
          <White_L_Thin_Add label="추가하기" onClick={handleAdd} />
        </div>
      )}
    </div>
  );
};
