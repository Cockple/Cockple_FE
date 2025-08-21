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
import { addWon, fmtKRW } from "../../../utils/moneychange";
import { uploadImage } from "../../../api/image/imageUpload"; 

const dayOptions = ["전체", "월", "화", "수", "목", "금", "토", "일"];
const timeOptions = ["상시", "오전", "오후"];

export const EditGroupInfoDefault = () => {
  const { partyId } = useParams<{ partyId: string }>(); 
  const numericPartyId = Number(partyId);
  console.log(numericPartyId);
  const digits = (s: string) => s.replace(/\D/g, "");
  const [joinFeeChecked, setJoinFeeChecked] = useState(false); 
  const [joinFeeText, setJoinFeeText] = useState("");
  const [designatedChecked, setDesignatedChecked] = useState(false);
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isChanged, setIsChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthlyFeeChecked, setMonthlyFeeChecked] = useState(false);
  const [monthlyFeeText, setMonthlyFeeText] = useState("");

  const [designatedText, setDesignatedText] = useState("");
  const [contentText, setContentText] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]); 
  const [photoKeys, setPhotoKeys] = useState<string[]>([]); 

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
        // if (data.partyImgUrl) setPhotos([data.partyImgUrl]);
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
        activityDay: selectedDays,
        activityTime: selectedTime,
        designatedCock: designatedText || undefined,
        joinPrice: joinFeeText ? Number(joinFeeText.replace(/\D/g, "")) : undefined,
        price: monthlyFeeText ? Number(monthlyFeeText.replace(/\D/g, "")) : undefined,
        content: contentText || undefined,
        keyword: keywords.length > 0 ? keywords : undefined,
        imgKey: photoKeys[0] || undefined, 
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

  // 파일 선택 후 단일 이미지 업로드
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { imgUrl, imgKey } = await uploadImage("PARTY", file);

      // 단일 이미지라 기존 이미지 덮어쓰기
      setPhotos([imgUrl]);
      setPhotoKeys([imgKey]);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-8 mb-8">
      <PageHeader title="모임 정보 수정" onBackClick={handleBackClick} />
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
      <div className="flex flex-col gap-y-6"> 
        <CheckBox_Long_noButton
          title="지정콕"
          maxLength={20}
          Label="없음"
          showIcon={true}
          value={designatedText}  
          checked={designatedChecked}         
          onChange={(checked, value) => {
            setDesignatedChecked(checked);
            setDesignatedText(value);   
          }}
        />
        <CheckBox_Long_noButton
          title="가입비"
          maxLength={100}
          Label="없음"
          showIcon={true}
          value={joinFeeText}
          checked={joinFeeChecked}
          onChange={(checked, value) => {
            setJoinFeeChecked(checked);
            const formatted = addWon(fmtKRW(digits(value)));
            setJoinFeeText(formatted);
          }}
        />
        <CheckBox_Long_noButton
          title="회비"
          maxLength={100}
          Label="없음"
          showIcon={true}
          value={monthlyFeeText}  
          checked={monthlyFeeChecked}
          onChange={(checked, value) => {
            setMonthlyFeeChecked(checked);
            const formatted = addWon(fmtKRW(digits(value)));
            setMonthlyFeeText(formatted);
          }}
        />
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
            <div className="flex flex-col items-center justify-center text-center">
                <Camera />
                {/* <label className="mt-1">{`${photos.length} / 3`}</label> */}
            </div>
          </button>

          {photos[0] && (
          <div className="relative w-24 h-24 flex-shrink-0 border rounded-xl border-[#E4E7EA] overflow-hidden">
            <img
              src={photos[0]}
              alt="uploaded"
              className="w-full h-full object-cover rounded-xl"
            />
            <Dismiss_Gy800
              onClick={() => {
                setPhotos([]);
                setPhotoKeys([]);
              }}
              className="absolute top-1 right-1 w-6 h-6 p-1 cursor-pointer"
            />
          </div>
        )}

        </div>

        {/* 소개 글 및 키워드 */}
        <div className="mt-8">
        <InputField
          title="멤버에게 하고 싶은 말 / 소개"
          maxLength={45}
          value={contentText}           
          onChange={setContentText}    
        />
      
        </div>
          <label className="flex items-center text-left header-h5 mb-1">
            키워드
          </label>
          <div className="flex flex-wrap gap-2 items-center justify-center mb-8">
            {["브랜드 스폰", "가입비 무료", "친목", "운영진이 게임을 짜드려요"].map((kw) => (
              <TagBtn
                key={`${kw}-${keywords.includes(kw)}`} 
                isSelected={keywords.includes(kw)}
                onClick={() => {
                  setKeywords(prev =>
                    prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
                  );
                }}
              >
                {kw}
              </TagBtn>
            ))}
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
