import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { ImageBox } from "../../components/common/ImageBox";
import { Modal_Add_Caution } from "../../components/MyPage/Modal_Add_Caution";
import { useNavigate, useLocation  } from "react-router-dom";
import { CheckBox_Long_noButton } from "../../components/MyPage/CheckBox_Long_noButton";
import { MyMedalCheckBox } from "../../components/MyPage/MyMedalCheckBox";
import { useForm } from "react-hook-form";
import { postMyContestRecord } from "../../api/contest/contestmy" 
import { getContestRecordDetail, patchMyContestRecord } from "../../api/contest/contestmy";
import type { PostContestRecordRequest } from "../../api/contest/contestmy"
import DateAndTimePicker from "../../components/common/Date_Time/DateAndPicker";
import Camera from "../../assets/icons/camera.svg?react";
import CicleSRED from "../../assets/icons/cicle_s_red.svg?react";
import Medal_1 from "../../assets/icons/medal_1.svg?react";
import Medal_2 from "../../assets/icons/medal_2.svg?react";
import Medal_3 from "../../assets/icons/medal_3.svg?react";
import { uploadImages } from "../../api/image/imageUpload";

import Dismiss_Gy800 from "../../assets/icons/dismiss_gy800.svg?react";
import Circle_Red from "@/assets/icons/cicle_s_red.svg?url";
import ArrowDown from "@/assets/icons/arrow_down.svg?url";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import type { ContestRecordDetailResponse } from  "../../api/contest/contestmy";

interface MedalDetail {
  photo?: string[];           // 이미지 URL 배열
  title?: string;             // 대회명
  date?: string;              // 날짜
  participationType?: string; // 참여 형태
  record?: string;            // 대회 기록
  videoUrl?: string[];        // 영상 링크 배열
}

