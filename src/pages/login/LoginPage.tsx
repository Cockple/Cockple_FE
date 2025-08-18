import { SwiperSlide, Swiper } from "swiper/react";
import { Pagination } from "swiper/modules";
import LoginSwiping from "../../components/login/LoginSwiping";
import KakaoIcon from "@/assets/icons/kakao.svg?url";
import OnboardingImg1 from "@/assets/images/onboarding1.png?url";
import OnboardingImg2 from "@/assets/images/onboarding2.png?url";
import OnboardingImg3 from "@/assets/images/onboarding3.png?url";

export const LoginPage = () => {
  const TextMap = [
    {
      title: "내 급수에 맞는 모임과 함께 운동해요",
      text1: "급수 정보와 지역을 기반으로,",
      text2: "나와 잘 맞는 운동 모임을 추천해드려요.",
      img: OnboardingImg1,
    },
    {
      title: "내가 원하는 모임을 만들어보세요",
      text1: "급수 정보와 지역을 기반으로,",
      text2: "모임 구성원을 추천해드려요",
      img: OnboardingImg2,
    },
    {
      title: "운동 기록부터 대회 입상까지,",
      title2: "한 눈에 정리해보세요 ",
      text1: "꾸준히 쌓이는 기록으로",
      text2: "성장을 눈으로 확인해보세요",
      img: OnboardingImg3,
    },
  ];

  const handleKakako = () => {
    const REST_API_KEY = `${import.meta.env.VITE_KAKAO_REST_API_KEY}`;
    const REDIRECT_URI = `${window.location.origin}/login/kakao`;
    const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

    window.location.href = KAKAO_AUTH_URI;
  };

  return (
    <div
      className="flex flex-col  w-full -mb-8"
      style={{ minHeight: "100dvh" }}
    >
      {/* 스와이퍼 */}
      <div className="flex-1">
        <Swiper
          modules={[Pagination]}
          spaceBetween={50}
          speed={500}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="flex-1"
        >
          {TextMap.map((item, index) => (
            <SwiperSlide key={index} className="pb-6">
              <LoginSwiping
                title={item.title}
                title2={item.title2}
                text1={item.text1}
                text2={item.text2}
                img={item.img}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className=" mb-4">
        <button
          className="bg-[#FEE500] w-full rounded-lg py-3 px-4 relative cursor-pointer"
          onClick={handleKakako}
        >
          카카오 로그인
          <img
            src={KakaoIcon}
            alt="카카오 아이콘"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
          />
        </button>
      </div>
    </div>
  );
};
