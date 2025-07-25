import { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';  

import 'swiper/css';
import 'swiper/css/pagination';

import { PageHeader } from "../../components/common/system/header/PageHeader";

import Kitty from "../../assets/images/Image Carousel.png";

export const MyPageProfileMedalDetail = () => {
  const images = [Kitty, Kitty, Kitty];

  return (
    <div className="w-full max-w-[23.4375rem] mx-auto flex flex-col bg-white gap-5 px-4">
      <PageHeader title="내 메달" />

      <div className="relative mt-4 rounded-xl overflow-visible">
        <Swiper
          modules={[Pagination]}   
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={10}
          className="rounded-xl"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img}
                alt={`메달 이미지 ${idx + 1}`}
                className="w-full h-auto object-cover rounded-xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 오버레이 영역 */}
        <div className="absolute -bottom-8 left-4 right-4 flex items-start justify-between gap-4 z-10">
          <div className="overflow-hidden">
            <img
              src={Kitty}
              alt="프로필"
              className="w-20 h-20 object-cover"
            />
          </div>
          <p className="body-rg-500 self-end">2000. 01. 01</p>
        </div>
      </div>


      {/* 대회명 */}
      <p className="text-left header-h4 mt-12 leading-snug">
        2024 김학석배 전국종별배드민턴선수권대회 (초등부 결승)
      </p>

      {/* 참가 정보 */}
      <div className="flex justify-between items-center">
        <p className="header-h5">참여 형태 및 급수</p>
        <p className="body-md-500">여복 D조</p>
      </div>

      {/* 대회 기록 */}
      <div>
        <p className="header-h5 text-start mb-1">대회 기록</p>
        <textarea
          className="auto-resizing-css w-full border rounded-xl p-2 pr-14 body-md-500 border-[#E4E7EA] focus:outline-none resize-none overflow-hidden max-h-[188px]"
          defaultValue={`Lorem ipsum dolor sit amet consectetur. 
Consectetur lacinia aliquam urna magna eu faucibus lacus id consectetur.`}
        />
      </div>

      {/* 영상 링크 */}
      <div>
        <p className="header-h5 text-start mb-1">영상 링크</p>
        <div className="flex flex-col gap-1">
          <input
            className="w-full border rounded-xl p-2 pr-14 body-md-500 border-[#E4E7EA] focus:outline-none"
            type="text"
            defaultValue="https://www.youtube.com/watch?v=TpPwl..."
          />
          <input
            className="w-full border rounded-xl p-2 pr-14 body-md-500 border-[#E4E7EA] focus:outline-none"
            type="text"
            defaultValue="https://www.youtube.com/watch?v=TpPwl..."
          />
        </div>
      </div>

    
    </div>
  );
};
