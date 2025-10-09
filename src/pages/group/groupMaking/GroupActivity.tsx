import { PageHeader } from "../../../components/common/system/header/PageHeader";

import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../../../components/common/ProgressBar";
import Btn_Static from "../../../components/common/Btn_Static/Btn_Static";
import { useGroupMakingFilterStore } from "../../../store/useGroupMakingFilter";
import { DropBox } from "../../../components/common/DropBox";
import { MultiSelectButtonGroup } from "../../../components/common/MultiSelectButtonGroup";
import Circle_Red from "@/assets/icons/cicle_s_red.svg?url";
import {
  GYEONGGI_DISTRICTS,
  SEOUL_DISTRICTS,
  WEEKLY_KEY,
} from "../../../constants/options";

const cities = [
  { value: "서울특별시", enabled: true },
  { value: "경기도", enabled: true },
  { value: "부산광역시", enabled: false },
  { value: "대구광역시", enabled: false },
  { value: "인천광역시", enabled: false },
  { value: "광주광역시", enabled: false },
  { value: "대전광역시", enabled: false },
  { value: "울산광역시", enabled: false },
  { value: "세종특별자치시", enabled: false },
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

export const GroupActivity = () => {
  const navigate = useNavigate();

  //store
  const { setFilter, weekly, time, region } = useGroupMakingFilterStore();
  //정보

  const selectedCity = region[0] || "";
  const selectedDistrict = region[1] || "전체";
  console.log(region);
  //초기화

  const isFormValid =
    selectedCity.length > 0 &&
    time.length > 0 &&
    weekly.length > 0 &&
    region.length > 0;

  const handleNext = () => {
    navigate("/group/making/filter");
  };

  const handleRegion = () => {
    if (region[0] === "서울특별시") {
      return SEOUL_DISTRICTS;
    } else {
      return GYEONGGI_DISTRICTS;
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-dvh -mb-8 pt-14">
        <PageHeader title="모임 만들기" />
        <ProgressBar width={!isFormValid ? "28" : "48"} />

        <section className="text-left flex flex-col  gap-8 w-full mb-6 flex-1">
          <p className="header-h4 pt-8">모임 활동 정보를 입력해주세요.</p>
          {/* 첫번째 */}
          <div>
            <div className="flex px-1 gap-[2px] items-center mb-2">
              <p className="header-h5">활동 지역</p>
              <img src={Circle_Red} alt="icon-cicle" />
            </div>
            <div className="flex justify-between">
              <DropBox
                options={cities}
                value={selectedCity}
                placeholder="시/도 선택"
                onChange={city => {
                  setFilter("region", [city, "전체"]);
                }}
              />

              <DropBox
                options={handleRegion().map(d => ({
                  value: d,
                }))}
                value={selectedDistrict}
                onChange={gu => {
                  setFilter("region", [selectedCity, gu]);
                }}
                disabled={!selectedCity}
                placeholder="전체"
              />
            </div>
          </div>

          {/* 두번째 */}
          <div className="text-left flex flex-col gap-2">
            <div className="flex px-1 gap-[2px] items-center">
              <p className="header-h5">활동 요일</p>
              <img src={Circle_Red} alt="icon-cicle" />
            </div>
            <MultiSelectButtonGroup
              options={WEEKLY_KEY}
              selected={weekly}
              onChange={newVal => setFilter("weekly", newVal)}
            />
          </div>
          {/* 세번째 */}
          <div className="text-left flex flex-col gap-2 pb-5">
            <div className="flex px-1 gap-[2px] items-center">
              <p className="header-h5">활동 시간</p>
              <img src={Circle_Red} alt="icon-cicle" />
            </div>
            <MultiSelectButtonGroup
              options={["상시", "오전", "오후"]}
              onChange={newVal => setFilter("time", newVal)}
              selected={time}
              singleSelect={true}
            />
          </div>
        </section>

        {/* 버튼 */}
        <div
          className={`flex items-center justify-center mb-6  shrink-0 `}
          onClick={handleNext}
        >
          <Btn_Static
            label="다음"
            kind="GR400"
            size="L"
            initialStatus={!isFormValid ? "disabled" : "default"}
          />
        </div>
      </div>
    </>
  );
};
