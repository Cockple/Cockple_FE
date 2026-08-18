import { useState } from "react";
import clsx from "clsx";
import { PageHeader } from "@/components/common/system/header/PageHeader";
import TextBox from "@/components/common/Text_Box/TextBox";
import GR400_M from "@/components/common/Btn_Static/Text/GR400_M";
import Refresh from "@/assets/icons/refresh.svg";
import ArrowUp from "@/assets/icons/arrow_up.svg";
import { LEVEL_KEY } from "@/constants/options";

const LEVEL_OPTIONS = [...LEVEL_KEY, "급수없음"];
const GENDER_OPTIONS = ["전체", "남성", "여성"];
const SHUTTLE_OPTIONS = ["제출함", "미제출"];

interface FilterToggleSectionProps {
  title: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}

const FilterToggleSection = ({
  title,
  options,
  selected,
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
              isSelected={selected === option}
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
  onClose: () => void;
}

export const GameFilterPage = ({ onClose }: GameFilterPageProps) => {
  const [level, setLevel] = useState<string | null>("전체");
  const [gender, setGender] = useState<string | null>("전체");
  const [shuttle, setShuttle] = useState<string | null>(null);

  const handleReset = () => {
    setLevel("전체");
    setGender("전체");
    setShuttle(null);
  };

  return (
    <div className="fixed top-0 left-1/2 z-50 h-full w-full max-w-[444px] -translate-x-1/2 overflow-y-auto bg-white">
      <PageHeader title="필터" onBackClick={onClose} />

      <div className="flex flex-col gap-5 px-4 pt-19 pb-32">
        <FilterToggleSection
          title="전국 급수"
          options={LEVEL_OPTIONS}
          selected={level}
          onSelect={setLevel}
        />
        <div className="h-px w-full bg-gy-100" />

        <FilterToggleSection
          title="성별"
          options={GENDER_OPTIONS}
          selected={gender}
          onSelect={setGender}
        />
        <div className="h-px w-full bg-gy-100" />

        <FilterToggleSection
          title="셔틀콕"
          options={SHUTTLE_OPTIONS}
          selected={shuttle}
          onSelect={value =>
            setShuttle(prev => (prev === value ? null : value))
          }
        />
        <div className="h-px w-full bg-gy-100" />
      </div>

      <div className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-[444px] -translate-x-1/2 gap-[0.5625rem] bg-gradient-to-b from-white/0 via-white/80 to-white px-4 pb-9 pt-2">
        <button
          type="button"
          className="flex h-13 flex-1 items-center justify-center rounded-2xl border border-gy-800 bg-white p-3 shadow-ds100"
          onClick={handleReset}
        >
          <img src={Refresh} alt="초기화" className="size-6" />
        </button>
        <div className="shrink-0">
          <GR400_M label="필터 적용" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};
