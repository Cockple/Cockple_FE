import { SwiperSlide, Swiper } from "swiper/react";
import { Pagination } from "swiper/modules";
import LoginSwiping from "@/components/login/LoginSwiping";
import KakaoIcon from "@/assets/icons/kakao.svg?url";
import { TEXT_MAP } from "@/constants/onboarding";

export const LoginPage = () => {
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
      <section className="flex-1">
        <Swiper
          modules={[Pagination]}
          spaceBetween={50}
          speed={500}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="flex-1"
        >
          {TEXT_MAP.map((item, index) => (
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
      </section>

      <div className=" mb-6">
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
