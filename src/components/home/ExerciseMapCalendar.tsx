import MonthlyCalendar from "../common/Date_Time/MonthCalendar";

interface ExerciseMapCalendarProps {
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (date: string | number) => void;
  exerciseDays: string[];
}

export const ExerciseMapCalendar = ({
  onClose,
  selectedDate,
  onSelectDate,
  exerciseDays,
}: ExerciseMapCalendarProps) => {
  return (
    <div
      className="fixed bottom-0 bg-black/20 w-full h-full max-w-[444px] flex items-center justify-center left-1/2 translate-x-[-50%]"
      onClick={onClose}
    >
      <div
        className="py-4 border-curve shadow-ds400 bg-white"
        onClick={e => e.stopPropagation()}
      >
        <MonthlyCalendar
          selectedDate={selectedDate}
          onClick={onSelectDate}
          exerciseDays={exerciseDays}
        />
      </div>
    </div>
  );
};
