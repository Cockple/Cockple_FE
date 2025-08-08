import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import type { Swiper as SwiperClass } from "swiper";
import type { Week, DayOfWeek } from "../../types/calendar";
import DayNum from "../common/Date_Time/DayNum";

interface CustomWeeklyProps {
  weeks: Week[];
  selectedDate: string;
  exerciseDays?: string[];
  onClick?: (date: string) => void;
  onSlideChange?: (swiper: SwiperClass) => void;
  initialSlide?: number;
  shadow?: boolean;
  setSwiperRef?: (swiper: SwiperClass) => void; // 부모가 Swiper 인스턴스를 제어하기 위함
}

const getKoreanDay = (day: DayOfWeek): string => {
  const dayMap: Record<DayOfWeek, string> = {
    MONDAY: "월",
    TUESDAY: "화",
    WEDNESDAY: "수",
    THURSDAY: "목",
    FRIDAY: "금",
    SATURDAY: "토",
    SUNDAY: "일",
  };
  return dayMap[day] || "";
};

export default function CustomWeekly({
  weeks,
  selectedDate,
  onClick,
  exerciseDays = [],
  onSlideChange,
  initialSlide,
  shadow = true,
  setSwiperRef,
}: CustomWeeklyProps) {
  const [internalSelected, setInternalSelected] = useState(selectedDate);

  useEffect(() => {
    setInternalSelected(selectedDate);
  }, [selectedDate]);

  const handleDayClick = (date: string) => {
    setInternalSelected(date);
    onClick?.(date);
  };

  return (
    <Swiper
      key={initialSlide}
      initialSlide={initialSlide}
      onSlideChange={onSlideChange}
      onSwiper={swiper => {
        if (setSwiperRef) {
          setSwiperRef(swiper);
        }
      }}
      spaceBetween={4}
      slidesPerView={1}
      className="w-full max-w-[444px]"
    >
      {weeks.map(week => (
        <SwiperSlide key={week.weekStartDate}>
          <div className="flex gap-1 justify-between">
            {week.days.map(d => {
              const dayOfWeekNumber = new Date(d.date).getDay();
              return (
                <DayNum
                  key={d.date}
                  day={getKoreanDay(d.dayOfWeek)}
                  date={new Date(d.date).getDate()}
                  hasDot={exerciseDays.includes(d.date)}
                  color={
                    dayOfWeekNumber === 0
                      ? !shadow
                        ? "Nred"
                        : "red"
                      : !shadow
                        ? "Nblack"
                        : "black"
                  }
                  status={internalSelected === d.date ? "clicked" : "default"}
                  onClick={() => handleDayClick(d.date)}
                  className="w-[calc((100%-24px)/7)]"
                />
              );
            })}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
