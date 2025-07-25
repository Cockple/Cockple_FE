import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useMemo, useRef, useState } from "react";
import DayNum from "./DayNum";
import { generateInfiniteDates } from "./utils/generateMonthDates";

import type { Swiper as SwiperClass } from "swiper";
import type { SwiperRef } from "swiper/react";

interface WeeklyCalendarProps {
  selectedDate?: string | number;
  onClick?: (date: number | string) => void;
  exerciseDays?: string[]; //날짜 문자열 기반
  shadow?: boolean;
}
export default function WeeklyCalendar({
  // selectedDate,
  onClick,
  exerciseDays = [],
  shadow = false,
}: WeeklyCalendarProps) {
  const today = new Date();
  const range = 90;

  const weeklyChunks = useMemo(() => generateInfiniteDates(today, range), []);
  //오늘 날짜 찾기
  const todayIndex = useMemo(() => {
    return weeklyChunks.findIndex(week => week.some(d => d.isToday));
  }, [weeklyChunks]);
  const swiperRef = useRef<SwiperRef>(null);
  const [selected, setSelected] = useState<string | null>(null);

  //슬라이스 이동
  useEffect(() => {
    if (swiperRef.current && todayIndex >= 0) {
      swiperRef.current.swiper.slideTo(todayIndex, 0);
    }
  }, [todayIndex, swiperRef.current?.swiper]);

  return (
    <Swiper
      ref={swiperRef}
      spaceBetween={4}
      slidesPerView={1}
      centeredSlides={false}
      className="w-full max-w-[444px]"
      onSwiper={(swiperInstance: SwiperClass) => {
        swiperRef.current = { swiper: swiperInstance };
      }}
    >
      {/* 7일 배치 */}
      {weeklyChunks.map((week, weekIdx) => (
        <SwiperSlide key={weekIdx}>
          <div className="flex gap-1 justify-between">
            {week.map((d, idx) => (
              <DayNum
                key={idx}
                day={d.day}
                date={d.date}
                hasDot={exerciseDays.includes(d.full)}
                color={
                  d.dayNumber === 0
                    ? shadow
                      ? "Nred"
                      : "red"
                    : shadow
                      ? "Nblack"
                      : "black"
                } // 일요일
                status={selected === d.full ? "clicked" : "default"}
                onClick={() => {
                  setSelected(d.full);
                  onClick?.(d.full);
                }}
                className="w-[calc((100%-24px)/7)]"
              />
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
