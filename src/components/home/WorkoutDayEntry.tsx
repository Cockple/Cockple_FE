import { DailyExercise_S } from "../common/contentcard/DailyExercise_S";
import TextIconBtnM from "../common/DynamicBtn/TextIconBtnM";
import DefaultGroupImg from "@/assets/icons/defaultGroupImg.svg?url";
import { useNavigate } from "react-router-dom";
import type { Exercise } from "../../types/calendar";

interface WorkoutDayEntryProps {
  exerciseData: Exercise[] | null;
  onExerciseClick?: (exerciseId: number) => void;
  isLoading?: boolean;
}

const DailyExerciseSkeletonItem = () => (
  <div className="p-[0.5rem] w-full h-[5rem] rounded-[0.75rem] shadow-ds50 flex items-center gap-3">
    <div className="w-[4rem] h-[4rem] rounded-[0.5rem] bg-gy-100 animate-pulse shrink-0" />
    <div className="flex flex-col gap-[0.5rem] flex-1">
      <div className="h-[0.875rem] w-[8rem] bg-gy-100 animate-pulse rounded" />
      <div className="h-[0.75rem] w-[6rem] bg-gy-100 animate-pulse rounded" />
      <div className="h-[0.75rem] w-[5rem] bg-gy-100 animate-pulse rounded" />
    </div>
  </div>
);

export const WorkoutDayEntry = ({
  exerciseData,
  onExerciseClick,
  isLoading = false,
}: WorkoutDayEntryProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <DailyExerciseSkeletonItem />;
  }

  if (!exerciseData || exerciseData.length === 0) {
    return (
      <div className="w-full h-20 flex items-center justify-center">
        <TextIconBtnM onClick={() => navigate("/recommend")}>
          운동 둘러보기
        </TextIconBtnM>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {exerciseData.map(item => (
        <DailyExercise_S
          key={item.exerciseId}
          title={item.partyName}
          location={item.buildingName}
          time={item.startTime + " - " + item.endTime}
          imageSrc={item.profileImageUrl ?? DefaultGroupImg}
          onClick={() => onExerciseClick?.(item.exerciseId)}
        />
      ))}
    </div>
  );
};
