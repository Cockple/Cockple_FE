import { DailyExercise_S } from "../common/contentcard/DailyExercise_S";
import TextIconBtnM from "../common/DynamicBtn/TextIconBtnM";

import { useNavigate } from "react-router-dom";
import type { Exercise } from "../../types/calendar";

interface WorkoutDayEntryProps {
  exerciseData: Exercise[] | null;
}

export const WorkoutDayEntry = ({ exerciseData }: WorkoutDayEntryProps) => {
  const navigate = useNavigate();
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
          imageSrc={item.profileImageUrl}
          onClick={() => navigate(`/group/${item.partyId}`)}
        />
      ))}
    </div>
  );
};
