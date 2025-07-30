import { useState } from "react";
import { Exercise_M } from "../../components/common/contentcard/Exercise_M";
import CheckBoxBtn from "../../components/common/DynamicBtn/CheckBoxBtn";
import FilterBtn from "../../components/common/DynamicBtn/FilterBtn";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { groupExerciseData } from "../../components/home/mock/homeMock";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import { useNavigate } from "react-router-dom";
import Sort from "../../components/common/Sort";
import {
  isFilterDirty,
  useExerciseFilterStore,
} from "../../store/useExerciseFilterStore";
import WeeklyCalendar from "../../components/common/Date_Time/WeeklyCalendar";

export const RecommendPage = () => {
  const navigate = useNavigate();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");
  const data = groupExerciseData;
  const { region, level, style, time } = useExerciseFilterStore();
  const filterState = { region, level, style, time };
  const filterStatus = isFilterDirty(filterState) ? "clicked" : "default";
  return (
    <div className="flex flex-col gap-2 -mx-4 px-4 bg-white">
      <PageHeader title="운동 추천" onBackClick={() => navigate("/")} />
      <div className="flex flex-col gap-3">
        <div className="w-full h-17">
          <WeeklyCalendar shadow={false} />
        </div>
        <div className="flex justify-between w-full h-7">
          <CheckBoxBtn>
            <span>콕플 추천</span>
          </CheckBoxBtn>

          <div className="flex items-center">
            <FilterBtn
              onClick={() => navigate("/recommend/filter")}
              forceStatus={filterStatus}
            >
              <span>필터</span>
            </FilterBtn>
            <div className="h-4 w-px bg-gray-200 mx-1"></div>

            <Sort
              label={sortOption}
              isOpen={isSortOpen}
              onClick={() => setIsSortOpen(!isSortOpen)}
            />
          </div>
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
