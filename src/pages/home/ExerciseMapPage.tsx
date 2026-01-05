import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/common/system/header/PageHeader";
import ArrowDown from "@/assets/icons/arrow_down.svg";
import ArrowUp from "@/assets/icons/arrow_up.svg";
import { ExerciseMapCalendar } from "@/components/home/ExerciseMapCalendar";
import { Exercise_M } from "@/components/common/contentcard/Exercise_M";
import myLocationIcon from "@/assets/icons/map_mylocation.svg?url";
import markerIcon from "@/assets/icons/map_marker.svg?url";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  fetchExerciseDetail,
  fetchMonthlyBuildings,
  useMonthlyBuildings,
  type MonthlyBuildingsResponse,
} from "@/api/exercise/getExerciseMapApi";
import { FloatingButton } from "@/components/common/system/FloatingButton";
import MyLocationIcon from "@/assets/icons/mylocation.svg?url";
import DefaultGroupImg from "@/assets/icons/defaultGroupImg.svg?url";
import { useNavigate } from "react-router-dom";
import { loadKakaoMap } from "@/utils/loadKakaoMap";

interface Exercise {
  exerciseId: number;
  partyId: number;
  partyName: string;
  date: string;
  dayOfTheWeek: string;
  startTime: string;
  endTime: string;
  profileImageUrl: string;
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
  const navigate = useNavigate();

  const mapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightcenterFetchRef = useRef(false);

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

  // floating button offset
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

  // 카카오 SDK 로드 + 맵 1회 생성
  useEffect(() => {
    if (!buildingData) return;
    if (!mapRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      try {
        await loadKakaoMap(import.meta.env.VITE_APP_KAKAO_MAP_KEY);
        if (cancelled) return;

        window.kakao.maps.load(() => {
          if (cancelled) return;
          if (mapInstance.current) return; // 이미 생성

          const { centerLatitude, centerLongitude } = buildingData;
          const centerPos = new window.kakao.maps.LatLng(
            centerLatitude,
            centerLongitude,
          );

          const map = new window.kakao.maps.Map(mapRef.current!, {
            center: centerPos,
            level: 3,
            draggable: true,
            scrollwheel: true,
          });
          mapInstance.current = map;

          // 내 위치 마커
          const myLocationMarker = new window.kakao.maps.Marker({
            position: centerPos,
            image: new window.kakao.maps.MarkerImage(
              myLocationIcon,
              new window.kakao.maps.Size(40, 40),
              { offset: new window.kakao.maps.Point(20, 20) },
            ),
          });
          myLocationMarker.setMap(map);
          myMarkerRef.current = myLocationMarker;

          // idle 리스너
          const handleIdle = () => {
            const center = map.getCenter();
            const newCenter = { lat: center.getLat(), lng: center.getLng() };

            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            idleTimeoutRef.current = setTimeout(() => {
              setMapCenter(newCenter);
            }, 800);
          };

          window.kakao.maps.event.addListener(map, "idle", handleIdle);

          // 초기 중심값도 세팅
          setMapCenter({ lat: centerLatitude, lng: centerLongitude });
        });
      } catch (err) {
        console.error("kakao Map init failed: ", err);
      }
    };

    initMap();

    return () => {
      cancelled = true;
    };
  }, [buildingData]);

  // 지도 중심 변경되면 건물 정보 새로 가져오기
  useEffect(() => {
    if (!mapCenter) return;

    const fetchByCenter = async () => {
      if (inFlightcenterFetchRef.current) return;
      inFlightcenterFetchRef.current = true;
      try {
        const newData = await fetchMonthlyBuildings({
          date: currentMonth,
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
          radiusKm: 3,
        });

        setFetchData(newData);
      } catch (e) {
        console.error("지도 중심 기준 건물 정보 가져오기 실패", e);
      } finally {
        inFlightcenterFetchRef.current = false;
      }
    };

    fetchByCenter();
  }, [mapCenter, currentMonth]);

  // 마커 갱신: selectedDate/effectiveData 바뀔 때마다 기존 마커 제거 후 다시 그림
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !window.kakao.maps) return;

    // 기존 마커 제거
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const buildings = effectiveData?.buildings?.[selectedDate] || [];

    buildings.forEach(building => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          building.latitude,
          building.longitude,
        ),
        image: new window.kakao.maps.MarkerImage({
          position: new window.kakao.maps.LatLng(
            building.latitude,
            building.longitude,
          ),
          image: new window.kakao.maps.MarkerImage(
            markerIcon,
            new window.kakao.maps.Size(28.8, 35.2),
            { offset: new window.kakao.maps.Point(20, 20) },
          ),
        }),
      });

      marker.setMap(map);
      markersRef.current.push(marker);

      window.kakao.maps.event.addListener(marker, "click", async () => {
        try {
          const detail = await fetchExerciseDetail({
            date: selectedDate,
            buildingName: building.buildingName,
            streetAddr: building.streetAddr,
          });

          setSelectedLocation(detail);
          setIsExpanded(false);
        } catch (err) {
          console.error("운동 상세 조회 실패:", err);
        }
      });
    });

    return () => {
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
    };
  }, [selectedDate, effectiveData]);

  // 바텀 시트 내부 스크롤 시 드래그 토글
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
    ) {
      setIsExpanded(true);
      return;
    }

    if (info.offset.y > 150 && enableDrag) {
      setIsExpanded(false);
      setSelectedLocation(null);
      return;
    }

    setIsExpanded(false);
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
                  date={selectedDate}
                  time={`${exercise.startTime} ~ ${exercise.endTime}`}
                  location={selectedLocation.buildingName}
                  imageSrc={exercise.profileImageUrl ?? DefaultGroupImg}
                  className="w-full"
                  onClick={() =>
                    navigate(`/group/${exercise.partyId}?date=${selectedDate}`)
                  }
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
