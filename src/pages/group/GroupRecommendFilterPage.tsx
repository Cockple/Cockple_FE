import { useRef, useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useNavigate } from "react-router-dom";
import { Toggle } from "../../components/common/Toggle";
import { DropBox } from "../../components/common/DropBox";
import { MultiSelectButtonGroup } from "../../components/common/MultiSelectButtonGroup";
import { CautionModal } from "../../components/group/main/CautionModal";
import { useGroupRecommendFilterState } from "../../store/useGroupRecommendFilterStore";
import Grad_Mix_L from "../../components/common/Btn_Static/Text/Grad_Mix_L";
import { TextBoxM } from "../../components/group/main/TextBox_M";

const cities = [
  { value: "서울특별시", enabled: true },
  { value: "부산광역시", enabled: false },
  { value: "대구광역시", enabled: false },
  { value: "인천광역시", enabled: false },
  { value: "광주광역시", enabled: false },
  { value: "대전광역시", enabled: false },
  { value: "울산광역시", enabled: false },
  { value: "세종특별자치시", enabled: false },
  { value: "경기도", enabled: false },
  { value: "강원특별자치도", enabled: false },
  { value: "충청북도", enabled: false },
  { value: "충청남도", enabled: false },
  { value: "전라북도", enabled: false },
  { value: "전라남도", enabled: false },
  { value: "경상북도", enabled: false },
  { value: "경상남도", enabled: false },
  { value: "제주특별자치도", enabled: false },
  { value: "전국구", enabled: false },
];

const seoulDistricts = [
  "전체",
  "종로구",
  "중구",
  "용산구",
  "성동구",
  "광진구",
  "동대문구",
  "중랑구",
  "성북구",
  "강북구",
  "도봉구",
  "노원구",
  "은평구",
  "서대문구",
  "마포구",
  "양천구",
  "강서구",
  "구로구",
  "금천구",
  "영등포구",
  "동작구",
  "관악구",
  "서초구",
  "강남구",
  "송파구",
  "강동구",
];

const keywords = [
  { label: "브랜드 스폰", width: "w-41" },
  { label: "가입비 무료", width: "w-38" },
  { label: "친목", width: "w-19" },
  { label: "운영진이 게임을 짜드려요", width: "w-60" },
];

export const GroupRecommendFilterPage = () => {
  const {
    recommend,
    region,
    level,
    style,
    day,
    time,
    keyword,
    setFilter,
    resetFilter,
  } = useGroupRecommendFilterState();
  const initialFilterRef = useRef({
    region,
    level,
    style,
    day,
    time,
    keyword,
    recommend,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("전체");
  const navigate = useNavigate();

  const handleBack = () => {
    const currentFilter = { region, level, style, day, time, keyword };
    const initialFilter = initialFilterRef.current;

    const isDirty =
      JSON.stringify(currentFilter) !== JSON.stringify(initialFilter);

    if (isDirty) {
      setShowModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleKeywordClick = (kw: string) => {
    if (keyword.includes(kw)) {
      setFilter(
        "keyword",
        keyword.filter(k => k !== kw),
      );
    } else {
      setFilter("keyword", [...keyword, kw]);
    }
  };

  return (
    <div className="pb-24 flex flex-col justify-between">
      <div className="flex flex-col gap-5">
        <PageHeader title="필터" onBackClick={handleBack} />

        <div className="flex flex-col gap-vertical-section-s">
          <Toggle title="지역">
            <div className="flex justify-between">
              <DropBox
                options={cities}
                value={selectedCity}
                placeholder="시/도 선택"
                onChange={city => {
                  setSelectedCity(city);
                  setSelectedDistrict("전체");
                  setFilter("region", [city, "전체"]);
                }}
              />

              <DropBox
                options={seoulDistricts.map(d => ({
                  value: d,
                }))}
                value={selectedDistrict}
                onChange={gu => {
                  setSelectedDistrict(gu);
                  setFilter("region", [selectedCity, gu]);
                }}
                disabled={!selectedCity}
                placeholder="전체"
              />
            </div>
          </Toggle>
          <Toggle title="전국 급수">
            <MultiSelectButtonGroup
              options={[
                "전체",
                "왕초심",
                "초심",
                "D조",
                "C조",
                "B조",
                "A조",
                "준자강",
                "자강",
              ]}
              selected={level}
              onChange={newVal => setFilter("level", newVal)}
            />
          </Toggle>
          <Toggle title="운동 스타일">
            <MultiSelectButtonGroup
              options={["전체", "여복", "남복", "혼복"]}
              selected={style}
              singleSelect={true}
              onChange={newVal => setFilter("style", newVal)}
            />
          </Toggle>
          <Toggle title="운동 요일">
            <MultiSelectButtonGroup
              options={["전체", "월", "화", "수", "목", "금", "토", "일"]}
              selected={day}
              onChange={newVal => setFilter("day", newVal)}
            />
          </Toggle>
          <Toggle title="활동 시간">
            <MultiSelectButtonGroup
              options={["상시", "오전", "오후"]}
              selected={time}
              singleSelect={true}
              onChange={newVal => setFilter("time", newVal)}
            />
          </Toggle>
          <Toggle title="키워드">
            <div className="flex flex-wrap gap-4">
              {keywords.map(({ label, width }) => (
                <TextBoxM
                  key={label}
                  className={width}
                  selected={keyword.includes(label)}
                  onClick={() => handleKeywordClick(label)}
                >
                  <span>{label}</span>
                </TextBoxM>
              ))}
            </div>
          </Toggle>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2">
        <Grad_Mix_L
          type="refresh"
          label="필터 적용"
          onImageClick={resetFilter}
          onClick={() => navigate(-1)}
        />
      </div>

      {showModal && (
        <CautionModal
          onClose={() => setShowModal(false)}
          initialFilter={initialFilterRef.current}
        />
      )}
    </div>
  );
};
