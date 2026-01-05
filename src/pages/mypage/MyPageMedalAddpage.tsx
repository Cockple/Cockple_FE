import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { ImageBox } from "../../components/common/ImageBox";
import { Modal_Add_Caution } from "../../components/MyPage/Modal_Add_Caution";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckBox_Long_noButton } from "../../components/MyPage/CheckBox_Long_noButton";
import { MyMedalCheckBox } from "../../components/MyPage/MyMedalCheckBox";
import { useForm } from "react-hook-form";
import { postMyContestRecord } from "../../api/contest/contestmy";
import { getContestRecordDetail, patchMyContestRecord } from "../../api/contest/contestmy";
import type { PostContestRecordRequest } from "../../api/contest/contestmy";
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
import type { PatchContestRecordRequest } from "../../api/contest/contestmy";

interface VideoData {
  id?: number; 
  url: string;
}

interface MedalDetail {
  photo?: string[];
  title?: string;
  date?: string;
  type?: string;
  level?: string;
  record?: string;
  videoData?: VideoData[]; 
  medalType?: string;
}

export const MyPageMedalAddPage = () => {
  const { register, setValue } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode ?? null;
  const contestId = location.state?.contestId ?? null;
  const medalData = location.state?.medalData ?? null;
  const isEditMode = mode === "edit";

  const [photos, setPhotos] = useState<string[]>([]);
  const [tournamentName, setTournamentName] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [initialVideoObjects, setInitialVideoObjects] = useState<VideoData[]>([]);
  const [initialData, setInitialData] = useState<MedalDetail | null>(null);

  const formOptions = ["혼복", "여복", "남복", "단식"] as const;
  const [selectedForm, setSelectedForm] = useState<typeof formOptions[number] | null>(null);
  const [recordText, setRecordText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const pickerRef = useRef<{ getDueString: () => string }>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const level = ["왕초심", "초심", "D조", "C조", "B조", "A조", "준자강", "자강"];

  // 매핑 테이블
  const typeMap: Record<typeof formOptions[number], PostContestRecordRequest["type"]> = {
    "단식": "SINGLE",
    "남복": "MEN_DOUBLES",
    "여복": "WOMEN_DOUBLES",
    "혼복": "MIX_DOUBLES",
  };
  const levelMap: Record<string, PostContestRecordRequest["level"]> = {
    "왕초심": "NOVICE",
    "초심": "BEGINNER",
    "D조": "D",
    "C조": "C",
    "B조": "B",
    "A조": "A",
    "준자강": "SEMI_EXPERT",
    "자강": "EXPERT",
    "급수 없음": "NONE",
  };

  const sanitizeUrl = (url: string) => {
    const parts = url.split('https%3A/');
    return parts.length > 1 ? decodeURIComponent('https:' + parts[1]) : url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const availableSlots = 3 - photos.length;
    const fileArray = Array.from(files).slice(0, availableSlots);
    if (fileArray.length === 0) return;
    try {
      const { images } = await uploadImages("CONTEST", fileArray);
      setPhotos(prev => [...prev, ...images.map(img => img.imgUrl)].slice(0, 3));
    } catch (err) {
      console.error("이미지 업로드 실패", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };


  // 1. 초기 데이터 로드 
  useEffect(() => {
    const initializeData = async () => {
      let dataToSet: MedalDetail | null = null;

      if (isEditMode && contestId) {
        try {
          const data: any = await getContestRecordDetail(Number(contestId));
          let mappedVideos: VideoData[] = [];
          if (data.contestVideoUrls && data.contestVideoUrls.length > 0) {
             if (typeof data.contestVideoUrls[0] === 'object') {
                mappedVideos = data.contestVideoUrls.map((v: any) => ({
                    id: v.contestVideoId || v.id, 
                    url: v.videoUrl || v.url
                }));
             } else {
                mappedVideos = data.contestVideoUrls.map((url: string) => ({
                    id: undefined,
                    url: url
                }));
             }
          }

          dataToSet = {
            title: data.contestName,
            date: data.date,
            type: data.type,
            level: data.level,
            record: data.content,
            photo: data.contestImgUrls.map(sanitizeUrl),
            videoData: mappedVideos,
            medalType: data.medalType,
          };
        } catch (error) {
          console.error("기존 대회 기록 불러오기 실패", error);
        }
      } else if (isEditMode && medalData) {
        dataToSet = medalData;
      }

      if (dataToSet) {
        setInitialData(dataToSet);
        setTournamentName(dataToSet.title || "");
        setValue("tournamentName", dataToSet.title || "");
        setSelectedDate(dataToSet.date || "");
        
        // 메달, 참여형태, 급수 설정
        if (dataToSet.medalType) {
            if (dataToSet.medalType === "GOLD") setSelectedIndex(0);
            else if (dataToSet.medalType === "SILVER") setSelectedIndex(1);
            else if (dataToSet.medalType === "BRONZE") setSelectedIndex(2);
            else setSelectedIndex(null);
        }
        
        const typeMapReverse: Record<string, typeof formOptions[number]> = { "SINGLE": "단식", "MEN_DOUBLES": "남복", "WOMEN_DOUBLES": "여복", "MIX_DOUBLES": "혼복", "MIXED": "혼복" };
        if (dataToSet.type && typeMapReverse[dataToSet.type]) setSelectedForm(typeMapReverse[dataToSet.type]);

        const levelMapReverse: Record<string, string> = { "NOVICE": "왕초심", "BEGINNER": "초심", "D": "D조", "C": "C조", "B": "B조", "A": "A조", "SEMI_EXPERT": "준자강", "EXPERT": "자강", "NONE": "급수 없음", "INTERMEDIATE": "C조", "ADVANCED": "A조" };
        setSelectedLevel(dataToSet.level ? levelMapReverse[dataToSet.level] ?? "" : "");

        setRecordText(dataToSet.record || "");
        
        const vData = dataToSet.videoData || [];
        setInitialVideoObjects(vData);      
        setVideoLinks(vData.map(v => v.url)); 
        
        setPhotos(dataToSet.photo || []);
      }
    };
    initializeData();
  }, [isEditMode, contestId, medalData, setValue]);

  const [open, setOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const disabled = false;
  useEffect(() => { register("tournamentName", { required: "대회명은 필수 입력입니다", maxLength: { value: 60, message: "최대 60글자만 가능합니다" }, onChange: e => setTournamentName(e.target.value) }); }, [register]);
  const images = [Medal_1, Medal_2, Medal_3];
  const handleCloseOverlay = () => { if (pickerRef.current) { const date = pickerRef.current.getDueString(); setSelectedDate(date); setValue("birthday", date, { shouldValidate: true }); } setOpenModal(false); };
  const [openModal, setOpenModal] = useState(false);
  const handleRemovePhoto = (index: number) => { const newPhotos = [...photos]; newPhotos.splice(index, 1); setPhotos(newPhotos); };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handlePhotoClick = () => { if (photos.length < 3 && fileInputRef.current) { fileInputRef.current.click(); } };
  
  const isDataChanged = () => false;
  const isSaveEnabled = tournamentName.trim() !== "" && selectedDate !== "" && selectedForm !== null && selectedLevel !== "";


  const handleSaveClick = async () => {
    if (!isSaveEnabled) return;

    try {
      const mappedType = selectedForm ? typeMap[selectedForm] : "SINGLE";
      const mappedLevel = selectedLevel ? levelMap[selectedLevel] : "EXPERT";

      const photosToDelete = initialData?.photo?.filter(p => !photos.includes(p)) || [];
      const newPhotosToAdd = isEditMode && initialData?.photo 
        ? photos.filter(p => !initialData.photo?.includes(p)) 
        : photos;

      const videosToDeleteIds = initialVideoObjects
        .filter(initVideo => !videoLinks.includes(initVideo.url)) 
        .map(v => v.id) 
        .filter((id): id is number => id !== undefined);

      const newVideosToAdd = videoLinks.filter(currentUrl => {
         const cleanUrl = currentUrl.trim();
         if (!cleanUrl) return false;
         return !initialVideoObjects.some(initVideo => initVideo.url === cleanUrl);
      });

      const patchBody: PatchContestRecordRequest = {
        contestName: tournamentName,
        date: selectedDate ? selectedDate.replace(/\./g, '-') : undefined,
        medalType: selectedIndex === 0 ? "GOLD" : selectedIndex === 1 ? "SILVER" : selectedIndex === 2 ? "BRONZE" : "NONE",
        type: mappedType,
        level: mappedLevel,
        content: recordText || undefined,
        contentIsOpen: true,
        videoIsOpen: true,
        
        contestVideos: newVideosToAdd,       
        contestVideoIdsToDelete: videosToDeleteIds, 
        
        contestImgs: newPhotosToAdd,         
        contestImgsToDelete: photosToDelete,   
      };

      let response;
      if (isEditMode && contestId) {
        response = await patchMyContestRecord(contestId, patchBody);
      } else {
        response = await postMyContestRecord({
            ...patchBody, 
            contestImgs: photos, 
            contestVideos: videoLinks.filter(v => v.trim() !== "")
        });
      }

      if (response.success && response.data) {
        navigate(`/mypage/mymedal/${response.data.contestId}`);
      } else {
        alert("저장에 실패했습니다: " + response.message);
      }
    } catch (error) {
      console.error("대회 기록 저장 오류", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  const onBackClick = () => { if (isDataChanged()) { setIsModalOpen(true); return; } navigate("/myPage/mymedal"); };
  const handleConfirmLeave = () => { setIsModalOpen(false); navigate("/myPage/mymedal"); };
  const handleCancelLeave = () => { setIsModalOpen(false); };

  return (
    <div className="max-w-[23.4375rem] mx-auto bg-white h-screen flex flex-col pt-2">
      <div className="flex-shrink-0 sticky top-0 z-20 bg-white ">
        <PageHeader title={isEditMode ? "대회 기록 수정하기" : "대회 기록 추가하기"} onBackClick={onBackClick} />
        {isModalOpen && ( <div className="fixed inset-0 flex justify-center items-center z-50"> <Modal_Add_Caution onConfirm={handleConfirmLeave} onCancel={handleCancelLeave} /> </div> )}
      </div>

      <div className="flex-grow min-h-0 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-8">
           <>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            <div ref={containerRef} className="flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={handlePhotoClick} className="w-24 h-24 flex-shrink-0 border rounded-xl border-[#E4E7EA] flex items-center justify-center body-rg-500 bg-white" type="button">
                <div className="flex flex-col items-center justify-center text-center"> <Camera /> <label className="mt-1">{`${photos.length} / 3`}</label> </div>
              </button>
              {photos.map((src, i) => (
                <div key={i} className="relative w-24 h-24 flex-shrink-0 border rounded-xl border-[#E4E7EA] overflow-hidden">
                  <img src={src} alt={`uploaded-${i}`} className="w-full h-full object-cover rounded-xl" />
                  <Dismiss_Gy800 onClick={() => handleRemovePhoto(i)} className="absolute top-1 right-1 w-6 h-6 p-1 cursor-pointer" />
                </div>
              ))}
            </div>
          </>

          
          <div>
            <label className="flex items-center text-left header-h5 mb-1"> 대회명 <CicleSRED /> </label>
            <div className="relative"> <input type="text" className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none focus:border-active" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} /> </div>
          </div>
          
          <div>
            <label className="flex items-center text-left header-h5 mb-1"> 수상 </label>
            <div className="flex gap-2 w-full items-center justify-center">
              {images.map((imgSrc, i) => ( <ImageBox key={i} imageSrc={imgSrc} isSelected={selectedIndex === i} onClick={() => setSelectedIndex(selectedIndex === i ? null : i) } /> ))}
            </div>
            <p className="body-sm-500 text-left text-[#767B89] mt-1"> 입상하지 못했다면 선택하지 않아도 됩니다. </p>
          </div>

          <div>
            <div className="text-left flex flex-col gap-2">
              <div className="flex px-1 gap-[2px] items-center"> <p className="header-h5">날짜</p> <img src={Circle_Red} alt="icon-cicle" /> </div>
              <input type="text" className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none focus:border-active " onClick={() => setOpenModal(true)} value={selectedDate} readOnly />
              {openModal && ( <div id="date-picker-overlay" className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={e => { if ( (e.target as HTMLElement).id === "date-picker-overlay" ) { handleCloseOverlay(); } }} > <div onClick={e => e.stopPropagation()}> <DateAndTimePicker ref={pickerRef} /> </div> </div> )}
            </div>
          </div>

          <div>
            <label className="flex items-center text-left header-h5 mb-1"> 참여 형태 <CicleSRED /> </label>
            <div className="flex gap-4">
              {formOptions.map(item => ( <button key={item} type="button" onClick={() => setSelectedForm(item)} className={ `flex-1 border rounded-lg py-2 text-center body-rg-500 transition-colors duration-150 shadow-ds200-gr  ` + (selectedForm === item ? "border-[#0B9A4E]" : "border-[#F4F5F6]") } > {item} </button> ))}
            </div>
          </div>

          <div>
            <label className="flex items-center text-left header-h5 mb-1"> 급수 <CicleSRED /> </label>
            <div className="flex items-center gap-4">
              <div className="relative w-40">
                <button className="border px-3 py-[0.625rem] flex justify-between gap-2 rounded-xl border-gy-200 w-40 h-11 cursor-pointer" onClick={() => !disabled && setOpen(!open)} >
                  <span className={disabled ? "text-gy-500" : "text-black"}> {selectedLevel} </span> <img src={ArrowDown} alt="Dropdown arrow" className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4" />
                </button>
                {open && !disabled && ( <div className="absolute mt-1 z-10 w-40"> <ul className="border rounded-xl border-gy-200 bg-white shadow text-left" style={{ maxHeight: "8.5rem", overflowY: "auto" }} > {level.map((item, idx) => ( <li key={idx} onClick={() => { setSelectedLevel(item); setOpen(false); }} className="cursor-pointer w-full px-3 py-[0.625rem] hover:bg-gy-100 rounded-xl" > {item} </li> ))} </ul> </div> )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-start"> <CheckBox_Long_noButton title="대회 기록" maxLength={100} Label="비공개" value={recordText} checked={isPrivate} onChange={(checked, value) => { setIsPrivate(checked); setRecordText(value); }} /> </div>
          </div>

          <MyMedalCheckBox
            title="영상 링크"
            value={videoLinks.length ? videoLinks : [""]}
            onChange={(newLinks) => {
                 setVideoLinks(newLinks); 
            }}
          />
          
          <Grad_GR400_L label="저장하기" initialStatus={isSaveEnabled ? "default" : "disabled"} onClick={handleSaveClick} />
        </div>
      </div>
    </div>
  );
};