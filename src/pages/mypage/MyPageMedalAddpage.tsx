import { useRef, useState } from "react";
import { useContestRecord } from "../../hooks/useContestRecord";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { ImageBox } from "../../components/common/ImageBox";
import { Modal_Add_Caution } from "../../components/MyPage/Modal_Add_Caution";
import { CheckBox_Long_noButton } from "../../components/MyPage/CheckBox_Long_noButton";
import { MyMedalCheckBox } from "../../components/MyPage/MyMedalCheckBox";
import DateAndTimePicker from "../../components/common/Date_Time/DateAndPicker";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";

import Camera from "../../assets/icons/camera.svg?react";
import CicleSRED from "../../assets/icons/cicle_s_red.svg?react";
import Dismiss_Gy800 from "../../assets/icons/dismiss_gy800.svg?react";
import Circle_Red from "@/assets/icons/cicle_s_red.svg?url";
import ArrowDown from "@/assets/icons/arrow_down.svg?url";
import Medal_1 from "../../assets/icons/medal_1.svg?react";
import Medal_2 from "../../assets/icons/medal_2.svg?react";
import Medal_3 from "../../assets/icons/medal_3.svg?react";
import { useNavigate } from "react-router-dom";

import { FORM_OPTIONS, LEVEL_OPTIONS } from "../../utils/MyPageConstants";