export const MyPageMedalAddPage = () => {
  const {
    register,
    setValue,
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode ?? null;
  const contestId = location.state?.contestId ?? null; //contestId 받아오가
  // console.log("contestId",contestId);
  const medalData = location.state?.medalData ?? null;
  const isEditMode = mode === "edit";


  const [photos, setPhotos] = useState<string[]>([]);
  const selectedGrade = "";
  const [tournamentName, setTournamentName] = useState(""); // 대화명 상태
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [videoLinks, setVideoLinks] = useState<string[]>([""]); // 최소 1개 영상
  const formOptions = ["혼복", "여복", "남복", "단식"] as const;
  const [selectedForm, setSelectedForm] = useState<
    typeof formOptions[number] | null
  >(null);
  const [recordText, setRecordText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const pickerRef = useRef<{ getDueString: () => string }>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const level = [
    "왕초심",
    "초심",
    "D조",
    "C조",
    "B조",
    "A조",
    "준자강",
    "자강",
  ];
  const typeMap: Record<typeof formOptions[number], PostContestRecordRequest["type"]> = {
    "단식": "SINGLE",
    "남복": "MEN_DOUBLES",
    "여복": "WOMEN_DOUBLES",
    "혼복": "MIXED",
  };


  const levelMap: Record<string, PostContestRecordRequest["level"]> = {
    "왕초심": "BEGINNER",
    "초심": "BEGINNER",
    "D조": "BEGINNER",
    "C조": "INTERMEDIATE",
    "B조": "INTERMEDIATE",
    "A조": "ADVANCED",
    "준자강": "ADVANCED",
    "자강": "ADVANCED",
  };
  const parseParticipationType = (participationType: string): typeof formOptions[number] | null => {
    if (!participationType) return null;
    if (participationType.includes("SINGLE")) return "단식";
    if (participationType.includes("MEN_DOUBLES")) return "남복";
    if (participationType.includes("WOMEN_DOUBLES")) return "여복";
    if (participationType.includes("MIXED")) return "혼복";
    return null;
  };
  const [initialData, setInitialData] = useState<MedalDetail | null>(null);
//이미지 여러장 업로드 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 최대 3장 제한
    const fileArray = Array.from(files).slice(0, 3 - photos.length); 
    if (fileArray.length === 0) return;

    try {
      // 여러 장 업로드 API 호출
      const { images } = await uploadImages("CONTEST", fileArray);

      // 서버에서 받은 이미지 URL을 상태에 추가
      setPhotos(prev => [...prev, ...images.map(img => img.imgUrl)]);
    } catch (err) {
      console.error("이미지 업로드 실패", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };
  const sanitizeUrl = (url: string) => {
  // S3 버킷 경로가 중복되거나 인코딩된 경우 정리
    const parts = url.split('https%3A/');
    return parts.length > 1 ? decodeURIComponent('https:' + parts[1]) : url;
  };

  // API에서 contestId로 상세 데이터 불러오기
  const fetchContestDetail = async (contestId: string) => {
    try {
      const data: ContestRecordDetailResponse = await getContestRecordDetail(Number(contestId));
      setInitialData({
        title: data.contestName,
        date: data.date,
        participationType: `${data.type} - ${data.level}`,
        record: data.content,
        photo: data.contestImgUrls.map(sanitizeUrl),
        videoUrl: data.contestVideoUrls,
      });
    } catch (error) {
      console.error("기존 대회 기록 불러오기 실패", error);
    }
  };

  useEffect(() => {
    if (isEditMode && contestId) {
      fetchContestDetail(contestId);
    }
  }, [isEditMode, contestId]);
  console.log(contestId);

  useEffect(() => {
    if (initialData) {
      setTournamentName(initialData.title || "");
      setSelectedForm(parseParticipationType(initialData.participationType || ""));
      
      // participationType 예: "MEN_DOUBLES - INTERMEDIATE"
      const levelPart = initialData.participationType?.split(" - ")[1] ?? "";
      const levelMapReverse: Record<string, string> = {
        "BEGINNER": "왕초심",
        "INTERMEDIATE": "C조",  // 또는 사용자가 원하면 INTERMEDIATE → C조 매핑
        "ADVANCED": "A조",      // 예시
      };
      setSelectedLevel(levelMapReverse[levelPart] ?? "");
      
      setRecordText(initialData.record || "");
      setVideoLinks(initialData.videoUrl?.length ? initialData.videoUrl : [""]);
      setPhotos(initialData.photo || []);
      setSelectedDate(initialData.date || "");
    }
  }, [initialData]);

  useEffect(() => {
    if (isEditMode && medalData) {
      setTournamentName(medalData.title || "");
      setSelectedForm(parseParticipationType(medalData.participationType));
      setRecordText(medalData.record || "");
      setVideoLinks(
        medalData.videoUrl?.length > 0 ? medalData.videoUrl : [""]
      );
    }
  }, [isEditMode, medalData]);

  const [open, setOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const disabled = false;


  useEffect(() => {
    register("tournamentName", {
      required: "대회명은 필수 입력입니다",
      maxLength: {
        value: 60,
        message: "최대 60글자만 가능합니다",
      },
      onChange: e => setTournamentName(e.target.value),
    });
  }, [register]);

  // 수정 및 조회 상태에 따른 변화 보기
  useEffect(() => {
    if (isEditMode && medalData) {
      setTournamentName(medalData.title || "");
      setSelectedForm(medalData.participationType || null);
      setRecordText(medalData.record || "");
      setVideoLinks(medalData.videoUrl || [""]);
    }
  }, [isEditMode, medalData]);


  const images = [Medal_1, Medal_2, Medal_3]; 
  const handleCloseOverlay = () => {
    if (pickerRef.current) {
      const date = pickerRef.current.getDueString(); 
      setSelectedDate(date);
      setValue("birthday", date, { shouldValidate: true }); 
    }
    setOpenModal(false); 
  };

  const [openModal, setOpenModal] = useState(false);

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  useEffect(() => {
    if (containerRef.current && photos.length > 0) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [photos]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
const handlePhotoClick = () => {
  if (photos.length < 3 && fileInputRef.current) {
    fileInputRef.current.click();
  }
};

  const isDataChanged = () => {
    return (
      tournamentName.trim() !== "" ||
      selectedForm !== null ||
      selectedGrade !== "" ||
      recordText.trim() !== "" ||
      videoLinks.some(link => link.trim() !== "") ||
      photos.length > 0 ||
      selectedIndex !== null ||
      selectedDate !== undefined
    );
  };

 const isSaveEnabled =
    tournamentName.trim() !== "" &&
    selectedDate !== "" &&
    selectedForm !== null &&
    selectedLevel !== "";


  // 저장 클릭 핸들러
  const handleSaveClick = async () => {
    if (!isSaveEnabled) return;

    try {
      const mappedType: PostContestRecordRequest["type"] =
        selectedForm ? typeMap[selectedForm] : "SINGLE";
      const mappedLevel = selectedLevel ? levelMap[selectedLevel] : "EXPERT";

      const requestBody: PostContestRecordRequest = {
        contestName: tournamentName,
        date: selectedDate ? selectedDate.replace(/\./g, '-') : undefined,
        medalType:
          selectedIndex === 0
            ? "GOLD"
            : selectedIndex === 1
            ? "SILVER"
            : selectedIndex === 2
            ? "BRONZE"
            : "NONE",
        type: mappedType,
        level: mappedLevel,
        content: recordText || undefined,
        contentIsOpen: true,
        videoIsOpen: true,
        contestVideos: videoLinks.filter((link) => link.trim() !== ""),
        contestImgs: photos.map((p: any) => (typeof p === "string" ? p : p.url)),
      };



      console.log("요청 바디:", requestBody);

      let response;
      if (isEditMode && contestId) {
        response = await patchMyContestRecord(contestId, requestBody);
      } else {
        response = await postMyContestRecord(requestBody);
      }

      if (response.success && response.data) {
        const newContestId = response.data.contestId;
        alert(
          isEditMode
            ? "대회 기록이 성공적으로 수정되었습니다."
            : "대회 기록이 성공적으로 등록되었습니다."
        );
        navigate(`/mypage/mymedal/${newContestId}`);
      } else {
        alert("저장에 실패했습니다: " + response.message);
      }
    } catch (error) {
      console.error("대회 기록 저장 오류", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };


  const onBackClick = () => {
    if (isDataChanged()) {
      setIsModalOpen(true);
      return;
    }
    navigate("/myPage/mymedal");
  };

  const handleConfirmLeave = () => {
    setIsModalOpen(false);
    navigate("/myPage/mymedal");
  };

  const handleCancelLeave = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="max-w-[23.4375rem] mx-auto bg-white h-screen flex flex-col pt-2">
      <div className="flex-shrink-0 sticky top-0 z-20 bg-white ">
        <PageHeader title="대회 기록 추가하기" onBackClick={onBackClick} />
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <Modal_Add_Caution
              onConfirm={handleConfirmLeave}
              onCancel={handleCancelLeave}
            />
          </div>
        )}
      </div>

      <div className="flex-grow min-h-0 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-8">
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              ref={containerRef}
              className="flex gap-2 overflow-x-auto no-scrollbar"
            >
              <button
                onClick={handlePhotoClick}
                className="w-24 h-24 flex-shrink-0 border rounded-xl border-[#E4E7EA] flex items-center justify-center body-rg-500 bg-white"
                type="button"
              >
                <div className="flex flex-col text-center justify-center">
                  <Camera />
                  <label>{`${photos.length} / 3`}</label>
                </div>
              </button>

              {photos.map((src, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 flex-shrink-0 border rounded-xl border-[#E4E7EA] overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`uploaded-${i}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <Dismiss_Gy800
                    onClick={() => handleRemovePhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 p-1 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </>

          {/* 대회명 입력 */}
          <div>
            <label className="flex items-center text-left header-h5 mb-1">
              대회명
              <CicleSRED />
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none focus:border-active"
                {...register("tournamentName", {
                  required: "대회명은 필수 입력입니다",
                  maxLength: {
                    value: 60,
                    message: "최대 60글자만 가능합니다",
                  },
                  onChange: e => setTournamentName(e.target.value),
                })}
              />
            </div>
          </div>

          {/* 수상 */}
          <div>
            <label className="flex items-center text-left header-h5 mb-1">
              수상
            </label>
            <div className="flex gap-2 w-full items-center justify-center">
              {images.map((imgSrc, i) => (
                <ImageBox
                  key={i}
                  imageSrc={imgSrc} // 배열에서 하나씩 꺼내서 전달
                  isSelected={selectedIndex === i}
                  onClick={() =>
                    setSelectedIndex(selectedIndex === i ? null : i)
                  }
                />
              ))}
            </div>
            <p className="body-sm-500 text-left text-[#767B89] mt-1">
              입상하지 못했다면 선택하지 않아도 됩니다.
            </p>
          </div>

          {/* 날짜 */}
          <div>
            <div className="text-left flex flex-col gap-2">
              <div className="flex px-1 gap-[2px] items-center">
                <p className="header-h5">날짜</p>
                <img src={Circle_Red} alt="icon-cicle" />
              </div>

              <input
                type="text"
                className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none focus:border-active "
                onClick={() => setOpenModal(true)}
                value={selectedDate}
              />

              {openModal && (
                <div
                  id="date-picker-overlay"
                  className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
                  onClick={e => {
                    if (
                      (e.target as HTMLElement).id === "date-picker-overlay"
                    ) {
                      handleCloseOverlay();
                    }
                  }}
                >
                  <div onClick={e => e.stopPropagation()}>
                    <DateAndTimePicker ref={pickerRef} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 참여 형태 */}
          <div>
            <label className="flex items-center text-left header-h5 mb-1">
              참여 형태
              <CicleSRED />
            </label>
            <div className="flex gap-4">
              {formOptions.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSelectedForm(item)}
                  className={
                    `flex-1 border rounded-lg py-2 text-center body-rg-500 transition-colors duration-150 shadow-ds200-gr  ` +
                    (selectedForm === item
                      ? "border-[#0B9A4E]"
                      : "border-[#F4F5F6]")
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* 급수 */}
          <div>
            <label className="flex items-center text-left header-h5 mb-1">
              급수
              <CicleSRED />
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-40">
                <button
                  className="border px-3 py-[0.625rem] flex justify-between gap-2 rounded-xl border-gy-200 w-40 h-11 cursor-pointer"
                  onClick={() => !disabled && setOpen(!open)}
                >
                  <span className={disabled ? "text-gy-500" : "text-black"}>
                    {selectedLevel}
                  </span>
                  <img
                    src={ArrowDown}
                    alt="Dropdown arrow"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4"
                  />
                </button>

                {open && !disabled && (
                  <div className="absolute mt-1 z-10 w-40">
                    <ul
                      className="border rounded-xl border-gy-200 bg-white shadow text-left"
                      style={{ maxHeight: "8.5rem", overflowY: "auto" }}
                    >
                      {level.map((item, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            setSelectedLevel(item);
                            setOpen(false);
                          }}
                          className="cursor-pointer w-full px-3 py-[0.625rem] hover:bg-gy-100 rounded-xl"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 대회 기록 */}
          <div>
            <div className="flex justify-between items-start">
              <CheckBox_Long_noButton
                title="대회 기록"
                maxLength={100}
                Label="비공개"
              />
            </div>
          </div>

          {/* 영상 링크 */}
          <MyMedalCheckBox title="영상 링크" />

          {/* 저장 버튼  오류 발생 */}
          <Grad_GR400_L
            label="저장하기"
            initialStatus={isSaveEnabled ? "default" : "disabled"}
            // disabled={!isSaveEnabled}
            onClick={handleSaveClick}
          />
        </div>
      </div>
    </div>
  );
};
