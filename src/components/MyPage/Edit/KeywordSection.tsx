import TextBox from "@/components/common/Text_Box/TextBox";
import { KEYWORD_LINES } from "./constants";

interface Props {
  selectedKeywords: string[];
  onToggleKeyword: (keyword: string) => void;
}

export const KeywordSection = ({ selectedKeywords, onToggleKeyword }: Props) => {
  return (
    <div className="mt-8">
      <label className="flex items-center text-left header-h5 mb-1">키워드</label>
      <div className="flex flex-col gap-3 items-center">
        {KEYWORD_LINES.map((line, i) => (
          <div key={i} className="flex gap-4 flex-wrap">
            {line.map((k) => {
              const isSelected = selectedKeywords.includes(k);
              return (
                <TextBox
                  key={k}
                  isSelected={isSelected}
                  className={`py-2 rounded-xl whitespace-nowrap w-auto max-w-full ${
                    k === "친목" ? "px-[1.4rem]" : "px-[2.7rem]"
                  }`}
                  onClick={() => onToggleKeyword(k)}
                >
                  {k}
                </TextBox>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};