export const MyPageMedalAddPage = () => {
  const { state, actions } = useContestRecord();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<{ getDueString: () => string }>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);

  const medalImages = [Medal_1, Medal_2, Medal_3];

  const handlePhotoClick = () => { 
    if (state.photos.length < 3) fileInputRef.current?.click(); 
  };

  const handleCloseDateOverlay = () => {
    if (pickerRef.current) {
      actions.setSelectedDate(pickerRef.current.getDueString());
      actions.setValue("birthday", pickerRef.current.getDueString(), { shouldValidate: true });
    }
    setDatePickerOpen(false);
  };

  return (
    <div className="max-w-[23.4375rem] mx-auto bg-white h-screen flex flex-col pt-2">
      {/* 헤더 */}
      <div className="flex-shrink-0 sticky top-0 z-20 bg-white ">
        <PageHeader 
          title={state.isEditMode ? "대회 기록 수정하기" : "대회 기록 추가하기"} 
          onBackClick={() => navigate("/mypage/mymedal")} 
        />
        {state.isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <Modal_Add_Caution 
              onConfirm={() => { actions.setIsModalOpen(false); actions.onBackClick(); }} 
              onCancel={() => actions.setIsModalOpen(false)} 
            />
          </div>
        )}
      </div>

      <div className="flex-grow min-h-0 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-8">
          
          {/* 1. 이미지 업로드 섹션 */}
          <>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={actions.handleFileChange} className="hidden" />
            <div ref={containerRef} className="flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={handlePhotoClick} className="w-24 h-24 flex-shrink-0 border rounded-xl border-[#E4E7EA] flex items-center justify-center body-rg-500 bg-white" type="button">
                <div className="flex flex-col items-center justify-center text-center"> <Camera /> <label className="mt-1">{`${state.photos.length} / 3`}</label> </div>
              </button>
              {state.photos.map((src, i) => (
                <div key={i} className="relative w-24 h-24 flex-shrink-0 border rounded-xl border-[#E4E7EA] overflow-hidden">
                  <img src={src} alt={`uploaded-${i}`} className="w-full h-full object-cover rounded-xl" />
                  <Dismiss_Gy800 onClick={() => actions.handleRemovePhoto(i)} className="absolute top-1 right-1 w-6 h-6 p-1 cursor-pointer" />
                </div>
              ))}
            </div>
          </>

          {/* 2. 대회명 */}
          <div>
            <label className="flex items-center text-left header-h5 mb-1"> 대회명 <CicleSRED /> </label>
            <div className="relative"> 
              <input 
                type="text" 
                className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none focus:border-active" 
                value={state.tournamentName} 
                onChange={(e) => actions.setTournamentName(e.target.value)} 
              /> 
            </div>
          </div>

          {/* 3. 수상 */}
          <div>
            <label className="flex items-center text-left header-h5 mb-1"> 수상 </label>
            <div className="flex gap-2 w-full items-center justify-center">
              {medalImages.map((imgSrc, i) => ( 
                <ImageBox 
                  key={i} 
                  imageSrc={imgSrc} 
                  isSelected={state.selectedIndex === i} 
                  onClick={() => actions.setSelectedIndex(state.selectedIndex === i ? null : i)} 
                /> 
              ))}
            </div>
            <p className="body-sm-500 text-left text-[#767B89] mt-1"> 입상하지 못했다면 선택하지 않아도 됩니다. </p>
          </div>

          {/* 4. 날짜 */}
          <div>
            <div className="text-left flex flex-col gap-2">
              <div className="flex px-1 gap-[2px] items-center"> <p className="header-h5">날짜</p> <img src={Circle_Red} alt="icon-cicle" /> </div>
              <input 
                type="text" 
                className="w-full rounded-xl border-gy-200 border py-[0.625rem] px-3 focus:outline-none focus:border-active " 
                onClick={() => setDatePickerOpen(true)} 
                value={state.selectedDate} 
                readOnly 
              />
              {datePickerOpen && (
                <div id="date-picker-overlay" className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={e => (e.target as HTMLElement).id === "date-picker-overlay" && handleCloseDateOverlay()}>
                  <div onClick={e => e.stopPropagation()}> <DateAndTimePicker ref={pickerRef} /> </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. 참여 형태 */}
          <div>
            <label className="flex items-center text-left header-h5 mb-1"> 참여 형태 <CicleSRED /> </label>
            <div className="flex gap-4">
              {FORM_OPTIONS.map(item => (
                <button 
                  key={item} 
                  type="button" 
                  onClick={() => actions.setSelectedForm(item)} 
                  className={`flex-1 border rounded-lg py-2 text-center body-rg-500 transition-colors duration-150 shadow-ds200-gr ` + (state.selectedForm === item ? "border-[#0B9A4E]" : "border-[#F4F5F6]")}
                > 
                  {item} 
                </button>
              ))}
            </div>
          </div>

          {/* 6. 급수 */}
          <div>
            <label className="flex items-center text-left header-h5 mb-1"> 급수 <CicleSRED /> </label>
            <div className="flex items-center gap-4">
              <div className="relative w-40">
                <button className="border px-3 py-[0.625rem] flex justify-between gap-2 rounded-xl border-gy-200 w-40 h-11 cursor-pointer" onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}>
                  <span className="text-black"> {state.selectedLevel} </span> 
                  <img src={ArrowDown} alt="Dropdown arrow" className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4" />
                </button>
                {levelDropdownOpen && (
                  <div className="absolute mt-1 z-10 w-40">
                    <ul className="border rounded-xl border-gy-200 bg-white shadow text-left" style={{ maxHeight: "8.5rem", overflowY: "auto" }}>
                      {LEVEL_OPTIONS.map((item, idx) => (
                        <li 
                          key={idx} 
                          onClick={() => { actions.setSelectedLevel(item); setLevelDropdownOpen(false); }} 
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

          {/* 7. 대회 기록 */}
          <div>
            <div className="flex justify-between items-start">
              <CheckBox_Long_noButton 
                title="대회 기록" 
                maxLength={100} 
                Label="비공개" 
                value={state.recordText} 
                checked={state.isPrivate} 
                onChange={(checked, value) => { actions.setIsPrivate(checked); actions.setRecordText(value); }} 
              />
            </div>
          </div>

          {/* 8. 영상 링크 */}
          <MyMedalCheckBox
            title="영상 링크"
            value={state.videoLinks.length ? state.videoLinks : [""]}
            onChange={actions.setVideoLinks}
          />
          
          {/* 저장 버튼 */}
          <Grad_GR400_L 
            label="저장하기" 
            initialStatus={state.isSaveEnabled ? "default" : "disabled"} 
            onClick={actions.handleSaveClick} 
          />
        </div>
      </div>
    </div>
  );
};