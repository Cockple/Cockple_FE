import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { MyMedal } from "../../components/common/contentcard/MyMedal";
import { MyPage_Medal2 } from "../../components/common/contentcard/MyPage_Medal2";
import { MyMedal_None } from "../../components/MyPage/MyMedal_None";

interface MedalItem {
  title: string;
  date: string;
  medalImageSrc: string;
  isAwarded: boolean;
}

interface MyMedalProps {
  name?: string;
  gender?: string;
  group?: string;
  birth?: string;
  imageSrc?: string;
  myMedalTotal?: number;
  goldCount?: number;
  silverCount?: number;
  bronzeCount?: number;
  disabled?: boolean;
  medals?: MedalItem[];
}

const dummyMedals: MedalItem[] = [
  {
    title: "2024년 동네 마라톤 대회",
    date: "2024.05.10",
    medalImageSrc: "/images/medal_gold.png",
    isAwarded: true,
  },
  {
    title: "주말 배드민턴 친선전",
    date: "2024.06.15",
    medalImageSrc: "/images/medal_silver.png",
    isAwarded: true,
  },
  {
    title: "새벽 조깅 챌린지",
    date: "2024.07.08",
    medalImageSrc: "/images/medal_none.png",
    isAwarded: false,
  },
  {
    title: "수영장 자유형 기록 측정",
    date: "2024.07.12",
    medalImageSrc: "/images/medal_none.png",
    isAwarded: false,
  },
];

const MyPageMyMedalPage = ({
  name = "",
  gender = "",
  group = "",
  birth = "",
  imageSrc = "",
  myMedalTotal = 0,
  goldCount = 0,
  silverCount = 0,
  bronzeCount = 0,
  disabled = false,
  medals = dummyMedals,
  // medals = [],
}: MyMedalProps) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"전체" | "미입상 기록">(
    "전체",
  );

  const filteredList = medals.filter(item => {
    if (selectedTab === "전체") return true;
    if (selectedTab === "미입상 기록") return !item.isAwarded;
    return true;
  });

  const onBackClick = () => {
    navigate("/myPage");
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[23.4375rem] mx-auto bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="내 메달" onBackClick={onBackClick} />
      </div>

      <div className="flex flex-col gap-1 flex-grow overflow-y-auto">
        {filteredList.length > 0 && (
          <>
            <MyPage_Medal2
              myMedalTotal={myMedalTotal}
              goldCount={goldCount}
              silverCount={silverCount}
              bronzeCount={bronzeCount}
              disabled={disabled}
            />

            <div className="w-full mb-4">
              <div className="flex gap-4 px-4 relative h-10">
                <div className="absolute bottom-0 left-0 right-0 h-[0.125rem] bg-[#F4F5F6]" />
                {["전체", "미입상 기록"].map(tab => (
                  <button
                    key={tab}
                    onClick={() =>
                      setSelectedTab(tab as "전체" | "미입상 기록")
                    }
                    className="flex flex-col items-center w-max relative"
                  >
                    <span className="header-h5 inline-block">{tab}</span>
                    {selectedTab === tab && (
                      <span
                        className="absolute bottom-0 h-[0.125rem] bg-[#1ABB65] rounded-full transition-all duration-150"
                        style={{ width: `${tab.length + 2}ch` }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {filteredList.length > 0 ? (
          filteredList.map((item, idx) => (
            <React.Fragment key={idx}>
              <MyMedal
                title={item.title}
                date={item.date}
                medalImageSrc={item.medalImageSrc}
              />
              <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
            </React.Fragment>
          ))
        ) : (
          <div className="flex flex-col h-full items-center justify-center">
            <MyMedal_None />
          </div>
        )}

        {filteredList.length > 0 && (
          <div className="mt-8">
            <Grad_GR400_L
              label="대화 기록 추가하기"
              onClick={() => navigate("/mypage/mymedal/add")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageMyMedalPage;
