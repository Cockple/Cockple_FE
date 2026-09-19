import { useState } from "react";
import clsx from "clsx";
import { PageHeader } from "@/components/common/system/header/PageHeader";
import TextBox from "@/components/common/Text_Box/TextBox";
import GR400_M from "@/components/common/Btn_Static/Text/GR400_M";
import Refresh from "@/assets/icons/refresh.svg";
import ArrowUp from "@/assets/icons/arrow_up.svg";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import type { GameBoardMemberFilters } from "./gameBoardAdapter";
import {
  GENDER_OPTIONS,
  LEVEL_OPTIONS,
  SHUTTLE_OPTIONS,
  toggleLevelFilter,
} from "./gameFilterOptions";

interface FilterToggleSectionProps {
  title: string;
  options: string[];
  isSelected: (option: string) => boolean;
  onSelect: (value: string) => void;
}

const FilterToggleSection = ({
  title,
  options,
  isSelected,
  onSelect,
}: FilterToggleSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <span className="header-h5 flex-1 text-black">{title}</span>
        <button
          type="button"
          className="flex size-6 items-center justify-center rounded-lg p-1"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <img
            src={ArrowUp}
            alt=""
            className={clsx("size-4", !isOpen && "rotate-180")}
          />
        </button>
      </div>
      {isOpen && (
        <div className="flex flex-wrap items-center gap-[0.8125rem]">
          {options.map(option => (
            <TextBox
              key={option}
              isSelected={isSelected(option)}
              onClick={() => onSelect(option)}
              className="w-19"
            >
              {option}
            </TextBox>
          ))}
        </div>
      )}
    </div>
  );
};

interface GameFilterPageProps {
  variant?: "sheet" | "overlay";
  initialFilters: GameBoardMemberFilters;
  onApply: (filters: GameBoardMemberFilters) => void;
  onClose: () => void;
}

export const GameFilterPage = ({
  variant = "sheet",
  initialFilters,
  onApply,
  onClose,
}: GameFilterPageProps) => {
  useLockBodyScroll(true);
  const [levels, setLevels] = useState<string[]>(initialFilters.levels);
  const [gender, setGender] = useState<string | null>(initialFilters.gender);
  const [shuttle, setShuttle] = useState<string | null>(
    initialFilters.shuttle,
  );

  const handleToggleLevel = (option: string) => {
    setLevels(prev => toggleLevelFilter(prev, option));
  };

  const handleReset = () => {
    setLevels([]);
    setGender("전체");
    setShuttle(null);
  };

  const handleApply = () => {
    onApply({ levels, gender, shuttle });
    onClose();
  };

  const isOverlay = variant === "overlay";

  const sections = (
    <>
      <FilterToggleSection
        title="전국 급수"
        options={LEVEL_OPTIONS}
        isSelected={option =>
          option === "전체" ? levels.length === 0 : levels.includes(option)
        }
        onSelect={handleToggleLevel}
      />
      <div className="h-px w-full bg-gy-100" />

      <FilterToggleSection
        title="성별"
        options={GENDER_OPTIONS}
        isSelected={option => gender === option}
        onSelect={setGender}
      />
      <div className="h-px w-full bg-gy-100" />

      <FilterToggleSection
        title="셔틀콕"
        options={SHUTTLE_OPTIONS}
        isSelected={option => shuttle === option}
        onSelect={value =>
          setShuttle(prev => (prev === value ? null : value))
        }
      />
    </>
  );

  if (isOverlay) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
        onClick={onClose}
      >
        <div
          className="flex max-h-[80vh] w-full max-w-[23.4375rem] flex-col gap-5 overflow-y-auto rounded-3xl bg-white p-4"
          onClick={e => e.stopPropagation()}
        >
          <span className="header-h5 text-black">필터</span>
          <div className="flex w-full flex-col gap-5">{sections}</div>
          <div className="flex w-full gap-[0.5625rem]">
            <button
              type="button"
              className="flex h-11 shrink-0 items-center justify-center rounded-2xl border border-gy-800 bg-white px-3"
              onClick={handleReset}
            >
              <img src={Refresh} alt="초기화" className="size-5" />
            </button>
            <div className="flex-1">
              <GR400_M label="필터 적용" onClick={handleApply} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-1/2 z-50 h-full w-full max-w-[444px] -translate-x-1/2 overflow-y-auto bg-white">
      <PageHeader title="필터" onBackClick={onClose} />

      <div className="flex flex-col gap-5 px-4 pt-19 pb-32">{sections}</div>

      <div className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-[444px] -translate-x-1/2 gap-[0.5625rem] bg-gradient-to-b from-white/0 via-white/80 to-white px-4 pb-9 pt-2">
        <button
          type="button"
          className="flex h-13 flex-1 items-center justify-center rounded-2xl border border-gy-800 bg-white p-3 shadow-ds100"
          onClick={handleReset}
        >
          <img src={Refresh} alt="초기화" className="size-6" />
        </button>
        <div className="shrink-0">
          <GR400_M label="필터 적용" onClick={handleApply} />
        </div>
      </div>
    </div>
  );
};
