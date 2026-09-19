import { useState, useEffect, useRef, useMemo } from "react";
import type { Swiper as SwiperClass } from "swiper";
import {
  fetchPartyCalendar,
  type CalExercise,
  type CalWeek,
  addDays as addDaysStr,
} from "../api/exercise/getPartyCalendar";
import type { PartyDetailResponse } from "../api/exercise/getpartyDetail";
import { generateWeeksFromRange } from "../utils/dateUtils";
import type { Week } from "../types/calendar";

const todayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function uiWeeksToCalWeeks(ui: Week[]): CalWeek[] {
  return ui.map(w => ({
    weekStartDate: w.weekStartDate,
    weekEndDate: w.weekEndDate,
    days: w.days.map(d => ({
      date: d.date,
      dayOfWeek: d.dayOfWeek,
      exercises: [] as CalExercise[],
    })),
  }));
}

function calWeeksToUiWeeks(
  cal: CalWeek[],
  partyDetail: PartyDetailResponse,
): Week[] {
  return cal.map(w => ({
    weekStartDate: w.weekStartDate,
    weekEndDate: w.weekEndDate,
    days: w.days.map(d => ({
      date: d.date,
      dayOfWeek: d.dayOfWeek,
      exercises: d.exercises.map(ex => ({
        ...ex,
        partyId: partyDetail.partyId,
        partyName: partyDetail.partyName,
        profileImageUrl: partyDetail.partyImgUrl || "",
      })),
    })),
  }));
}

function ensureCalWeeks(startDate: string, endDate: string, weeks: CalWeek[]) {
  if (weeks && weeks.length > 0) return weeks;
  const ui = generateWeeksFromRange(startDate, endDate);
  return uiWeeksToCalWeeks(ui);
}

function mergeWeeks(base: CalWeek[], incoming: CalWeek[]) {
  const seen = new Set(base.map(w => w.weekStartDate));
  const uniq = incoming.filter(w => !seen.has(w.weekStartDate));
  return [...base, ...uniq];
}

export function useGroupCalendar(
  groupId: string | undefined,
  partyDetail: PartyDetailResponse | undefined,
  initialDate?: string,
) {
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate ?? todayStr(),
  );
  const [cal, setCal] = useState<{
    startDate: string;
    endDate: string;
    weeks: CalWeek[];
  } | null>(null);
  const [loadingCal, setLoadingCal] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    if (!groupId) return;
    (async () => {
      setLoadingCal(true);
      try {
        const res = await fetchPartyCalendar({
          partyId: Number(groupId),
          startDate: null,
          endDate: null,
        });
        const filledWeeks = ensureCalWeeks(
          res.startDate,
          res.endDate,
          res.weeks,
        );
        setCal({
          startDate: res.startDate,
          endDate: res.endDate,
          weeks: filledWeeks,
        });
        setSelectedDate(prev =>
          prev
            ? prev
            : todayStr() >= res.startDate && todayStr() <= res.endDate
              ? todayStr()
              : res.startDate,
        );
      } finally {
        setLoadingCal(false);
      }
    })();
  }, [groupId]);

  const exerciseDays = useMemo(() => {
    if (!cal) return [];
    const set = new Set<string>();
    cal.weeks.forEach(w =>
      w.days.forEach(d => d.exercises.length && set.add(d.date)),
    );
    return Array.from(set);
  }, [cal]);

  const selectedDayExercises: CalExercise[] = useMemo(() => {
    if (!cal) return [];
    const found = cal.weeks
      .flatMap(w => w.days)
      .find(d => d.date === selectedDate);
    return found?.exercises ?? [];
  }, [cal, selectedDate]);

  const onSlideChange = async (swiper: SwiperClass) => {
    if (!cal || fetchingMore) return;
    const buffer = 1;
    const atEnd = swiper.activeIndex >= cal.weeks.length - 1 - buffer;
    const atStart = swiper.activeIndex <= buffer;

    if (atEnd) {
      setFetchingMore(true);
      try {
        const nextStart = addDaysStr(cal.endDate, 1);
        const nextEnd = addDaysStr(nextStart, 13);
        const res = await fetchPartyCalendar({
          partyId: Number(groupId),
          startDate: nextStart,
          endDate: nextEnd,
        });
        const filled = ensureCalWeeks(res.startDate, res.endDate, res.weeks);
        setCal(prev =>
          !prev
            ? { startDate: res.startDate, endDate: res.endDate, weeks: filled }
            : {
                startDate: prev.startDate,
                endDate: res.endDate,
                weeks: mergeWeeks(prev.weeks, filled),
              },
        );
      } finally {
        setFetchingMore(false);
      }
    }

    if (atStart) {
      setFetchingMore(true);
      try {
        const prevEnd = addDaysStr(cal.startDate, -1);
        const prevStart = addDaysStr(prevEnd, -13);
        const res = await fetchPartyCalendar({
          partyId: Number(groupId),
          startDate: prevStart,
          endDate: prevEnd,
        });
        const filled = ensureCalWeeks(res.startDate, res.endDate, res.weeks);

        const current = swiper.activeIndex;
        const added = filled.filter(
          w => !cal.weeks.some(x => x.weekStartDate === w.weekStartDate),
        ).length;

        setCal(prev =>
          !prev
            ? { startDate: res.startDate, endDate: res.endDate, weeks: filled }
            : {
                startDate: res.startDate,
                endDate: prev.endDate,
                weeks: mergeWeeks(filled, prev.weeks),
              },
        );

        if (added > 0) {
          setTimeout(() => swiper.slideTo(current + added, 0), 0);
        }
      } finally {
        setFetchingMore(false);
      }
    }
  };

  const processedWeeks: Week[] | null = useMemo(() => {
    if (!cal || !cal.weeks || !partyDetail) return null;
    return calWeeksToUiWeeks(cal.weeks, partyDetail);
  }, [cal, partyDetail]);

  return {
    selectedDate,
    setSelectedDate,
    loadingCal,
    exerciseDays,
    selectedDayExercises,
    onSlideChange,
    swiperRef,
    processedWeeks,
  };
}
