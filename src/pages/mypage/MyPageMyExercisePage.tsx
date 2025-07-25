import { useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { SortBottomSheet } from "../../components/common/SortBottomSheet";
import Sort from "../../components/common/Sort";
import { ContentCardL } from "../../components/common/contentcard/ContentCardL";
import { MyExercise_None } from "../../components/MyPage/MyExercise_None";
import { useLocation } from "react-router-dom";
import type { ContentCardLProps } from "../../components/common/contentcard/ContentCardL";

// interface MyPageMyExercisePageProps {
//   myActivityCount: ContentCardLProps[];
// }

// export const MyPageMyExercisePage = ({ myActivityCount }: MyPageMyExercisePageProps) => {
export const MyPageMyExercisePage = () => {
  const location = useLocation();
  const myActivityCount = location.state?.myActivityCount ?? [];

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");
  const [selectedTab, setSelectedTab] = useState<
    "전체" | "참여 예정" | "참여 완료"
  >("전체");

  const sortActivities = (list: ContentCardLProps[], option: string) => {
    return [...list].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return option === "최신순" ? dateB - dateA : dateA - dateB;
    });
  };

  const filteredList = sortActivities(
    (myActivityCount ?? []).filter((item: ContentCardLProps) => {
      if (selectedTab === "전체") return true;
      if (selectedTab === "참여 예정") return !item.isCompleted;
      if (selectedTab === "참여 완료") return item.isCompleted;
      return true;
    }),
    sortOption,
  );

  return (
    <div className="flex flex-col h-screen w-full max-w-[23.4375rem] bg-white mx-auto">
      <div className={`sticky top-0 ${isSortOpen ? "z-0" : "z-20"}`}>
        <PageHeader title="내 운동" />

        <div className="mb-5 px-4">
          <div className="flex gap-4 relative h-10">
            <div className="absolute bottom-0 left-0 right-0 h-[0.125rem] bg-[#F4F5F6]" />
            {["전체", "참여 예정", "참여 완료"].map(tab => (
              <button
                key={tab}
                onClick={() =>
                  setSelectedTab(tab as "전체" | "참여 예정" | "참여 완료")
                }
                className="flex flex-col items-center w-max relative"
              >
                <span className="header-h5 inline-block">{tab}</span>
                {selectedTab === tab && (
                  <span
                    className="absolute bottom-0 h-[0.125rem] bg-[#1ABB65] rounded-full transition-all duration-150"
                    style={{ width: `${tab.length + 2}ch` }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {filteredList.length > 0 ? (
          <>
            <div className="flex justify-end mb-3">
              <Sort
                label={sortOption}
                isOpen={isSortOpen}
                onClick={() => setIsSortOpen(!isSortOpen)}
              />
            </div>
            {filteredList.map((group, idx) => (
              <ContentCardL key={idx} {...group} />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <MyExercise_None />
          </div>
        )}
      </div>
      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selected={sortOption}
        onSelect={option => setSortOption(option)}
        options={["최신순", "오래된 순"]}
      />
    </div>
  );
};
