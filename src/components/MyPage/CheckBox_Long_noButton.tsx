import { useState, useEffect, useRef } from "react";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import CicleSRED from "../../assets/icons/cicle_s_red.svg?react";

interface CheckBoxLongnoButton {
  title?: string;
  Label?: string;
  maxLength?: number;
  showIcon?: boolean;
  value?: string;
  checked?: boolean;                  
  onChange?: (checked: boolean, value: string) => void;
}

export const CheckBox_Long_noButton = ({
  title,
  Label,
  maxLength,
  showIcon = false,
  value = "",
  checked = false,                    
  onChange,
}: CheckBoxLongnoButton) => {
  const [Texts, setTexts] = useState<string[]>([value]);
  const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const adjustHeight = (idx: number) => {
    const textarea = textAreaRefs.current[idx];
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    Texts.forEach((_, idx) => adjustHeight(idx));
  }, [Texts]);

  useEffect(() => {
    setTexts([value || ""]);
  }, [value]);

  const togglePrivate = () => {
    const newChecked = !checked;

    // 체크가 true가 되면 텍스트 초기화
    if (newChecked) {
      setTexts([""]);
      onChange?.(newChecked, "");
    } else {
      onChange?.(newChecked, Texts[0] || "");
    }
  };


  const onChangeText = (idx: number, value: string) => {
    if (checked) return; // 체크 상태면 수정 불가
    if (maxLength && value.length > maxLength) return;

    const newTexts = [...Texts];
    newTexts[idx] = value;
    setTexts(newTexts);

    onChange?.(checked, newTexts[0] || "");
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <label className={`header-h5 ${checked ? "text-[#9195A1]" : "text-black"}`}>
            {title}
          </label>
          {showIcon && <CicleSRED />}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={togglePrivate} className="focus:outline-none">
            {checked ? <CheckCircledFilled className="w-4 h-4" /> : <CheckCircled className="w-4 h-4" />}
          </button>
          <label className="body-rg-500 px-1">{Label}</label>
        </div>
      </div>

      {Texts.map((text, idx) => (
       <textarea
          ref={el => {
            textAreaRefs.current[idx] = el;  
          }}
          value={text}
          onChange={e => onChangeText(idx, e.target.value)}
          disabled={checked}
          maxLength={maxLength}
          rows={1}
          style={{ resize: "none", overflow: "hidden" }}
          className="w-full rounded-xl border border-gy-200 py-[0.625rem] px-3 focus:outline-none overflow-hidden whitespace-nowrap text-ellipsis focus:border-active"
        />
      ))}
    </div>
  );
};
