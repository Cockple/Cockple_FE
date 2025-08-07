import { useEffect, useRef, useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import ArrowDown from "@/assets/icons/arrow_down.svg";
import ArrowUp from "@/assets/icons/arrow_up.svg";
import { ExerciseMapCalendar } from "../../components/home/ExerciseMapCalendar";
import { Exercise_M } from "../../components/common/contentcard/Exercise_M";
import myLocationIcon from "@/assets/icons/map_mylocation.svg?url";
import markerIcon from "@/assets/icons/map_marker.svg?url";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useMonthlyBuildings } from "../../api/exercise/getExerciseMapApi";

interface Exercise {
  exerciseId: number;
  partyId: number;
  partyName: string;
  date: string;
  dayOfTheWeek: string;
  startTime: string;
  endTime: string;
  imageUrl: string;
  isBookmarked: boolean;
}

interface SelectedLocation {
  buildingName: string;
  totalExercises: number;
  exercises: Exercise[];
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export const ExerciseMapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [calendar, setCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-08-15");
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [enableDrag, setEnableDrag] = useState(true);

  const ArrowIcon = calendar ? ArrowUp : ArrowDown;

  const { data: buildingData } = useMonthlyBuildings({
    date: selectedDate,
    latitude: 37.4981,
    longitude: 127.028,
    radiusKm: 3,
  });

  useEffect(() => {
    if (!window.kakao?.maps?.load || !buildingData) return;

    window.kakao.maps.load(() => {
      const kakao = window.kakao;
      const container = mapRef.current;
      if (!container) return;

      const { centerLatitude, centerLongitude } = buildingData;
      const centerPos = new kakao.maps.LatLng(centerLatitude, centerLongitude);

      const map = new kakao.maps.Map(container, {
        center: centerPos,
        level: 3,
        draggable: true,
        scrollwheel: true,
      });

      const myLocationMarker = new kakao.maps.Marker({
        position: centerPos,
        image: new kakao.maps.MarkerImage(
          myLocationIcon,
          new kakao.maps.Size(40, 40),
          { offset: new kakao.maps.Point(20, 20) },
        ),
      });
      myLocationMarker.setMap(map);

      const buildings = buildingData.buildings[selectedDate] || [];

      buildings.forEach(building => {
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(
            building.latitude,
            building.longitude,
          ),
          image: new kakao.maps.MarkerImage(
            markerIcon,
            new kakao.maps.Size(28.8, 35.2),
            { offset: new kakao.maps.Point(20, 20) },
          ),
          map,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          setSelectedLocation({
            buildingName: building.buildingName,
            totalExercises: 0,
            exercises: [], // 실제로는 상세 API 호출 결과로 대체
          });
        });
      });
    });
  }, [buildingData, selectedDate]);

  useEffect(() => {
    if (!isExpanded || !scrollRef.current) return;
    const el = scrollRef.current;
    const onScroll = () => {
      setEnableDrag(el.scrollTop === 0);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [isExpanded]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (_: any, info: { offset: { y: number } }) => {
    if (info.offset.y < -10) setIsExpanded(true);
    else if (info.offset.y > 200 && enableDrag) {
      setIsExpanded(false);
      setSelectedLocation(null);
    } else setIsExpanded(false);
  };

  return (
    <div className="flex flex-col items-center h-screen -mx-4 -mb-8">
      <PageHeader title="지도로 운동 찾기" />

      <div className="relative w-full flex-1 bg-gy-400" ref={mapRef}>
        <div className="absolute flex items-center gap-2 top-3 left-1/2 -translate-x-1/2 w-25 h-7 py-1 pl-2 pr-1.5 border-hard bg-white z-10">
          <span className="body-rg-500">{selectedDate}</span>
          <img
            src={ArrowIcon}
            alt="arrow"
            className="size-4"
            onClick={() => setCalendar(true)}
          />
        </div>
      </div>

      {calendar && (
        <div className="z-50">
          <ExerciseMapCalendar onClose={() => setCalendar(false)} />
        </div>
      )}

      {selectedLocation && (
        <motion.div
          drag={enableDrag ? "y" : false}
          dragElastic={0.2}
          initial={false}
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          className="flex flex-col fixed bottom-0 max-w-[444px] rounded-t-3xl z-10 w-full bg-white px-4"
          animate={{ height: isExpanded ? "70%" : "16.25rem", opacity: 1 }}
          transition={{ type: "spring", bounce: 0.2 }}
        >
          <div className="w-full flex justify-center pt-2 pb-3">
            <div className="w-20 h-1 rounded-lg bg-gy-400"></div>
          </div>
          <div
            ref={scrollRef}
            className={clsx(
              "flex flex-col ",
              isExpanded ? "overflow-y-scroll scrollbar-hide" : "",
            )}
          >
            {selectedLocation.exercises.map(exercise => (
              <div
                key={exercise.exerciseId}
                className="pb-3 border-b-1 border-gy-200 mb-3"
              >
                <Exercise_M
                  id={exercise.exerciseId}
                  title={exercise.partyName}
                  date={exercise.date}
                  time={`${exercise.startTime} ~ ${exercise.endTime}`}
                  location={selectedLocation.buildingName}
                  imageSrc={exercise.imageUrl}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
