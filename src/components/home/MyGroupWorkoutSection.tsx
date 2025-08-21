import Clear_XS from "../common/Btn_Static/Icon_Btn/Clear_XS";
import { Exercise_S } from "../common/contentcard/Exercise_S";
import ArrowRight from "@/assets/icons/arrow_right.svg";
import AddIcon from "@/assets/icons/add.svg";
import Btn_Static from "../common/Btn_Static/Btn_Static";
import { useNavigate } from "react-router-dom";
import { useMyExerciseApi } from "../../api/exercise/getMyExerciseApi";
import DefaultGroupImg from "@/assets/icons/defaultGroupImg.svg?url";
import dayjs from "dayjs";

const dayOfWeekMap: Record<string, string> = {
  SUNDAY: "일",
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
};

function getFormattedDate(dateString: string, dayOfWeek: string) {
  const date = dayjs(dateString);
  const day = dayOfWeekMap[dayOfWeek.toUpperCase()] || "";
  return `${date.format("MM.DD")} (${day})`;
}

function getFormattedTime(timeString: string) {
  const fakeDate = "2000-01-01";
  const fullDateTime = `${fakeDate}T${timeString}`;
  return dayjs(fullDateTime).format("hh:mm a").toLowerCase();
}

export const MyGroupWorkoutSection = () => {
  const navigate = useNavigate();

  const { data } = useMyExerciseApi();

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between header-h4">
        내 모임 운동{" "}
        {data && data.exercises.length > 0 && (
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
      {data && data.exercises.length > 0 ? (
        <div className="flex overflow-x-scroll gap-1 scrollbar-hide">
          {data.exercises.map(item => {
            return (
              <Exercise_S
                key={item.exerciseId}
                title={item.partyName}
                date={getFormattedDate(item.date, item.dayOfWeek ?? "")}
                time={getFormattedTime(item.startTime)}
                location={item.buildingName}
                imageSrc={item.profileImageUrl ?? DefaultGroupImg}
                onClick={() => navigate(`/group/${item.partyId}`)}
              />
            );
          })}
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
