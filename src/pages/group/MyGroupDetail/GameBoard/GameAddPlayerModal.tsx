import { useState } from "react";
import { PageHeader } from "@/components/common/system/header/PageHeader";
import InputField from "@/components/common/Search_Filed/InputField";
import TextBox from "@/components/common/Text_Box/TextBox";
import DropCheckBox from "@/components/common/Drop_Box/DropCheckBox";
import { DropBox } from "@/components/common/DropBox";
import Grad_GR400_L from "@/components/common/Btn_Static/Text/Grad_GR400_L";
import GR400_M from "@/components/common/Btn_Static/Text/GR400_M";
import Circle_RedIcon from "@/assets/icons/cicle_s_red.svg?url";
import { LEVEL_KEY } from "@/constants/options";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const AGE_OPTIONS = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];

export interface NewGamePlayer {
  name: string;
  gender: "MALE" | "FEMALE";
  level: string;
  ageGroup: string;
}

interface GameAddPlayerModalProps {
  variant?: "sheet" | "overlay";
  onClose: () => void;
  onSubmit: (player: NewGamePlayer) => void;
}

export const GameAddPlayerModal = ({
  variant = "sheet",
  onClose,
  onSubmit,
}: GameAddPlayerModalProps) => {
  useLockBodyScroll(true);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | null>(null);
  const [level, setLevel] = useState("");
  const [ageGroup, setAgeGroup] = useState("");

  const levelOptions = LEVEL_KEY.slice(1);
  const isLevelValid = level === "disabled" || levelOptions.includes(level);
  const isFormValid = name.trim().length > 0 && gender !== null && isLevelValid;

  const handleSubmit = () => {
    if (!isFormValid || gender === null) return;
    onSubmit({
      name: name.trim(),
      gender,
      level: level === "disabled" ? "급수없음" : level,
      ageGroup,
    });
  };

  const fields = (
    <>
      <InputField
        labelName="이름"
        value={name}
        InputLength={name.length}
        InputMaxLength={17}
        onChange={e => setName(e.target.value.slice(0, 17))}
      />

      <div className="flex flex-col gap-2 text-left">
        <div className="flex items-center gap-[2px] px-1">
          <span className="header-h5 text-black">성별</span>
          <img src={Circle_RedIcon} alt="" />
        </div>
        <div className="flex gap-[13px]">
          <TextBox
            isSelected={gender === "MALE"}
            onClick={() => setGender(prev => (prev === "MALE" ? null : "MALE"))}
            className="w-19"
          >
            남성
          </TextBox>
          <TextBox
            isSelected={gender === "FEMALE"}
            onClick={() =>
              setGender(prev => (prev === "FEMALE" ? null : "FEMALE"))
            }
            className="w-19"
          >
            여성
          </TextBox>
        </div>
      </div>

      <DropCheckBox
        title="전국 급수"
        options={levelOptions}
        checkLabel="급수 없음"
        value={level}
        onChange={val => setLevel(val ?? "")}
      />

      <div className="flex flex-col gap-2 text-left">
        <span className="header-h5 px-1 text-black">나이대</span>
        <DropBox
          options={AGE_OPTIONS.map(value => ({ value }))}
          value={ageGroup}
          onChange={setAgeGroup}
        />
      </div>
    </>
  );

  if (variant === "overlay") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
        onClick={onClose}
      >
        <div
          className="flex w-full max-w-[23.4375rem] flex-col items-center gap-5 rounded-3xl bg-white p-4"
          onClick={e => e.stopPropagation()}
        >
          <span className="header-h5 text-black">명단 추가</span>
          <div className="flex w-full flex-col gap-8">{fields}</div>
          <GR400_M
            label="저장하기"
            initialStatus={isFormValid ? "default" : "disabled"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-1/2 z-50 h-full w-full max-w-[444px] -translate-x-1/2 overflow-y-auto bg-white">
      <PageHeader title="명단 추가" onBackClick={onClose} />
      <div className="flex flex-col gap-8 px-4 pt-19 pb-32">{fields}</div>

      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[444px] -translate-x-1/2">
        <Grad_GR400_L
          label="선수 추가하기"
          initialStatus={isFormValid ? "default" : "disabled"}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};
