import { useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { MyMedal } from "../../components/common/contentcard/MyMedal";
import { MyPage_Medal2 } from "../../components/common/contentcard/MyPage_Medal2";
import { ProfileMyMedal_None } from "../../components/MyPage/ProfileMyMedal_None";

interface MedalItem {
  id: string;
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

export const MyPageProfileMedal = ({
  // name = "",
  // gender = "",
  // group = "",
  // birth = "",
  // imageSrc = "",

  myMedalTotal = 0,
  goldCount = 0,
  silverCount = 0,
  bronzeCount = 0,
  disabled = false,

  medals = [],
}: MyMedalProps) => {
  const [selectedTab, setSelectedTab] = useState<"전체" | "미입상 기록">(
    "전체",
  );

  const filteredList = medals.filter(item => {
    if (selectedTab === "전체") return true;
    if (selectedTab === "미입상 기록") return !item.isAwarded;
    return true;
  });

  const isEmpty = medals.length === 0;

  return (
    <>
      <div className="mb-5">
        <PageHeader title="메달" />
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center">
          <ProfileMyMedal_None />
        </div>
      ) : (
        <>
          <MyPage_Medal2
            myMedalTotal={myMedalTotal}
            goldCount={goldCount}
            silverCount={silverCount}
            bronzeCount={bronzeCount}
            disabled={disabled}
          />

          <div className="mt-8" />

          <div className="w-[375px] mb-5">
            <div className="flex gap-4 px-4 relative h-10">
              <div className="absolute bottom-0 left-0 right-0 h-[0.125rem] bg-[#F4F5F6]" />
              {["전체", "미입상 기록"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab as "전체" | "미입상 기록")}
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

          <div className="flex flex-col gap-4">
            {filteredList.map((item, idx) => (
              <MyMedal
                key={idx}
                title={item.title}
                date={item.date}
                medalImageSrc={item.medalImageSrc}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};
