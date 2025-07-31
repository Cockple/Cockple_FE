import { useEffect, useRef, useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import ArrowDown from "@/assets/icons/arrow_down.svg";
import ArrowUp from "@/assets/icons/arrow_up.svg";
import { ExerciseMapCalendar } from "../../components/home/ExerciseMapCalendar";
import { Exercise_M } from "../../components/common/contentcard/Exercise_M";
import { motion } from "framer-motion";
import clsx from "clsx";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export {};

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

const dummyResponse = {
  currentLocation: {
    latitude: 37.5665,
    longitude: 126.978,
  },
  searchRadius: 5000,
  exerciseLocations: [
    {
      locationId: 1,
      latitude: 37.5663,
      longitude: 126.9779,
    },
    {
      locationId: 2,
      latitude: 37.5511,
      longitude: 126.9882,
    },
    {
      locationId: 3,
      latitude: 37.5591,
      longitude: 126.9889,
    },
  ],
};

const dummyExerciseDetail = {
  buildingName: "산성 실내 배드민턴장",
  totalExercises: 5,
  exercises: [
    {
      exerciseId: 15,
      partyId: 1,
      partyName: "하이콕콕",
      date: "2000-05-01",
      dayOfTheWeek: "월",
      startTime: "08:00:00",
      endTime: "10:00:00",
      imageUrl:
        "https://media.istockphoto.com/id/1154370446/ko/%EC%82%AC%EC%A7%84/%ED%9D%B0%EC%83%89-%EB%B0%B0%EA%B2%BD%EC%97%90-%EA%B3%A0%EB%A6%BD-%EB%90%9C-%EB%B0%94%EC%9C%84-%EC%A0%9C%EC%8A%A4%EC%B2%98%EB%A5%BC-%EB%B3%B4%EC%97%AC%EC%A3%BC%EB%8A%94-%EB%85%B9%EC%83%89-%EC%84%A0%EA%B8%80%EB%9D%BC%EC%8A%A4%EC%97%90-%EC%9E%AC%EB%AF%B8-%EB%84%88%EA%B5%AC%EB%A6%AC.jpg?s=612x612&w=0&k=20&c=atEjJlw_9g7W6SBgISn3sebRa94-zw5GGgyeddCf-AU=",
      isBookmarked: false,
    },
    {
      exerciseId: 16,
      partyId: 1,
      partyName: "하이콕콕",
      date: "2000-05-01",
      dayOfTheWeek: "월",
      startTime: "08:00:00",
      endTime: "10:00:00",
      imageUrl:
        "https://media.istockphoto.com/id/1154370446/ko/%EC%82%AC%EC%A7%84/%ED%9D%B0%EC%83%89-%EB%B0%B0%EA%B2%BD%EC%97%90-%EA%B3%A0%EB%A6%BD-%EB%90%9C-%EB%B0%94%EC%9C%84-%EC%A0%9C%EC%8A%A4%EC%B2%98%EB%A5%BC-%EB%B3%B4%EC%97%AC%EC%A3%BC%EB%8A%94-%EB%85%B9%EC%83%89-%EC%84%A0%EA%B8%80%EB%9D%BC%EC%8A%A4%EC%97%90-%EC%9E%AC%EB%AF%B8-%EB%84%88%EA%B5%AC%EB%A6%AC.jpg?s=612x612&w=0&k=20&c=atEjJlw_9g7W6SBgISn3sebRa94-zw5GGgyeddCf-AU=",
      isBookmarked: false,
    },
    {
      exerciseId: 17,
      partyId: 2,
      partyName: "하이칵칵",
      date: "2000-05-01",
      dayOfTheWeek: "월",
      startTime: "08:00:00",
      endTime: "10:00:00",
      imageUrl:
        "https://media.istockphoto.com/id/1154370446/ko/%EC%82%AC%EC%A7%84/%ED%9D%B0%EC%83%89-%EB%B0%B0%EA%B2%BD%EC%97%90-%EA%B3%A0%EB%A6%BD-%EB%90%9C-%EB%B0%94%EC%9C%84-%EC%A0%9C%EC%8A%A4%EC%B2%98%EB%A5%BC-%EB%B3%B4%EC%97%AC%EC%A3%BC%EB%8A%94-%EB%85%B9%EC%83%89-%EC%84%A0%EA%B8%80%EB%9D%BC%EC%8A%A4%EC%97%90-%EC%9E%AC%EB%AF%B8-%EB%84%88%EA%B5%AC%EB%A6%AC.jpg?s=612x612&w=0&k=20&c=atEjJlw_9g7W6SBgISn3sebRa94-zw5GGgyeddCf-AU=",
      isBookmarked: false,
    },
    {
      exerciseId: 18,
      partyId: 2,
      partyName: "하이칵칵",
      date: "2000-05-01",
      dayOfTheWeek: "월",
      startTime: "08:00:00",
      endTime: "10:00:00",
      imageUrl:
        "https://media.istockphoto.com/id/1154370446/ko/%EC%82%AC%EC%A7%84/%ED%9D%B0%EC%83%89-%EB%B0%B0%EA%B2%BD%EC%97%90-%EA%B3%A0%EB%A6%BD-%EB%90%9C-%EB%B0%94%EC%9C%84-%EC%A0%9C%EC%8A%A4%EC%B2%98%EB%A5%BC-%EB%B3%B4%EC%97%AC%EC%A3%BC%EB%8A%94-%EB%85%B9%EC%83%89-%EC%84%A0%EA%B8%80%EB%9D%BC%EC%8A%A4%EC%97%90-%EC%9E%AC%EB%AF%B8-%EB%84%88%EA%B5%AC%EB%A6%AC.jpg?s=612x612&w=0&k=20&c=atEjJlw_9g7W6SBgISn3sebRa94-zw5GGgyeddCf-AU=",
      isBookmarked: false,
    },
    {
      exerciseId: 19,
      partyId: 3,
      partyName: "하이쿡쿡",
      date: "2000-05-01",
      dayOfTheWeek: "월",
      startTime: "08:00:00",
      endTime: "10:00:00",
      imageUrl:
        "https://media.istockphoto.com/id/1154370446/ko/%EC%82%AC%EC%A7%84/%ED%9D%B0%EC%83%89-%EB%B0%B0%EA%B2%BD%EC%97%90-%EA%B3%A0%EB%A6%BD-%EB%90%9C-%EB%B0%94%EC%9C%84-%EC%A0%9C%EC%8A%A4%EC%B2%98%EB%A5%BC-%EB%B3%B4%EC%97%AC%EC%A3%BC%EB%8A%94-%EB%85%B9%EC%83%89-%EC%84%A0%EA%B8%80%EB%9D%BC%EC%8A%A4%EC%97%90-%EC%9E%AC%EB%AF%B8-%EB%84%88%EA%B5%AC%EB%A6%AC.jpg?s=612x612&w=0&k=20&c=atEjJlw_9g7W6SBgISn3sebRa94-zw5GGgyeddCf-AU=",
      isBookmarked: false,
    },
    {
      exerciseId: 48,
      partyId: 3,
      partyName: "하이쿡쿡",
      date: "2000-05-01",
      dayOfTheWeek: "월",
      startTime: "08:00:00",
      endTime: "10:00:00",
      imageUrl:
        "https://media.istockphoto.com/id/1154370446/ko/%EC%82%AC%EC%A7%84/%ED%9D%B0%EC%83%89-%EB%B0%B0%EA%B2%BD%EC%97%90-%EA%B3%A0%EB%A6%BD-%EB%90%9C-%EB%B0%94%EC%9C%84-%EC%A0%9C%EC%8A%A4%EC%B2%98%EB%A5%BC-%EB%B3%B4%EC%97%AC%EC%A3%BC%EB%8A%94-%EB%85%B9%EC%83%89-%EC%84%A0%EA%B8%80%EB%9D%BC%EC%8A%A4%EC%97%90-%EC%9E%AC%EB%AF%B8-%EB%84%88%EA%B5%AC%EB%A6%AC.jpg?s=612x612&w=0&k=20&c=atEjJlw_9g7W6SBgISn3sebRa94-zw5GGgyeddCf-AU=",
      isBookmarked: false,
    },
    {
      exerciseId: 50,
      partyId: 3,
      partyName: "하이쿡쿡",
      date: "2000-05-01",
      dayOfTheWeek: "월",
      startTime: "08:00:00",
      endTime: "10:00:00",
      imageUrl:
        "https://media.istockphoto.com/id/1154370446/ko/%EC%82%AC%EC%A7%84/%ED%9D%B0%EC%83%89-%EB%B0%B0%EA%B2%BD%EC%97%90-%EA%B3%A0%EB%A6%BD-%EB%90%9C-%EB%B0%94%EC%9C%84-%EC%A0%9C%EC%8A%A4%EC%B2%98%EB%A5%BC-%EB%B3%B4%EC%97%AC%EC%A3%BC%EB%8A%94-%EB%85%B9%EC%83%89-%EC%84%A0%EA%B8%80%EB%9D%BC%EC%8A%A4%EC%97%90-%EC%9E%AC%EB%AF%B8-%EB%84%88%EA%B5%AC%EB%A6%AC.jpg?s=612x612&w=0&k=20&c=atEjJlw_9g7W6SBgISn3sebRa94-zw5GGgyeddCf-AU=",
      isBookmarked: false,
    },
  ],
};

export const ExerciseMapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [calendar, setCalendar] = useState(false);
  const [selectedLocationId, setSelectedLocationId] =
    useState<SelectedLocation | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const ArrowIcon = calendar ? ArrowUp : ArrowDown;
  const [enableDrag, setEnableDrag] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (_: any, info: { offset: { y: number } }) => {
    if (info.offset.y < -10) {
      setIsExpanded(true);
    } else if (info.offset.y > 200 && enableDrag) {
      setIsExpanded(false);
      setSelectedLocationId(null);
    } else {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    const kakao = window.kakao;
    const container = mapRef.current;

    if (!container) return;

    const { latitude, longitude } = dummyResponse.currentLocation;
    const currentPos = new kakao.maps.LatLng(latitude, longitude);

    // 지도를 생성할 때 필요한 기본 옵션
    const options = {
      center: currentPos, // 지도의 중심좌표.
      level: 3, // 지도의 레벨(확대, 축소 정도)
      draggable: true,
      scrollwheel: true,
    };

    const map = new kakao.maps.Map(container, options);

    map.setCenter(currentPos);

    const myLocationMarker = new kakao.maps.Marker({
      position: currentPos,
      image: new kakao.maps.MarkerImage(
        "/src/assets/icons/map_mylocation.svg",
        new kakao.maps.Size(40, 40),
        { offset: new kakao.maps.Point(20, 20) },
      ),
    });

    myLocationMarker.setMap(map);

    dummyResponse.exerciseLocations.forEach(loc => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(loc.latitude, loc.longitude),
        image: new kakao.maps.MarkerImage(
          "/src/assets/icons/map_marker.svg",
          new kakao.maps.Size(28.8, 35.2),
          {
            offset: new kakao.maps.Point(20, 20),
          },
        ),
        map,
      });

      // 마커 클릭 이벤트 등록
      kakao.maps.event.addListener(marker, "click", () => {
        setSelectedLocationId(dummyExerciseDetail);
      });
    });
    // });
  }, []);

  useEffect(() => {
    if (!isExpanded || !scrollRef.current) return;

    const el = scrollRef.current;
    const onScroll = () => {
      if (el.scrollTop === 0) {
        setEnableDrag(true);
      } else {
        setEnableDrag(false);
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [isExpanded]);

  return (
    <div className="flex flex-col items-center h-screen -mx-4 -mb-8">
      <PageHeader title="지도로 운동 찾기" />
      <div className="relative w-full flex-1 bg-gy-400" ref={mapRef}>
        <div className="absolute flex items-center gap-2 top-3 left-1/2 -translate-x-1/2 w-25 h-7 py-1 pl-2 pr-1.5 border-hard bg-white z-10">
          <span className="body-rg-500">05.05 (월)</span>
          <img
            src={ArrowIcon}
            alt="arrow"
            className="size-4"
            onClick={() => setCalendar(true)}
          />
        </div>
      </div>
      {calendar && (
        <div className="z-10">
          <ExerciseMapCalendar onClose={() => setCalendar(false)} />
        </div>
      )}

      {/* bottom */}
      {selectedLocationId && (
        <motion.div
          drag={enableDrag ? "y" : false}
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
            {dummyExerciseDetail.exercises.map(exercise => (
              <div className="pb-3 border-b-1 border-gy-200 mb-3">
                <Exercise_M
                  key={exercise.exerciseId}
                  id={exercise.exerciseId}
                  title={exercise.partyName}
                  date={exercise.date}
                  time={`${exercise.startTime} ~ ${exercise.endTime}`}
                  location={dummyExerciseDetail.buildingName}
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
