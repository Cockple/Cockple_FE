import ArrowRight from "@/assets/icons/arrow_right.svg";
import Clear_XS from "../common/Btn_Static/Icon_Btn/Clear_XS";
import { Exercise_M } from "../common/contentcard/Exercise_M";
import type { GroupExerciseItem } from "../../pages/home/HomePage";
import { groupExerciseData } from "./mock/homeMock";
import { useNavigate } from "react-router-dom";
export const RecommendedWorkoutSection = () => {
  const navigate = useNavigate();
  const data: GroupExerciseItem[] = groupExerciseData;

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
        {data.map((item, index) => (
          <Exercise_M
            id={index}
            key={item.id}
            title={item.title}
            date={item.date}
            time={item.time}
            location={item.location}
            imageSrc={item.imgSrc}
          />
        ))}
      </div>
    </div>
  );
};
