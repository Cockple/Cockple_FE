import { format } from "date-fns";
import { ContentCardL } from "../../components/common/contentcard/ContentCardL";
import MonthlyCalendar from "../../components/common/Date_Time/MonthCalendar";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useMonthlyPartyCalendar } from "../../api/exercise/getPartyCalendar";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";

const getTodayString = () => format(new Date(), "yyyy-MM-dd");

export const GroupCalendarPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [searchParams] = useSearchParams();

  const initialDate = searchParams.get("date") || getTodayString();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);

  const { data: calendarData } = useMonthlyPartyCalendar(
    Number(groupId),
    currentMonth,
  );
  const exerciseDays = useMemo(() => {
    if (!calendarData) return [];
    const dates = new Set<string>();
    calendarData.weeks.forEach(week => {
      week.days.forEach(day => {
        if (day.exercises.length > 0) {
          dates.add(day.date);
        }
      });
    });
    return Array.from(dates);
  }, [calendarData]);

  const selectedDayExercises = useMemo(() => {
    if (!calendarData) return [];
    const foundDay = calendarData.weeks
      .flatMap(week => week.days)
      .find(day => day.date === selectedDate);
    return foundDay?.exercises ?? [];
  }, [calendarData, selectedDate]);

  const onClickShare = async () => {
    if (!groupId || !selectedDate) return;

    const url = `${window.location.origin}/group/${groupId}/calendar?date=${selectedDate}`;

    try {
      await navigator.clipboard.writeText(url);
      alert("링크가 복사되었습니다!");
    } catch (err) {
      console.error("Clipboard error: ", err);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 items-center">
      <MonthlyCalendar
        selectedDate={selectedDate}
        exerciseDays={exerciseDays}
        onClick={date => setSelectedDate(date as string)}
        onMonthChange={newMonth => setCurrentMonth(newMonth)}
      />

      <div className="flex flex-col pb-15">
        {selectedDayExercises.length > 0 ? (
          selectedDayExercises.map(exercise => (
            <div
              className="border-b-1 border-gy-200 mb-3"
              key={exercise.exerciseId}
            >
              <ContentCardL
                id={exercise.exerciseId}
                isUserJoined={calendarData?.isMember ?? false}
                isGuestAllowedByOwner
                isCompleted={false}
                title={calendarData?.partyName ?? "Exercise"}
                date={selectedDate}
                location={exercise.buildingName}
                time={`${exercise.startTime} ~ ${exercise.endTime}`}
                femaleLevel={exercise.femaleLevel}
                maleLevel={exercise.maleLevel}
                currentCount={exercise.currentParticipants}
                totalCount={exercise.maxCapacity}
                like={exercise.isBookmarked}
                onToggleFavorite={id => console.log(`Toggled favorite: ${id}`)}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            해당 날짜에 운동이 없습니다.
          </div>
        )}
      </div>

      <div className="fixed bottom-0">
        <Grad_GR400_L label="이 날 운동 공유하기" onClick={onClickShare} />
      </div>
    </div>
  );
};
