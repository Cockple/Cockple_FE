import { format } from "date-fns";
import { ContentCardL } from "../../components/common/contentcard/ContentCardL";
import MonthlyCalendar from "../../components/common/Date_Time/MonthCalendar";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMonthlyPartyCalendar } from "../../api/exercise/getPartyCalendar";

const getTodayString = () => format(new Date(), "yyyy-MM-dd");

export const GroupCalendarPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

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

  return (
    <div className="flex flex-col gap-8">
      <MonthlyCalendar
        selectedDate={selectedDate}
        exerciseDays={exerciseDays}
        onClick={date => setSelectedDate(date as string)}
        onMonthChange={newMonth => setCurrentMonth(newMonth)}
      />

      <div className="flex flex-col">
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
    </div>
  );
};
