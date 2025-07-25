import { DailyExercise_S } from "../common/contentcard/DailyExercise_S";
import TextIconBtnM from "../common/DynamicBtn/TextIconBtnM";
import type { DailyExerciseItem } from "../../pages/home/HomePage";

interface WorkoutDayEntryProps {
  exerciseData: DailyExerciseItem[] | null;
}

export const WorkoutDayEntry = ({ exerciseData }: WorkoutDayEntryProps) => {
  if (!exerciseData || exerciseData.length === 0) {
    return (
      <div className="w-full h-20 flex items-center justify-center">
        <TextIconBtnM>운동 둘러보기</TextIconBtnM>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {exerciseData.map(item => (
        <DailyExercise_S
          key={item.id}
          title={item.title}
          location={item.location}
          time={item.time}
          imageSrc={item.imgSrc}
        />
      ))}
    </div>
  );
};
