import { useState, useEffect, useRef } from "react";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import White_L_Thin_Add from "./White_L_Thin_Add";
import Dismiss from "../../assets/icons/dismiss.svg?react";
import { useForm, Controller } from "react-hook-form";

interface CheckBoxDismissTruncateProps {
  title: string;
  value: string[];                       
  onChange: (newLinks: string[]) => void;  
}

export const MyMedalCheckBox: React.FC<CheckBoxDismissTruncateProps> = ({
  title,
  value,
  onChange
}) => {
  const [recordTexts, setRecordTexts] = useState<string[]>(value.length ? value : [""]);
  const { control, setValue } = useForm();

  // const [recordTexts, setRecordTexts] = useState<string[]>([""]);
  const [isPrivate, setIsPrivate] = useState(false);

  const textAreaRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    const newTexts = [...recordTexts];
    newTexts[idx] = value;
    setRecordTexts(newTexts);
    onChange(newTexts); // 부모에 전달
  };

  const handleRemove = (idx: number) => {
    const updated = [...recordTexts];
    if (updated.length === 1) {
      updated[0] = "";
    } else {
      updated.splice(idx, 1);
    }
    setRecordTexts(updated);
    onChange(updated); // 부모에 전달
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
            <label className="body-rg-500">비공개</label>
          </div>
        </div>
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

      {!isPrivate && recordTexts[recordTexts.length - 1].trim() !== "" && (
       <White_L_Thin_Add
          label="추가하기"
          onClick={() => {
            const updated = [...recordTexts, ""];
            setRecordTexts(updated);
            onChange(updated); // 부모에 전달
          }}
        />
      )}
    </div>
  );
};
