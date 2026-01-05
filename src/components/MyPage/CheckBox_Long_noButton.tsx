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
  const [isFocused, setIsFocused] = useState(false);
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
      if (!checked && isFocused) {
        setTexts([value.replace(/원/g, "") || ""]);
      } else {
        setTexts([value || ""]);
      }
    }, [value, isFocused, checked]);

  const togglePrivate = () => {
    const newChecked = !checked;

    if (newChecked) {
      setTexts([""]);
      onChange?.(newChecked, "");
    } else {
      onChange?.(newChecked, Texts[0] || "");
    }
  };


  const onChangeText = (idx: number, newValue: string) => {
    if (checked) return;
    if (maxLength && newValue.length > maxLength) return;

    const newTexts = [...Texts];
    newTexts[idx] = newValue;
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
