import { Swiper, SwiperSlide } from "swiper/react";
import { useRef, useState, useEffect } from "react";
import type { Swiper as SwiperClass } from "swiper";
import type { Week, DayOfWeek } from "../../types/calendar";
import DayNum from "../common/Date_Time/DayNum";

interface CustomhomeWeeklyProps {
  weeks: Week[];
  selectedDate: string;
  exerciseDays?: string[];
  onClick?: (date: string) => void;
  onSlideChange?: (swiper: SwiperClass) => void;
  initialSlide?: number;
  onSwiper?: (swiper: SwiperClass) => void;
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

export default function CustomhomeWeekly({
  weeks,
  selectedDate,
  onClick,
  exerciseDays = [],
  onSlideChange,
  initialSlide,
  onSwiper,
}: CustomhomeWeeklyProps) {
  const swiperRef = useRef<{ swiper: SwiperClass } | null>(null);
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
      initialSlide={initialSlide} // ✨ 초기 슬라이드 위치 설정
      ref={swiperRef}
      onSlideChange={onSlideChange}
      onSwiper={swiper => {
        swiperRef.current = { swiper };
        if (onSwiper) onSwiper(swiper);
      }}
      spaceBetween={4}
      slidesPerView={1}
      className="w-full max-w-[444px]"
    >
      {weeks.map(week => (
        <SwiperSlide key={week.weekStartDate}>
          <div className="flex gap-1 justify-between">
            {week.days.map(d => (
              <DayNum
                key={d.date}
                day={getKoreanDay(d.dayOfWeek)}
                date={new Date(d.date).getDate()}
                hasDot={exerciseDays.includes(d.date)}
                color={new Date(d.date).getDay() === 0 ? "red" : "black"}
                status={internalSelected === d.date ? "clicked" : "default"}
                onClick={() => handleDayClick(d.date)}
                className="w-[calc((100%-24px)/7)]"
              />
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
