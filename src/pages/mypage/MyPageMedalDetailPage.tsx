import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useNavigate, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Grad_Mix_L from "../../components/common/Btn_Static/Text/Grad_Mix_L";
import { Modal_Delete } from "../../components/MyPage/Modal_ Delete";
import None_Error from "../../assets/images/None_Error.png";
import { getContestRecordDetail, deleteContestRecord } from "../../api/contest/contestmy";
import { getMemberContestDetail } from "../../api/contest/member";
import type { ContestDetailResponse } from "../../api/contest/member";
import type { ContestRecordDetailResponse } from "../../api/contest/contestmy";
import { getMyProfile } from "../../api/member/my";
import BaseProfileImg from "@/assets/images/base_profile_img.png?url";
import { LoadingSpinner } from "../../components/common/LoadingSpinner"; 

interface MedalDetail {
  photo?: string[];
  title?: string;
  date?: string;
  participationType?: string;
  record?: string;
  videoUrl?: string[];
}

export const MyPageMedalDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ memberId?: string; contestId?: string; contentId?: string }>();
  const memberId = params.memberId;
  const [medalDetail, setMedalDetail] = useState<MedalDetail | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const contentId = params.contestId || params.contentId;

  const participationMap: Record<string, string> = {
    "WOMEN_DOUBLES": "여복",
    "MEN_DOUBLES": "남복",
    "MIXED_DOUBLES": "혼복",
    "SINGLES": "단식",
  };
  const levelMap: Record<string, string> = {
    "BEGINNER": "왕초심",
    "INTERMEDIATE": "중급",
    "ADVANCED": "상급",
  };
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile();
        setProfilePhoto(profile.profileImgUrl ?? null);
      } catch (err) {
        console.error("프로필 조회 실패", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!contentId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        let data: ContestDetailResponse | ContestRecordDetailResponse | null = null;

        if (memberId) {
          data = await getMemberContestDetail(Number(memberId), Number(contentId));
        } else {
          data = await getContestRecordDetail(Number(contentId));
        }

        if (!data) {
          setMedalDetail(null);
          setIsLoading(false);
          return;
        }

        setMedalDetail({
          title: data.contestName ?? "",
          date: data.date ?? "",
          participationType: `${data.type ?? ""} - ${data.level ?? ""}`,
          photo: ((data as any).contestImgUrls ?? []).map((url: string) => {
            let decoded = decodeURIComponent(url);
            decoded = decoded.replace(
              /^https:\/\/s3\.ap-northeast-2\.amazonaws\.com\/cockple-bucket\/https?:\/\//,
              "https://"
            );
            return decoded;
          }),
          videoUrl: Array.isArray((data as any).contestVideoUrls)
            ? (data as any).contestVideoUrls
            : [],
          record: typeof data.content === "string" ? data.content : "",
        });
      } catch (err) {
        console.error(err);
        setMedalDetail(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [contentId, memberId]);

  // 로딩 중 스피너 표시
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="translate-y-10">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!medalDetail) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>메달 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const displayImages = medalDetail.photo?.length ? medalDetail.photo : [None_Error];
  const urls = medalDetail.videoUrl ?? [];
  const record = medalDetail.record ?? "";
  const date = medalDetail.date ?? "";
  const participationType = medalDetail.participationType ?? "";

  return (
    <div className="w-full max-w-[444px] mx-auto min-h-screen bg-white relative overflow-x-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[23.4375rem] z-20 bg-white">
        <PageHeader title="내 메달" />
      </div>

      {/* 이미지 스와이퍼 */}
      <div className="relative mt-2 w-full" style={{ padding: 0 }}>
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={0}
          style={{ width: "100%" }}
          observer={true}       
          observeParents={true}
        >
          {displayImages.map((img, idx) => (
            <SwiperSlide
              key={idx}
              style={{ display: "flex", justifyContent: "center", padding: 0 }}
            >
              <img
                src={img}
                alt={`메달 이미지 ${idx + 1}`}
                style={{ width: "100%", height: "23.4375rem", objectFit: "cover" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 오버레이 영역 */}
        <div className="absolute -bottom-8 left-4 right-4 flex items-start justify-between gap-4 z-10">
          <div className="overflow-hidden">
            <img
              src={profilePhoto ?? BaseProfileImg} 
              alt="회원 프로필"
              className="w-20 h-20 object-cover"
            />
          </div>
          <p className="body-rg-500 self-end">{date}</p>
        </div>
      </div>

      {/* 대회명 */}
      <p className="text-left header-h4 mt-12 leading-snug">{medalDetail.title}</p>

      {/* 참여 형태 및 급수 */}
      <div className="flex justify-between items-center mt-5">
        <p className="header-h5">참여 형태 및 급수</p>
        <p className="body-md-500">
          {(() => {
            if (!participationType) return "-";
            const [typeCode, levelCode] = participationType.split(" - ");
            const typeKor = participationMap[typeCode] ?? typeCode;
            const levelKor = levelMap[levelCode] ?? levelCode;
            return `${typeKor} - ${levelKor}`;
          })()}
        </p>
      </div>

      {/* 대회 기록 */}
      <div className="mt-5">
        <p className="header-h5 text-start mb-1">대회 기록</p>
        <textarea
          className="auto-resizing-css w-full border rounded-xl p-2 pr-14 body-md-500 border-[#E4E7EA] focus:outline-none resize-none overflow-hidden max-h-[188px]"
          value={record ? record.slice(0, 100) : ""}
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
            <p className="body-md-500 text-[#E4E7EA]">등록된 영상 링크가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 수정 버튼 */}
      <div className="mt-6 flex justify-between">
        <Grad_Mix_L
          type="delete"
          label="수정하기"
          onClick={() =>
            navigate("/mypage/mymedal/add", {
              state: {
                mode: "edit",
                contestId: contentId, 
                medalData: medalDetail,
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
            onConfirm={async () => {
              if (!contentId) return;
              try {
                await deleteContestRecord(Number(contentId));
                setIsDeleteModalOpen(false);
                navigate("/mypage/mymedal");
              } catch (error) {
                console.error("삭제 실패", error);
                alert("삭제하지 못했습니다. 다시 시도해주세요");
              }
            }}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
