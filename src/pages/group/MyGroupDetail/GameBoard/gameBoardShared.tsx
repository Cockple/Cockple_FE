import { LEVEL_KEY } from "@/constants/options";

export const notReady = () => alert("준비 중인 기능이에요.");

export const FILTER_LEVEL_OPTIONS = [...LEVEL_KEY.slice(1), "급수없음"];
export const FILTER_GENDER_OPTIONS = ["남성", "여성"];
export const FILTER_SHUTTLE_OPTIONS = ["제출", "미제출"];

export const FilterChipRow = ({
  label,
  options,
}: {
  label: string;
  options: string[];
}) => (
  <div className="flex items-center gap-2">
    <span className="body-rg-600 shrink-0 text-black">{label}</span>
    <div className="flex flex-wrap gap-1.5">
      {options.map(option => (
        <button
          key={option}
          type="button"
          className="shrink-0 rounded-lg border border-gy-200 bg-white px-3 py-1 body-rg-500 text-black"
          onClick={notReady}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);
