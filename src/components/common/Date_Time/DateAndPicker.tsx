import { forwardRef, useImperativeHandle, useState } from "react";
import RenderPickerGroup from "./RenderPickerGroup";

interface DateAndTimePickerProps {
  showTime?: boolean;
}
export interface DateAndTimePickerHandle {
  getDueString: () => string;
}
const DateAndTimePicker = forwardRef<
  DateAndTimePickerHandle,
  DateAndTimePickerProps
>(function DateAndTimePicker(props: DateAndTimePickerProps, ref) {
  const { showTime = false } = props;

  const [selectedYear, setSelectedYear] = useState("2000");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedDay, setSelectedDay] = useState("01");
  const [selectedHours, setSelectedHours] = useState("01");
  const [selectedMinutes, setSelectedMinutes] = useState("00");
  const [selectedPeriods, setSelectedPeriods] = useState("am");

  const getDueString = () => {
    if (showTime) {
      return `${selectedHours}시 ${selectedMinutes}분 ${selectedPeriods}`;
    } else {
      return `${selectedYear}.${selectedMonth}.${selectedDay}`;
    }
  };

  // 부모가 ref로 접근할 수 있게 해줌
  useImperativeHandle(ref, () => ({
    getDueString,
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 75 }, (_, i) =>
    (currentYear - i).toString(),
  ).reverse();
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  // console.log(hours);

  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  const periods = ["am", "pm"];

  return (
    <>
      <div className=" flex w-80 bg-white  mx-auto border border-gray-300 shadow-ds400 rounded-3xl relative ">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className="bg-gy-100 h-10 rounded-lg"
            style={{ width: "calc(100% - 2rem)" }}
          ></div>
        </div>

        {showTime
          ? RenderPickerGroup([
              {
                options: hours,
                selected: selectedHours,
                setSelected: setSelectedHours,
              },
              {
                options: minutes,
                selected: selectedMinutes,
                setSelected: setSelectedMinutes,
              },
              {
                options: periods,
                selected: selectedPeriods,
                setSelected: setSelectedPeriods,
              },
            ])
          : RenderPickerGroup([
              {
                options: years,
                selected: selectedYear,
                setSelected: setSelectedYear,
              },
              {
                options: months,
                selected: selectedMonth,
                setSelected: setSelectedMonth,
              },
              {
                options: days,
                selected: selectedDay,
                setSelected: setSelectedDay,
              },
            ])}
      </div>
    </>
  );
});

export default DateAndTimePicker;
