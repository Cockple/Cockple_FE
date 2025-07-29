import RedCircle from "@/assets/icons/cicle_s_red.svg?react";

interface TimeInputFieldProps {
  label: string;
  startTime: string;
  endTime: string;
  onClickStart: () => void;
  onClickEnd: () => void;
}

export const TimeInputField = ({
  label,
  startTime,
  endTime,
  onClickStart,
  onClickEnd,
}: TimeInputFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-left flex gap-0.5 items-center">
        <span className="header-h5 ml-1">{label}</span>
        <RedCircle />
      </div>
      <div className="flex gap-1 items-center">
        <input
          className="border-soft outline-none w-40 h-11 py-2.5 px-3 border-1 border-gy-200 cursor-pointer"
          value={startTime}
          readOnly
          onClick={onClickStart}
        />
        <span className="body-md-500 text-black">~</span>
        <input
          className="border-soft outline-none w-40 h-11 py-2.5 px-3 border-1 border-gy-200 cursor-pointer"
          value={endTime}
          readOnly
          onClick={onClickEnd}
        />
      </div>
    </div>
  );
};
