import ArrowRight from "@/assets/icons/arrow_right.svg";
import Clear_XS from "../common/Btn_Static/Icon_Btn/Clear_XS";
import { Exercise_M } from "../common/contentcard/Exercise_M";
import { useNavigate } from "react-router-dom";
import { useRecommendedExerciseApi } from "../../api/exercise/getRecommendedExerciseApi";

export const RecommendedWorkoutSection = () => {
  const navigate = useNavigate();

  const { data } = useRecommendedExerciseApi();

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between header-h4">
        운동 추천{" "}
        <Clear_XS
          iconMap={{
            disabled: ArrowRight,
            default: ArrowRight,
            pressing: ArrowRight,
            clicked: ArrowRight,
          }}
          onClick={() => navigate("/recommend")}
        />
      </div>

      <div className="flex flex-col gap-2">
        {data && data.exercises.length > 0 ? (
          data.exercises.map((item, index) => (
            <Exercise_M
              id={index}
              key={item.exerciseId}
              title={item.partyName}
              date={item.date}
              time={item.startTime + " - " + item.endTime}
              location={item.buildingName}
              imageSrc={item.profileImageUrl ?? ""}
              onClick={() => navigate(`/group/${item.partyId}`)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            예정된 추천 운동이 없습니다
          </div>
        )}
      </div>
    </div>
  );
};
