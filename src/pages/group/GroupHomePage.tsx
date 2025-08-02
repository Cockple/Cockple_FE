import { useState } from "react";
import { GroupInfoList } from "../../components/group/home/GroupInfoList";
import FemaleIcon from "@/assets/icons/female.svg?react";
import MaleIcon from "@/assets/icons/male.svg?react";
import White_XS from "../../components/common/Btn_Static/Text/White_XS";
import UpIcon from "@/assets/icons/arrow_up.svg?url";
import DownIcon from "@/assets/icons/arrow_down.svg?url";
import HashIcon from "@/assets/icons/hash.svg?url";
import CautionIcon from "@/assets/icons/caution.svg?url";
import WeeklyCalendar from "../../components/common/Date_Time/WeeklyCalendar";
import { ContentCardL } from "../../components/common/contentcard/ContentCardL";

const dummyClub = {
  id: "mint-clover",
  name: "민트클로버",
  region: "경기도 / 성남시",
  schedule: "월 화 수 목 금 토",
  time: "상시",
  level: ["전국 초심 ~ 준자강", "전국 준자강 이상"],
  ageRange: "1990 ~ 2005년생",
  fee: "10,000원",
  joinFee: "10,000원",
  courts: ["삼화다목적", "삼화다목적", "삼화다목적"],
  tags: ["브랜드 스폰", "가입비 무료", "친목", "운동"],
  image: "/images/sample_club.png", // ← 실제 이미지 경로로 바꿔줘!
  description:
    "민트클로버는 성남시 2030을 대상으로 하는 운동입니다! 함께 하고싶으신 분들은 연락주세요~",
};

export const GroupHomePage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const group = dummyClub;
  const items = [
    { label: "지역", value: "경기도 / 성남시" },
    { label: "날짜", value: "월 화 수 목 금 토" },
    { label: "시간", value: "상시" },
    {
      label: "급수",
      value: (
        <div className="flex flex-col">
          <div className="flex gap-1">
            <span>
              <FemaleIcon />
            </span>
            <span>전국 초심 ~ 준자강</span>
          </div>
          <div className="flex gap-1">
            <span>
              <MaleIcon />
            </span>
            <span>전국 준자강 이상</span>
          </div>
        </div>
      ),
    },
    { label: "나이", value: "1990 ~ 2005년생" },
    { label: "회비", value: "10,000원" },
    { label: "가입비", value: "10,000원" },
    {
      label: "지정콕",
      value: "삼화더블랙, 삼화더블랙, 삼화더블랙",
    },
  ];

  const tagData = [
    "브랜드 스폰",
    "가입비 무료",
    "친목",
    "운영진이 게임을 짜드려요",
  ];

  const describe =
    "민턴클로버는 성남시 2030을 대상으로 하는 운동입니다! 함께 하고 싶으신 분들은 연락주세요~";

  const visibleItems = isExpanded ? items : items.slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex p-3 gap-3">
          <div className="w-30 h-30 border-hard bg-gy-500 shrink-0"></div>
          <div className="flex flex-col flex-1">
            <div className="body-rg-500 text-left mb-2">{group.name}</div>
            <div className="flex flex-col gap-2">
              {visibleItems.map(item => (
                <GroupInfoList items={item} />
              ))}
            </div>

            {/* 버튼은 항상 맨 아래 */}
            <div className="relative z-10">
              {!isExpanded && (
                <div
                  className="absolute bottom-8 left-0 right-0 h-16 
                    bg-[linear-gradient(180deg,rgba(252,252,255,0)_0%,rgba(252,252,255,0.8)_50%,#FCFCFF_90%)] 
                    pointer-events-none z-0"
                />
              )}
              <White_XS
                label={isExpanded ? "간략하게" : "더보기"}
                icon={isExpanded ? UpIcon : DownIcon}
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-scroll whitespace-nowrap scrollbar-hide">
          {tagData.map((data, idx) => (
            <div
              className="inline-flex items-center gap-1 rounded-full py-2 pl-2.5 pr-3 border-1 border-gy-200 shadow-ds50 body-rg-500"
              key={idx}
            >
              <img src={HashIcon} className="w-4 h-4 shrink-0" />
              <span>{data}</span>
            </div>
          ))}
        </div>

        <div className="w-full p-4 flex items-center gap-2 border-1 border-gr-500 border-soft">
          <img src={CautionIcon} className="size-5" />
          <div className="text-left body-rg-500">{describe}</div>
        </div>
      </div>

      <WeeklyCalendar shadow={false} />

      <div className="flex flex-col">
        <div className="border-b-1 border-gy-200 mb-3">
          <ContentCardL
            id={1}
            isUserJoined={true}
            isGuestAllowedByOwner={true}
            isCompleted={false}
            title="하이콕콕"
            date="2000-05-01"
            location="산성 실내 배드민턴장"
            time="08:00 am ~ 10:00 am"
            femaleLevel="전국 초심 ~ 준자강"
            maleLevel="전국 준자강 이상"
            currentCount={0}
            totalCount={0}
            like={false}
            onToggleFavorite={id => console.log(`즐겨찾기 토글: ${id}`)}
          />
        </div>

        <div className="border-b-1 border-gy-200 mb-3">
          <ContentCardL
            id={1}
            isUserJoined={true}
            isGuestAllowedByOwner={true}
            isCompleted={false}
            title="하이콕콕"
            date="2000-05-01"
            location="산성 실내 배드민턴장"
            time="08:00 am ~ 10:00 am"
            femaleLevel="전국 초심 ~ 준자강"
            maleLevel="전국 준자강 이상"
            currentCount={0}
            totalCount={0}
            like={false}
            onToggleFavorite={id => console.log(`즐겨찾기 토글: ${id}`)}
          />
        </div>
      </div>
    </div>
  );
};
