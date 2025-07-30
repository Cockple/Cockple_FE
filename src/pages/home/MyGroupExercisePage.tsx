import { useState } from "react";
import { Exercise_M } from "../../components/common/contentcard/Exercise_M";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { groupExerciseData } from "../../components/home/mock/homeMock";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import Sort from "../../components/common/Sort";
import WeeklyCalendar from "../../components/common/Date_Time/WeeklyCalendar";

export const MyGroupExercisePage = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");
  const data = groupExerciseData;
  return (
    <div className="flex flex-col -mx-4 px-4 bg-white">
      <PageHeader title="내 모임 운동" />
      <div className="flex flex-col gap-3 my-2">
        <div className="h-17">
          <WeeklyCalendar shadow={false} />
        </div>
        <div className="flex justify-end w-full  h-7">
          <Sort
            label={sortOption}
            isOpen={isSortOpen}
            onClick={() => setIsSortOpen(!isSortOpen)}
          />
        </div>

        <div className="flex flex-col gap-3">
          {data.map((item, idx) => (
            <div
              className="flex flex-col pb-3 border-b-[1px] border-gy-200"
              key={item.id}
            >
              <Exercise_M
                id={idx}
                title={item.title}
                date={item.date}
                time={item.time}
                location={item.location}
                imageSrc={item.imgSrc}
              />
            </div>
          ))}
        </div>
      </div>

      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selected={sortOption}
        onSelect={option => setSortOption(option)}
      />
    </div>
  );
};
