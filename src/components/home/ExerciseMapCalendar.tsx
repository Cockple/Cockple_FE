import MonthlyCalendar from "../common/Date_Time/MonthCalendar";

interface ExerciseMapCalendarProps {
  onClose: () => void;
}

export const ExerciseMapCalendar = ({ onClose }: ExerciseMapCalendarProps) => {
  return (
    <div
      className="fixed bottom-0 bg-black/20 w-full h-full max-w-[444px] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="py-4 border-curve shadow-ds400 bg-white"
        onClick={e => e.stopPropagation()}
      >
        <MonthlyCalendar />
      </div>
    </div>
  );
};
