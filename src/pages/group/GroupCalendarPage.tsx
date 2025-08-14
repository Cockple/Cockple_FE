import { ContentCardL } from "../../components/common/contentcard/ContentCardL";
import MonthlyCalendar from "../../components/common/Date_Time/MonthCalendar";

export const GroupCalendarPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <MonthlyCalendar />

      <div className="flex flex-col">
        <div className="border-b-1 border-gy-200 mb-3">
          <ContentCardL
            id={1}
            isUserJoined
            isGuestAllowedByOwner
            isCompleted={false}
            title="하이콕콕"
            date="2000-05-01"
            location="산성 실내 배드민턴장"
            time="08:00 am ~ 10:00 am"
            femaleLevel="전국 초심 ~ 준자강"
            maleLevel="전국 준자강 이상"
            currentCount={0}
            totalCount={0}
            like={false}
            onToggleFavorite={id => console.log(`즐겨찾기 토글: ${id}`)}
          />
        </div>

        <div className="border-b-1 border-gy-200 mb-3">
          <ContentCardL
            id={2}
            isUserJoined
            isGuestAllowedByOwner
            isCompleted={false}
            title="하이콕콕"
            date="2000-05-01"
            location="산성 실내 배드민턴장"
            time="08:00 am ~ 10:00 am"
            femaleLevel="전국 초심 ~ 준자강"
            maleLevel="전국 준자강 이상"
            currentCount={0}
            totalCount={0}
            like={false}
            onToggleFavorite={id => console.log(`즐겨찾기 토글: ${id}`)}
          />
        </div>
      </div>
    </div>
  );
};
