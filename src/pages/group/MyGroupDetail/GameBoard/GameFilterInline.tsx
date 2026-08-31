import clsx from "clsx";
import type { GameBoardMemberFilters } from "./gameBoardAdapter";
import {
  GENDER_OPTIONS_INLINE,
  LEVEL_OPTIONS_INLINE,
  SHUTTLE_OPTIONS,
  toggleLevelFilter,
} from "./gameFilterOptions";

interface GameFilterInlineProps {
  filters: GameBoardMemberFilters;
  onChange: (next: GameBoardMemberFilters) => void;
}

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

// 피그마 Text Box_XS: 흰 배경 / gy-100 테두리 / DS100 그림자, 선택 시 gr-600 테두리 + 초록 그림자
const FilterChip = ({ label, selected, onClick }: FilterChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      "flex items-center justify-center rounded-lg border px-2 py-1 body-sm-500 whitespace-nowrap",
      selected
        ? "border-gr-600 bg-white text-black shadow-ds200-gr"
        : "border-gy-100 bg-white text-black shadow-ds100",
    )}
  >
    {label}
  </button>
);

interface FilterSectionProps {
  title: string;
  options: string[];
  isSelected: (option: string) => boolean;
  onSelect: (value: string) => void;
}

const FilterSection = ({
  title,
  options,
  isSelected,
  onSelect,
}: FilterSectionProps) => (
  <div className="flex items-center gap-3">
    <span className="body-rg-500 shrink-0 text-black">{title}</span>
    <div className="flex flex-wrap items-center gap-3">
      {options.map(option => (
        <FilterChip
          key={option}
          label={option}
          selected={isSelected(option)}
          onClick={() => onSelect(option)}
        />
      ))}
    </div>
  </div>
);

// PC(웹뷰) 전용: 필터를 버튼/오버레이 대신 명단 위에 한 줄로 펼쳐 두고 선택 즉시 반영한다.
export const GameFilterInline = ({
  filters,
  onChange,
}: GameFilterInlineProps) => (
  <div className="flex flex-wrap items-center gap-x-11 gap-y-4">
    <FilterSection
      title="전국 급수"
      options={LEVEL_OPTIONS_INLINE}
      isSelected={option => filters.levels.includes(option)}
      onSelect={option =>
        onChange({
          ...filters,
          levels: toggleLevelFilter(filters.levels, option),
        })
      }
    />
    <FilterSection
      title="성별"
      options={GENDER_OPTIONS_INLINE}
      isSelected={option => filters.gender === option}
      onSelect={value =>
        onChange({
          ...filters,
          gender: filters.gender === value ? "전체" : value,
        })
      }
    />
    <FilterSection
      title="셔틀콕"
      options={SHUTTLE_OPTIONS}
      isSelected={option => filters.shuttle === option}
      onSelect={value =>
        onChange({
          ...filters,
          shuttle: filters.shuttle === value ? null : value,
        })
      }
    />
  </div>
);
