import ArrowRight from "@/assets/icons/arrow_right.svg";
import Clear_XS from "../common/Btn_Static/Icon_Btn/Clear_XS";
import { Exercise_M } from "../common/contentcard/Exercise_M";
import { useNavigate } from "react-router-dom";
import { useRecommendedExerciseApi } from "../../api/exercise/getRecommendedExerciseApi";

export const RecommendedWorkoutSection = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useRecommendedExerciseApi();

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !data) return <div>오류 발생</div>;

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
        {data &&
          data.exercises.map((item, index) => (
            <Exercise_M
              id={index}
              key={item.exerciseId}
              title={item.partyName}
              date={item.date}
              time={item.startTime + " - " + item.endTime}
              location={item.buildingName}
              imageSrc={item.imageUrl ?? ""}
              onClick={() => navigate(`/group/${item.partyId}`)}
            />
          ))}
      </div>
    </div>
  );
};
