import { useState, useEffect, useRef } from "react";
import CheckCircled from "../../assets/icons/check_circled.svg?react";
import CheckCircledFilled from "../../assets/icons/check_circled_filled.svg?react";
import White_L_Thin_Add from "./White_L_Thin_Add";
import Dismiss from "../../assets/icons/dismiss.svg?react";

interface MyMedalCheckBoxProps {
  title: string;
  Label: string;
  value: string[];
  onChange: (newLinks: string[]) => void;
}

export const MyMedalCheckBox: React.FC<MyMedalCheckBoxProps> = ({
  title,
  Label,
  value,
  onChange,
}) => {
  const [recordTexts, setRecordTexts] = useState<string[]>(
    value && value.length > 0 ? [...value] : [""]
  );
  
  const [isPrivate, setIsPrivate] = useState(false);
  const textAreaRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setRecordTexts(value && value.length > 0 ? [...value] : [""]);
  }, [value]);

  const onChangeText = (idx: number, text: string) => {
    const newLinks = [...recordTexts];
    newLinks[idx] = text;
    setRecordTexts(newLinks);
    onChange(newLinks); 
  };

  const handleRemove = (idx: number) => {
    const updated = [...recordTexts];
    updated.splice(idx, 1);
    
    const newList = updated.length ? updated : [""];
  
    setRecordTexts(newList);
    onChange(newList.filter(v => v.trim() !== ""));
  };

  const handleAdd = () => {
    const updated = [...recordTexts, ""];
    setRecordTexts(updated);
    onChange(updated);
  };

  const handleTogglePrivate = () => {
    const newIsPrivate = !isPrivate;
    setIsPrivate(newIsPrivate);

    // 비공개 상태로 전환될 때 모든 입력 내용을 비웁니다.
    if (newIsPrivate) {
      const emptyList = [""];
      setRecordTexts(emptyList);
      onChange(emptyList);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
       <div className="flex justify-between items-start">
        <div className="flex items-center">
          <label className={`header-h5 ${isPrivate ? "text-[#9195A1]" : "text-black"}`}>
                  {title}
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleTogglePrivate} type="button">
          {isPrivate ? (
            <CheckCircledFilled className="w-4 h-4" />
          ) : (
            <CheckCircled className="w-4 h-4" />
          )}
        </button>
        <label className="body-rg-500 px-1">{Label}</label>
        </div>
      </div>

      {recordTexts.map((text, idx) => {
        const showDismiss = text.trim() !== "";
        return (
          <div key={idx} className="relative">
           <input
              type="text"
              disabled={isPrivate} 
              style={{ paddingRight: "3rem" }}
              className="w-full rounded-xl border border-gy-200 py-[0.625rem] px-3 focus:outline-none overflow-hidden whitespace-nowrap text-ellipsis focus:border-active"
              value={text} 
              onChange={(e) => onChangeText(idx, e.target.value)}
              ref={(el) => {
                textAreaRefs.current[idx] = el;
              }}
              placeholder={isPrivate ? "" : "영상 링크를 입력해주세요"}
            />
            {showDismiss && !isPrivate && (
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1/2 -translate-y-1/2 right-2 w-5 h-5 flex items-center justify-center"
              >
                <Dismiss className="w-full h-full" />
              </button>
            )}
          </div>
        );
      })}

      <div style={{ display: "flex", justifyContent: "center" }}>
        {!isPrivate &&
          recordTexts.length > 0 &&
          recordTexts[recordTexts.length - 1].trim() !== "" && (
            <White_L_Thin_Add label="추가하기" onClick={handleAdd} />
          )}
      </div>
    </div>
  );
};