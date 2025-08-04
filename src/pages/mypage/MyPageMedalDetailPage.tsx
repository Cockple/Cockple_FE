import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Grad_Mix_L from "../../components/common/Btn_Static/Text/Grad_Mix_L";
import { Modal_Delete } from "../../components/MyPage/Modal_ Delete";
import Kitty from "../../assets/images/Image Carousel.png";

interface MyPageMedalDetailPageProps {
  photo?: File | string | (File | string)[];
  title?: string; // 대회명
  date?: string; // 날짜
  participationType?: string; // 참여 형태
  record?: string; // 대회 기록
  videoUrl?: string[]; // 영상 링크 여러개
}

export const MyPageMedalDetailPage = ({
  // photo,
  // title,
  // date,
  // participationType,
  // record,
  // videoUrl,

  photo = [Kitty, Kitty, Kitty],
  title = "콕",
  date = "2025.05.23",
  participationType = "D조",
  // record = "Lorem ipsum dolor sit amet consectetur. Dui justo aliquet sit eu nec enim elit quis vestibulum.",
  record = " vestibulum.",

  videoUrl = ["https://www.youtube.com/watch?v=TpPwI_Lo0YY&list=PLGa3uxog5E0vn3sJ7abmZNysTye6pSbn6"],
}: MyPageMedalDetailPageProps) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const HEADER_HEIGHT = "3rem";

  // photo가 배열인지 체크 후, 각각 string 혹은 File일 경우 URL 처리
  const images = Array.isArray(photo)
    ? photo.map(p => (typeof p === "string" ? p : URL.createObjectURL(p)))
    : photo
      ? [typeof photo === "string" ? photo : URL.createObjectURL(photo)]
      : [];

  const urls = videoUrl ?? [];

  return (
    <div className="w-full max-w-[444px] mx-auto min-h-screen bg-white relative overflow-x-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[23.4375rem] z-20 bg-white">
        <PageHeader title="내 메달" />
      </div>

      {/* 스크롤 영역 */}
      <div
        className="relative mt-2 w-full "
        style={{
          padding: 0,
        }}
      > 
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={0}
          style={{ width: "100%" }}
        >
          {images.map((img, idx) => (
            <SwiperSlide
              key={idx}
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <img
                src={img}
                alt={`메달 이미지 ${idx + 1}`}
                style={{
                  width:"100%",
                  // width: "23.4375rem", 
                  height: "23.4375rem",
                  objectFit: "cover",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>



        {/* 오버레이 영역 */}
        <div className="absolute -bottom-8 left-4 right-4 flex items-start justify-between gap-4 z-10">
          <div className="overflow-hidden">
            <img
              src={images[0] ?? Kitty}
              alt="프로필"
              className="w-20 h-20 object-cover"
            />
          </div>
          <p className="body-rg-500 self-end">{date}</p>
        </div>
      </div>

      {/* 대회명 */}
      <p className="text-left header-h4 mt-12 leading-snug">{title}</p>

      {/* 참가 정보 */}
      <div className="flex justify-between items-center mt-5">
        <p className="header-h5">참여 형태 및 급수</p>
        <p className="body-md-500">{participationType}</p>
      </div>

      {/* 대회 기록 */}
      <div className="mt-5">
        <p className="header-h5 text-start mb-1">대회 기록</p>
        <textarea
          className="auto-resizing-css w-full border rounded-xl p-2 pr-14 body-md-500 border-[#E4E7EA] focus:outline-none resize-none overflow-hidden max-h-[188px]"
          value={
            record
              ? record
                  .replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9.,!?()\s]/g, "")
                  .slice(0, 100)
              : ""
          }
          readOnly
        />
      </div>

      {/* 영상 링크 */}
      <div className="mt-5">
        <p className="header-h5 text-start mb-1">영상 링크</p>
        <div className="flex flex-col gap-1">
          {urls.length > 0 ? (
            urls.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border rounded-xl p-2 pr-14 body-md-500 border-[#E4E7EA] focus:outline-none text-black truncate text-left"
                title={url}
              >
                {url.length > 40 ? `${url.slice(0, 40)}...` : url}
              </a>
            ))
          ) : (
            <p className="body-md-500 text-[#E4E7EA]">
              등록된 영상 링크가 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* 수정하기 버튼 */}
      <div className="mt-6 flex justify-between">
        <Grad_Mix_L
          type="delete"
          label="수정하기"
          onClick={() =>
            navigate("/mypage/mymedal/add", {
              state: {
                mode: "edit",
                medalData: {
                  title,
                  date,
                  participationType,
                  record,
                  photo,
                  videoUrl,
                },
              },
            })
          }
          onImageClick={() => setIsDeleteModalOpen(true)}
        />
      </div>

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <Modal_Delete
            onConfirm={() => {
              setIsDeleteModalOpen(false);
              console.log("삭제");
            }}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
