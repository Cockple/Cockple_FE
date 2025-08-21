import { useState, useEffect, useRef } from "react";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import White_L_Thin_Add from "./White_L_Thin_Add";
import Dismiss from "../../assets/icons/dismiss.svg?react";
import { useForm, Controller } from "react-hook-form";
interface MyMedalCheckBoxProps {
  title: string;
  value: string[];                        
  onChange: (newLinks: string[]) => void; 
}

export const MyMedalCheckBox: React.FC<MyMedalCheckBoxProps> = ({
  title,
  value,
  onChange
}) => {
  const [recordTexts, setRecordTexts] = useState<string[]>(value.length ? [...value] : [""]);
  const { control } = useForm();
  const [isPrivate, setIsPrivate] = useState(false);
  const textAreaRefs = useRef<(HTMLInputElement | null)[]>([]);

  const adjustHeight = (idx: number) => {
    const textarea = textAreaRefs.current[idx];
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  // value가 바뀌면 내부 state 동기화
  useEffect(() => {
    setRecordTexts(value && value.length ? [...value] : [""]);
  }, [value]);

  useEffect(() => {
    recordTexts.forEach((_, idx) => adjustHeight(idx));
  }, [recordTexts]);

  const onChangeText = (idx: number, value: string) => {
    const newLinks = [...recordTexts];
    newLinks[idx] = value;
    setRecordTexts(newLinks);
    onChange(newLinks.filter(v => v.trim() !== "")); // 빈 문자열 제거 후 전달
  };

  const handleRemove = (idx: number) => {
    const updated = [...recordTexts];
    updated.splice(idx, 1);
    setRecordTexts(updated.length ? updated : [""]);
    onChange(updated.filter(v => v.trim() !== ""));
  };



  const handleAdd = () => {
    const updated = [...recordTexts, ""];
    setRecordTexts(updated);
    onChange(updated);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className={`header-h5 ${isPrivate ? "text-[#9195A1]" : "text-black"}`}>
          {title}
        </label>
        <button onClick={() => setIsPrivate(prev => !prev)} type="button">
          {isPrivate ? <CheckCircledFilled className="w-4 h-4" /> : <CheckCircled className="w-4 h-4" />}
        </button>
      </div>

      {recordTexts.map((text, idx) => {
        const showDismiss = text.trim() !== "";
        return (
          <div key={idx} className="relative">
            <Controller
              name={`name_${idx}`}
              control={control}
              defaultValue={text}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  disabled={isPrivate}
                  style={{ paddingRight: "3rem" }}
                  className="w-full rounded-xl border border-gy-200 py-[0.625rem] px-3 focus:outline-none overflow-hidden whitespace-nowrap text-ellipsis focus:border-active"
                  ref={el => {
                    field.ref(el);
                    textAreaRefs.current[idx] = el;
                    if (el) adjustHeight(idx);
                  }}
                  onChange={e => {
                    field.onChange(e);
                    onChangeText(idx, e.target.value);
                  }}
                  value={recordTexts[idx]}
                />
              )}
            />
            {showDismiss && (
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1/2 -translate-y-1/2 right-2 w-5 h-5"
              >
                <Dismiss className="w-full h-full" />
              </button>
            )}
          </div>
        );
      })}

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {!isPrivate && recordTexts[recordTexts.length - 1].trim() !== "" && (
        <White_L_Thin_Add label="추가하기" onClick={handleAdd} />
      )}
    </div>
    </div>
  );
};
