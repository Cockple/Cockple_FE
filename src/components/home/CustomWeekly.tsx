import { Swiper, SwiperSlide } from "swiper/react";
import { useRef, useState, useEffect } from "react";
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
  shadow?: boolean; // shadow prop
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
  shadow = true, // shadow prop 받기 (기본값 true)
}: CustomWeeklyProps) {
  const swiperRef = useRef<{ swiper: SwiperClass } | null>(null);
  const [internalSelected, setInternalSelected] = useState(selectedDate);
  const initialSlideApplied = useRef(false);

  useEffect(() => {
    setInternalSelected(selectedDate);
  }, [selectedDate]);

  const handleDayClick = (date: string) => {
    setInternalSelected(date);
    onClick?.(date);
  };

  useEffect(() => {
    if (
      initialSlide !== undefined &&
      swiperRef.current?.swiper &&
      !initialSlideApplied.current
    ) {
      swiperRef.current.swiper.slideTo(initialSlide, 0, false);
      initialSlideApplied.current = true;
    }
  }, [initialSlide, swiperRef.current?.swiper]);

  return (
    <Swiper
      ref={swiperRef}
      onSlideChange={onSlideChange}
      onSwiper={swiper => {
        swiperRef.current = { swiper };
      }}
      spaceBetween={4}
      slidesPerView={1}
      className="w-full max-w-[444px]"
    >
      {weeks.map(week => (
        <SwiperSlide key={week.weekStartDate}>
          <div className="flex gap-1 justify-between">
            {week.days.map(d => {
              const dayOfWeekNumber = new Date(d.date).getDay(); // 0: 일요일
              return (
                <DayNum
                  key={d.date}
                  day={getKoreanDay(d.dayOfWeek)}
                  date={new Date(d.date).getDate()}
                  hasDot={exerciseDays.includes(d.date)}
                  // ✨ 요청하신 color 로직으로 수정
                  color={
                    dayOfWeekNumber === 0 // 일요일인 경우
                      ? !shadow
                        ? "Nred"
                        : "red"
                      : !shadow // 그 외 요일
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
