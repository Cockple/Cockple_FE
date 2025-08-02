import { SwiperSlide, Swiper } from "swiper/react";
import { Pagination } from "swiper/modules";
import LoginSwiping from "../../components/login/LoginSwiping";
import KakaoIcon from "@/assets/icons/kakao.svg?url";

export const LoginPage = () => {
  const TextMap = [
    {
      title: "내 급수에 맞는 모임과 함께 운동해요",
      text1: "급수 정보와 지역을 기반으로,",
      text2: "나와 잘 맞는 운동 모임을 추천해드려요.",
    },
    {
      title: "내가 원하는 모임을 만들어보세요",
      text1: "급수 정보와 지역을 기반으로,",
      text2: "모임 구성원을 추천해드려요",
    },
    {
      title: "운동 기록부터 대회 입상까지,",
      title2: "한 눈에 정리해보세요 ",
      text1: "꾸준히 쌓이는 기록으로",
      text2: "성장을 눈으로 확인해보세요",
    },
  ];

  return (
    <div className="flex flex-col  w-full -mb-8 ">
      {/* 스와이퍼 */}
      <div className="">
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
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mb-2 mt-20">
        <button className="bg-[#FEE500] w-full rounded-lg py-3 px-4 relative">
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
