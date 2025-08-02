import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { ImageBox } from "../../components/common/ImageBox";
import DateAndTimePicker from "../../components/common/Date_Time/DateAndPicker";
import Camera from "../../assets/icons/camera.svg?react";
import CicleSRED from "../../assets/icons/cicle_s_red.svg?react";
import Kitty from "../../assets/images/Image Carousel.png";
import Dismiss_Gy800 from "../../assets/icons/dismiss_gy800.svg?react";
import { Modal_Add_Caution } from "../../components/MyPage/Modal_Add_Caution";
import { Modal_Caution_Name } from "../../components/MyPage/Modal_Caution_Name";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { CheckBox_Long_noButton } from "../../components/MyPage/CheckBox_Long_noButton";
import { MyMedalCheckBox } from "../../components/MyPage/MyMedalCheckBox";
import { useForm } from "react-hook-form";

export const MyPageMedalAddPage = () => {
  const {
    register,
    // handleSubmit,
    setValue,
    // formState: { errors },
  } = useForm();
  // export const MyPageMedalAddPage = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  // ‼️ 배포 오류를 위한 임시 코드
  const selectedGrade = "";
  const [tournamentName, setTournamentName] = useState(""); // 대화명 상태
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [videoLinks, setVideoLinks] = useState<string[]>([""]); // 최소 1개 영상
  const formOptions = ["혼복", "여복", "남복", "단식"];
  const [recordText, setRecordText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const pickerRef = useRef<{ getDueString: () => string }>(null);
  const isSaveEnabled =
    tournamentName.trim() !== "" &&
    selectedDate !== "" &&
    selectedForm !== null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalNameOpen, setIsModalNameOpen] = useState(false);

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
  const [open, setOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  // ‼️ 배포 오류를 위한 임시 코드
  const disabled = false;
  // const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();
  const { medalId } = useParams();
  useEffect(() => {
    console.log("medalId:", medalId); // 확인용
    // 나중에 서버 요청: fetch(`/api/v1/medals/${medalId}`)
  }, [medalId]);
  const location = useLocation();
  const isEditMode = location.state?.mode === "edit";
  const medalData = location.state?.medalData;

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

  useEffect(() => {
    if (isEditMode && medalData) {
      setTournamentName(medalData.title);
      // setSelectedDate(new Date(medalData.date));
      setSelectedForm(medalData.participationType);
      setRecordText(medalData.record);
      setVideoLinks(medalData.videoUrl);
      // photo도 base64인지 URL인지에 따라 처리 필요
    }
  }, []);

  const images = ["url1.jpg", "url2.jpg", "url3.jpg"];

  const handleCloseOverlay = () => {
    if (pickerRef.current) {
      const date = pickerRef.current.getDueString(); // 선택된 값
      setSelectedDate(date); //  input에 넣기
      setValue("birthday", date, { shouldValidate: true }); //set Value를 통해 useForm에 전달
    }
    setOpenModal(false); // 닫기
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotos(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file); // base64 인코딩해서 보여줌
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

  const onBackClick = () => {
    if (tournamentName === "") {
      setIsModalNameOpen(true);
      return;
    }
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
    setIsModalNameOpen(false);
  };
  console.log(tournamentName, selectedDate, selectedForm);
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
        {isModalNameOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <Modal_Caution_Name onCancel={handleCancelLeave} />
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
              <CicleSRED/>
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
              {images.map((_, i) => (
                <ImageBox
                  key={i}
                  imageSrc={Kitty}
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
                <img src="/src/assets/icons/cicle_s_red.svg" alt="icon-cicle" />
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
              <CicleSRED/>
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
              <CicleSRED/>
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
                    src="/src/assets/icons/arrow_down.svg"
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
            onClick={() => {
              if (!isSaveEnabled) return;
              console.log("대회 기록 저장 완료");
            }}
          />
        </div>
      </div>
    </div>
  );
};
