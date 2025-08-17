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
import {
  fetchExerciseDetail,
  fetchMonthlyBuildings,
  MonthlyBuildingsResponse,
  useMonthlyBuildings,
} from "../../api/exercise/getExerciseMapApi";
import { FloatingButton } from "../../components/common/system/FloatingButton";
import MyLocationIcon from "@/assets/icons/mylocation.svg?url";

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

// 오늘 날짜 반환
const getToday = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const date = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${date}`;
};

export const ExerciseMapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [calendar, setCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [currentMonth, setCurrentMonth] = useState(() => new Date(getToday()));
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [enableDrag, setEnableDrag] = useState(true);
  const [rightOffset, setRightOffset] = useState(0);
  const [fetchData, setFetchData] = useState<MonthlyBuildingsResponse | null>(
    null,
  );

  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);

  const ArrowIcon = calendar ? ArrowUp : ArrowDown;

  const formatDateToKorean = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${month}.${day} (${dayOfWeek})`;
  };

  const { data: buildingData } = useMonthlyBuildings({
    date: currentMonth,
    radiusKm: 3,
  });

  const effectiveData = fetchData ?? buildingData;

  console.log(buildingData);

  useEffect(() => {
    if (!mapInstance.current || !window.kakao?.maps) return;

    const map = mapInstance.current;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleIdle = () => {
      const center = map.getCenter();
      const newCenter = {
        lat: center.getLat(),
        lng: center.getLng(),
      };

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMapCenter(newCenter); // ✅ 2초 후 중심 좌표 갱신
      }, 2000);
    };

    window.kakao.maps.event.addListener(map, "idle", handleIdle);

    return () => {
      window.kakao.maps.event.removeListener(map, "idle", handleIdle);
      clearTimeout(timeoutId);
    };
  }, [mapInstance.current]);

  useEffect(() => {
    if (!mapCenter) return;

    const fetch = async () => {
      try {
        const newData = await fetchMonthlyBuildings({
          date: currentMonth,
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
          radiusKm: 3,
        });

        console.log("맵 이동 후 새로 받아온 빌딩 데이터", newData);
      } catch (e) {
        console.error("지도 중심 기준 건물 정보 가져오기 실패", e);
      }
    };

    fetch();
  }, [mapCenter, currentMonth]);

  useEffect(() => {
    const updateOffset = () => {
      const screenWidth = window.innerWidth;
      const contentWidth = Math.min(screenWidth, 444);
      const offset = (screenWidth - contentWidth) / 2 + 16;
      setRightOffset(offset);
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

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
      mapInstance.current = map;

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

        kakao.maps.event.addListener(marker, "click", async () => {
          try {
            const detail = await fetchExerciseDetail({
              date: selectedDate,
              buildingName: building.buildingName,
              streetAddr: building.streetAddr,
            });

            setSelectedLocation(detail);
            setIsExpanded(false); // 바텀시트 초기 높이로
          } catch (e) {
            console.error("운동 상세 조회 실패:", e);
          }
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
    if (
      info.offset.y < -10 &&
      selectedLocation &&
      selectedLocation.exercises.length > 2
    )
      setIsExpanded(true);
    else if (info.offset.y > 150 && enableDrag) {
      setIsExpanded(false);
      setSelectedLocation(null);
    } else setIsExpanded(false);
  };

  // 운동 있는 날짜 리스트 추출
  const exerciseDays = buildingData?.buildings
    ? Object.keys(buildingData.buildings)
    : [];

  // floating button으로 위치 조정
  const handleMoveToCurrentLocation = () => {
    const { centerLatitude, centerLongitude } = buildingData ?? {};
    if (mapInstance.current && centerLatitude && centerLongitude) {
      const centerPos = new window.kakao.maps.LatLng(
        centerLatitude,
        centerLongitude,
      );
      mapInstance.current.panTo(centerPos);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen -mx-4 -mb-8">
      <PageHeader title="지도로 운동 찾기" />

      <div className="relative w-full flex-1 bg-gy-400" ref={mapRef}>
        <div className="absolute flex items-center gap-2 top-3 left-1/2 -translate-x-1/2 w-25 h-7 py-1 pl-2 pr-1.5 border-hard bg-white z-10">
          <span className="body-rg-500">
            {formatDateToKorean(selectedDate)}
          </span>
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
          <ExerciseMapCalendar
            onClose={() => setCalendar(false)}
            selectedDate={selectedDate}
            onSelectDate={date => {
              setSelectedDate(date.toString());
              setCalendar(false);
            }}
            onMonthChange={(monthDate: Date) => {
              setCurrentMonth(monthDate);
            }}
            exerciseDays={exerciseDays}
          />
        </div>
      )}

      {selectedLocation && (
        <motion.div
          drag={enableDrag ? "y" : false}
          dragElastic={{
            top: selectedLocation.exercises.length > 2 ? 0.2 : 0,
            bottom: 0.5,
          }}
          initial={false}
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          className="flex flex-col fixed bottom-0 max-w-[444px] rounded-t-3xl z-10 w-full bg-white px-4"
          animate={
            selectedLocation.exercises.length <= 2
              ? { height: "auto", opacity: 1 }
              : { height: isExpanded ? "70%" : "16.25rem", opacity: 1 }
          }
          transition={{ type: "spring", bounce: 0.2 }}
        >
          <div className="w-full flex justify-center pt-2 pb-3">
            <div className="w-20 h-1 rounded-lg bg-gy-400"></div>
          </div>
          <div
            ref={scrollRef}
            className={clsx(
              "flex flex-col",
              selectedLocation.exercises.length > 2 && isExpanded
                ? "overflow-y-scroll scrollbar-hide"
                : "overflow-hidden",
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
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <FloatingButton
        size="L"
        color="white"
        icon={MyLocationIcon}
        className="fixed z-50 bottom-10"
        style={{ right: rightOffset }}
        onClick={handleMoveToCurrentLocation}
      />
    </div>
  );
};
