import { MultiSelectButtonGroup } from "../../../components/common/MultiSelectButtonGroup";
import { useState, useEffect, useRef } from "react";
import CicleSRED from "../../../assets/icons/cicle_s_red.svg?react";
import Camera from "../../../assets/icons/camera.svg?react";
import Dismiss_Gy800 from "../../../assets/icons/dismiss_gy800.svg?react";
import { CheckBox_Long_noButton } from "../../../components/MyPage/CheckBox_Long_noButton";
import { InputField } from "../../../components/group/InputField";
import Grad_GR400_L from "../../../components/common/Btn_Static/Text/Grad_GR400_L";
import TagBtn from "../../../components/common/DynamicBtn/TagBtn";
import { PageHeader } from "../../../components/common/system/header/PageHeader";
import { Modal_Caution } from "../../../components/MyPage/Modal_Caution";
import { useNavigate, useParams  } from "react-router-dom";
import { updateParty, getPartyDetail } from "../../../api/party/patchParties";
import type { UpdatePartyRequest, PartyDetail } from "../../../api/party/patchParties";

const dayOptions = ["전체", "월", "화", "수", "목", "금", "토", "일"];
const timeOptions = ["상시", "오전", "오후"];

export const EditGroupInfoDefault = () => {
  const { partyId } = useParams<{ partyId: string }>(); 
  const numericPartyId = Number(partyId);
  console.log(numericPartyId);

  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [designatedText, setDesignatedText] = useState("");
  const [joinFeeText, setJoinFeeText] = useState("");
  const [monthlyFeeText, setMonthlyFeeText] = useState("");
  const [contentText, setContentText] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const isFormValid =
    selectedDays.length > 0 &&
    selectedTime !== "" &&
    designatedText.trim() !== "" &&
    joinFeeText.trim() !== "" &&
    monthlyFeeText.trim() !== "";

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 초기 데이터 불러오기
  useEffect(() => {
    if (!numericPartyId) return;

    const fetchParty = async () => {
      try {
        const data: PartyDetail = await getPartyDetail(numericPartyId);

        setSelectedDays(data.activityDays);
        setSelectedTime(data.activityTime);
        setDesignatedText(data.designatedCock);
        setJoinFeeText(data.joinPrice?.toString() || "");
        setMonthlyFeeText(data.price?.toString() || "");
        setContentText(data.content || "");
        setKeywords(data.keywords || []);
        if (data.partyImgUrl) setPhotos([data.partyImgUrl]);
      } catch (err) {
        console.error("모임 정보 불러오기 실패", err);
      }
    };

    fetchParty();
  }, [numericPartyId]);

  // =====================
  // 변경 체크
  // =====================
  useEffect(() => {
    if (
      selectedDays.length > 0 ||
      selectedTime !== "" ||
      photos.length > 0 ||
      designatedText !== "" ||
      joinFeeText !== "" ||
      monthlyFeeText !== "" ||
      contentText !== "" ||
      keywords.length > 0
    ) {
      setIsChanged(true);
    }
  }, [
    selectedDays,
    selectedTime,
    photos,
    designatedText,
    joinFeeText,
    monthlyFeeText,
    contentText,
    keywords,
  ]);

  const handleUpdateParty = async () => {
    if (!numericPartyId) return;

    try {
      const payload: UpdatePartyRequest = {
        activityDay: selectedDays,         // 요일 배열
        activityTime: selectedTime,        // 시간
        designatedCock: designatedText || undefined,
        joinPrice: joinFeeText ? Number(joinFeeText) : undefined,
        price: monthlyFeeText ? Number(monthlyFeeText) : undefined,
        content: "", // InputField에서 값 받아서 넣어야 함
        keyword: ["브랜드 스폰", "가입비 무료"], // 실제 선택 키워드 반영
        imgKey: photos[0] || undefined, // 대표 이미지 key
      };

      const res = await updateParty(numericPartyId, payload);

      if (res.success) {
        alert("모임 정보가 성공적으로 수정되었습니다.");
        navigate(-1); // 수정 후 뒤로 이동
      } else {
        console.error(res.errorReason);
        alert("모임 정보 수정 실패");
      }
    } catch (err) {
      console.error("API 호출 에러", err);
      alert("API 호출 중 에러가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (selectedDays.length > 0 || selectedTime !== "" || photos.length > 0) {
      setIsChanged(true);
    }
  }, [selectedDays, selectedTime, photos]);

  const handleBackClick = () => {
    if (isChanged) {
      setIsModalOpen(true);
    } else {
      navigate(-1);
    }
  };
  const handleConfirmLeave = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  const handleCancelLeave = () => {
    setIsModalOpen(false);
  };

  const handleDayChange = (value: string[]) => {
    if (value.includes("전체")) {
      const isAllSelected = selectedDays.length === dayOptions.length - 1;
      setSelectedDays(
        isAllSelected ? [] : dayOptions.filter(day => day !== "전체"),
      );
    } else {
      setSelectedDays(value);
    }
  };

  // 사진 제거
  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  // 사진 추가 시 스크롤 이동
  useEffect(() => {
    if (containerRef.current && photos.length > 0) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [photos]);

  // 사진 추가 버튼 클릭 시 파일 선택창 오픈
  const handlePhotoClick = () => {
    if (photos.length < 3 && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 후 이미지 읽기
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotos(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-8 mb-8">
      <PageHeader title="대회 기록 수정하기" onBackClick={handleBackClick} />
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <Modal_Caution
            onConfirm={handleConfirmLeave}
            onCancel={handleCancelLeave}
            title={"수정 사항이 저장되지 않았어요."}
            alertText={"계속 작성하기"}
            location={"모임 상세 페이지로"}
          />
        </div>
      )}

      {/* 활동 요일 */}
      <div>
        <label className="mt-5 flex items-center text-left header-h5 mb-1">
          활동 요일
          <CicleSRED />
        </label>
        <MultiSelectButtonGroup
          options={dayOptions}
          selected={selectedDays}
          onChange={(value: string[] | string) =>
            handleDayChange(value as string[])
          }
        />
      </div>

      {/* 활동 시간 */}
      <div>
        <label className="flex items-center text-left header-h5 mb-1">
          활동 시간
          <CicleSRED />
        </label>
        <MultiSelectButtonGroup
          options={timeOptions}
          selected={selectedTime}
          onChange={value => setSelectedTime(value as string)}
          singleSelect={true}
        />
      </div>

      <div>
        <div className="flex justify-between items-start">
          <CheckBox_Long_noButton
            title="지정콕"
            maxLength={20}
            Label="없음"
            showIcon={true}
            onChange={(checked, value) => {
              // ‼️ 배포 오류를 위한 임시 코드
              console.log(checked);
              setDesignatedText(value);
            }}
          />
        </div>
        <div className="flex justify-between items-start">
          <CheckBox_Long_noButton
            title="가입비"
            maxLength={100}
            Label="없음"
            showIcon={true}
            onChange={(checked, value) => {
              // ‼️ 배포 오류를 위한 임시 코드
              console.log(checked);
              setJoinFeeText(value);
            }}
          />
        </div>
        <div className="flex justify-between items-start">
          <CheckBox_Long_noButton
            title="회비"
            maxLength={100}
            Label="없음"
            showIcon={true}
            onChange={(checked, value) => {
              // ‼️ 배포 오류를 위한 임시 코드
              console.log(checked);
              setMonthlyFeeText(value);
            }}
              value={monthlyFeeText} // 기존 값 표시

          />
          {/* <CheckBox_Long_noButton
  title="회비"
  maxLength={100}
  Label="없음"
  showIcon={true}
  onChange={(checked, value) => setMonthlyFeeText(value)}
  value={monthlyFeeText} // 기존 값 표시
/> */}

        </div>
      </div>

      {/* 사진 업로드 */}
      <div className=" flex-grow min-h-0 overflow-y-auto">
        <label className="flex items-center text-left header-h5 mb-1">
          대표 이미지
        </label>
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

        {/* 소개 글 및 키워드 */}
        <div className="mt-8">
        
          <InputField title="멤버에게 하고 싶은 말 / 소개" maxLength={45} />
        </div>
        <label className="flex items-center text-left header-h5 mb-1">
          키워드
        </label>
        <div className="flex flex-wrap gap-2 items-center justify-center mb-8">
          <TagBtn>브랜드 스폰</TagBtn>
          <TagBtn>가입비 무료</TagBtn>
          <TagBtn>친목</TagBtn>
          <TagBtn>운영진이 게임을 짜드려요</TagBtn>
        </div>
        <Grad_GR400_L
          label="수정하기"
          initialStatus={isFormValid ? "default" : "disabled"}
          onClick={handleUpdateParty}
        />
      </div>
    </div>
  );
};
