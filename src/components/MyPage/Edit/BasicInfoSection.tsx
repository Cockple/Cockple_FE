import { useState, useRef } from "react";
import CicleSRED from "@/assets/icons/cicle_s_red.svg?react";
import Female from "@/assets/icons/female.svg?react";
import Male from "@/assets/icons/male.svg?react";
import Circle_Red from "@/assets/icons/cicle_s_red.svg?url";
import DateAndTimePicker from "@/components/common/Date_Time/DateAndPicker";

interface Props {
  name: string;
  gender: "FEMALE" | "MALE" | "UNKNOWN";
  birth: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBirthChange: (date: string) => void;
}

export const BasicInfoSection = ({ name, gender, birth, onNameChange, onBirthChange }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const pickerRef = useRef<{ getDueString: () => string }>(null);

  const handleCloseOverlay = () => {
    if (pickerRef.current) {
      const date = pickerRef.current.getDueString();
      onBirthChange(date);
    }
    setOpenModal(false);
  };

  return (
    <>
      {/* 이름 */}
      <div className="mb-8">
        <label className="flex items-center text-left header-h5 mb-1">
          이름 <CicleSRED />
        </label>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={onNameChange}
            className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none focus:border-active"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C0C4CD] body-rg-500">
            ({name?.length ?? 0}/17)
          </span>
        </div>
      </div>

      {/* 성별 */}
      <div className="mb-8 flex justify-between items-center">
        <label className="text-left header-h5">성별</label>
        <div className="flex items-center header-h5 gap-2">
          {gender === "FEMALE" ? (
            <>여성 <Female className="w-4 h-4" /></>
          ) : gender === "MALE" ? (
            <>남성 <Male className="w-4 h-4" /></>
          ) : (
            <>회원가입 성별 미선택</>
          )}
        </div>
      </div>

      {/* 생년월일 */}
      <div className="mb-8 flex flex-col items-start">
        <div className="w-full text-left flex flex-col gap-2">
          <div className="flex px-1 gap-[2px] items-center">
            <p className="header-h5">생년월일</p>
            <img src={Circle_Red} alt="icon-cicle" />
          </div>
          <input
            type="text"
            className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none focus:border-active"
            value={birth}
            readOnly
            onClick={() => setOpenModal(true)}
          />
          {openModal && (
            <div
              id="date-picker-overlay"
              className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
              onClick={(e) => (e.target as HTMLElement).id === "date-picker-overlay" && handleCloseOverlay()}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <DateAndTimePicker ref={pickerRef} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};