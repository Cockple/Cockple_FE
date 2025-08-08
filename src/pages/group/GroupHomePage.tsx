import { useEffect, useRef, useState } from "react";
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
import { FloatingButton } from "../../components/common/system/FloatingButton";
import PlusIcon from "@/assets/icons/add_white.svg?url";
import { useNavigate, useParams } from "react-router-dom";
import Grad_Mix_L from "../../components/common/Btn_Static/Text/Grad_Mix_L";
import { usePartyDetail } from "../../api/exercise/getpartyDetail";

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
  const [rightOffset, setRightOffset] = useState(0);
  const [plusModalOpen, setPlusModalOpen] = useState(false);
  const { groupId } = useParams();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const requestCount = 2;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        plusModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setPlusModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [plusModalOpen]);

  useEffect(() => {
    const updateOffset = () => {
      const screenWidth = window.innerWidth;
      const contentWidth = Math.min(screenWidth, 444);
      const offset = (screenWidth - contentWidth) / 2 + 16;
      setRightOffset(offset);
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  // 요일 변환 함수
  const formatActivityDays = (days: string[]) => {
    const formatted = days.join(" "); // 배열을 문자열로 변환 (공백 구분)
    return formatted;
  };

  // 레벨 변환 함수
  const getLevelValue = (femaleLevel: string[], maleLevel: string[]) => {
    return (
      <div className="flex flex-col gap-1">
        {femaleLevel.length > 0 && (
          <div className="flex gap-1 items-center">
            <FemaleIcon />
            <span>{femaleLevel.join(" · ")}</span>
          </div>
        )}
        {maleLevel.length > 0 && (
          <div className="flex gap-1 items-center">
            <MaleIcon />
            <span>{maleLevel.join(" · ")}</span>
          </div>
        )}
      </div>
    );
  };

  const { data: partyDetail } = usePartyDetail(Number(groupId));
  console.log(partyDetail);

  const isOwner = partyDetail?.memberRole === "MANAGER";
  const isJoined = partyDetail?.memberStatus === "MEMBER";
  const items = [
    { label: "지역", value: `${partyDetail?.addr1} / ${partyDetail?.addr2}` },
    {
      label: "날짜",
      value: partyDetail ? formatActivityDays(partyDetail?.activityDays) : "",
    },
    { label: "시간", value: partyDetail?.activityTime },
    {
      label: "급수",
      value: partyDetail ? (
        getLevelValue(partyDetail?.femaleLevel, partyDetail?.maleLevel)
      ) : (
        <></>
      ),
    },
    {
      label: "나이",
      value: `${partyDetail?.minBirthYear} ~ ${partyDetail?.maxBirthYear}`,
    },
    { label: "회비", value: partyDetail?.price },
    { label: "가입비", value: partyDetail?.joinPrice },
    {
      label: "지정콕",
      value: partyDetail?.designatedCock,
    },
  ];

  const visibleItems = isExpanded ? items : items.slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex p-3 gap-3">
          <div className="w-30 h-30 border-hard bg-gy-500 shrink-0"></div>
          <div className="flex flex-col flex-1">
            <div className="body-rg-500 text-left mb-2">
              {partyDetail?.partyName}
            </div>
            <div className="flex flex-col gap-2">
              {visibleItems.map(item => (
                <GroupInfoList items={item} key={item.label} />
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
          {partyDetail &&
            partyDetail.keywords.map((data, idx) => (
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
          <div className="text-left body-rg-500">{partyDetail?.content}</div>
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

      {isOwner && (
        <>
          {plusModalOpen && (
            <div
              ref={modalRef}
              className="fixed z-[60] w-39 bg-white border-soft shadow-ds400 flex flex-col p-1"
              style={{
                right: rightOffset,
                bottom: "6rem",
              }}
            >
              <div
                className="w-full px-2 pt-1.5 pb-2.5 border-b-1 border-gy-200 body-rg-400 flex items-center"
                onClick={() => navigate("/group/exercise/create")}
              >
                운동 만들기
              </div>
              <div
                className="w-full px-2 pt-1.5 pb-2.5 border-b-1 border-gy-200 body-rg-400 flex items-center"
                onClick={() => navigate("/group/admin/invite")}
              >
                신규 멤버 초대하기
              </div>
              <div
                className="w-full px-2 pt-1.5 pb-2.5 flex items-center justify-between body-rg-400"
                onClick={() => navigate("member-request")}
              >
                <span>멤버 신청 관리</span>
                {requestCount > 0 && (
                  <span className="ml-2 rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                    {requestCount > 99 ? "99+" : requestCount}
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="fixed z-50 bottom-8" style={{ right: rightOffset }}>
            <div className="relative">
              <FloatingButton
                size="L"
                color="green"
                icon={PlusIcon}
                onClick={() => setPlusModalOpen(true)}
              />
              {requestCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <span className="rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                    {requestCount > 99 ? "99+" : requestCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isJoined && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 px-4">
          <Grad_Mix_L type="chat_question" label="모임 가입하기" />
        </div>
      )}
    </div>
  );
};
