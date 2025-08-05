import Clear_XS from "../common/Btn_Static/Icon_Btn/Clear_XS";
import { Exercise_S } from "../common/contentcard/Exercise_S";
import ArrowRight from "@/assets/icons/arrow_right.svg";
import AddIcon from "@/assets/icons/add.svg";
import { groupExerciseData } from "./mock/homeMock";
import Btn_Static from "../common/Btn_Static/Btn_Static";
import type { GroupExerciseItem } from "../../pages/home/HomePage";
import { useNavigate } from "react-router-dom";

export const MyGroupWorkoutSection = () => {
  const navigate = useNavigate();
  const data: GroupExerciseItem[] = groupExerciseData;
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between header-h4">
        내 모임 운동{" "}
        {data && data.length > 0 && (
          <Clear_XS
            iconMap={{
              disabled: ArrowRight,
              default: ArrowRight,
              pressing: ArrowRight,
              clicked: ArrowRight,
            }}
            onClick={() => navigate("/mygroup-exercise")}
          />
        )}
      </div>
      {data.length > 0 ? (
        <div className="flex overflow-x-scroll gap-1 scrollbar-hide">
          {data.map(item => (
            <Exercise_S
              key={item.id}
              title={item.title}
              date={item.date}
              time={item.time}
              location={item.location}
              imageSrc={item.imgSrc}
              onClick={() => navigate(`/group/${item.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center py-4 gap-5">
          <div className="flex flex-col body-rg-500">
            <span>아직 내 모임 운동이 없어요!</span>
            <span>모임을 만들고 운동을 즐겨볼까요?</span>
          </div>

          <Btn_Static
            kind="GY100"
            size="S"
            label="모임 만들기"
            iconMap={{
              default: AddIcon,
              pressing: AddIcon,
              clicked: AddIcon,
              disabled: AddIcon,
            }}
            onClick={() => navigate("/group/making/basic")}
          />
        </div>
      )}
    </div>
  );
};
