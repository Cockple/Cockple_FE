import { useEffect, useState } from "react";
import { MainHeader } from "../../components/common/system/header/MainHeader";
import { Footer } from "../../components/common/system/Footer";
import { MyGroupWorkoutSection } from "../../components/home/MyGroupWorkoutSection";
import { RecommendedWorkoutSection } from "../../components/home/RecommendedWorkoutSection";
import { FloatingButton } from "../../components/common/system/FloatingButton";
import MapIcon from "@/assets/icons/map_white.svg";
import { useNavigate } from "react-router-dom";
import { MyExerciseCalendar } from "../../components/home/MyExerciseCalendar";

export type DailyExerciseItem = {
  id: number;
  title: string;
  location: string;
  time: string;
  imgSrc: string;
};

export type GroupExerciseItem = {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  imgSrc: string;
};

export const HomePage = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [rightOffset, setRightOffset] = useState(0);

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
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col justify-start items-center gap-vertical-section min-h-screen -mx-4 -mt-14 px-4 bg-white">
      <MainHeader
        background={isScrolled ? "white" : "clear"}
        className="ml-[0.05rem]"
      />
      {/* 배경색 적용 */}
      <div
        className="w-full flex flex-col gap-vertical-section"
        style={{
          background: "var(--color-gradient-home-header)",
          width: "calc(100% + 2rem)",
        }}
      >
        <div className="flex flex-col gap-4 mt-19 px-4">
          {/* 문구 */}
          <div className="flex flex-col items-start pb-5">
            <div className="body-lg-700">
              {count ? (
                <div>
                  오늘의 운동은<span className="text-gr-600 mx-1">{count}</span>
                  개!
                </div>
              ) : (
                <div>오늘은 쉬는 날!</div>
              )}
            </div>
            <div className="body-md-700">
              {count ? (
                <div>화이팅 넘치는 하루가 될 거에요!</div>
              ) : (
                <div>내일 더 힘차게 달려봐요!</div>
              )}
            </div>
          </div>

          <MyExerciseCalendar setCount={setCount} />
        </div>
      </div>

      {/* 내 모임 운동 */}
      <MyGroupWorkoutSection />

      {/* 운동 추천 */}
      <RecommendedWorkoutSection />
      <Footer />
      <FloatingButton
        size="L"
        color="green"
        icon={MapIcon}
        className="fixed z-50 bottom-30"
        style={{ right: rightOffset }}
        onClick={() => navigate("/exercise-map")}
      />
    </div>
  );
};
