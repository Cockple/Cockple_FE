import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { MyMedal } from "../../components/common/contentcard/MyMedal";
import { MyPage_Medal2 } from "../../components/common/contentcard/MyPage_Medal2";
import { MyMedal_None } from "../../components/MyPage/MyMedal_None";
import { getMyMedals, getMyContestList } from "../../lib/contents/contents"; 
import type { MedalItem } from  "../../lib/contents/contents"; 

interface MedalUIItem {
  title: string;
  date: string;
  medalImageSrc: string | null; 
}

const MyPageMyMedalPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [medalData, setMedalData] = useState<{
    myMedalTotal: number;
    goldCount: number;
    silverCount: number;
    bronzeCount: number;
    medals: MedalItem[];
  } | null>(null);

  const [selectedTab, setSelectedTab] = useState<"전체" | "미입상 기록">("전체");
//내 메달 조회
  useEffect(() => {
    const fetchMedals = async () => {
      try {
        const data = await getMyMedals();
        setMedalData(data);
      } catch (error) {
        console.error("메달 정보 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedals();
  }, []);

//내 대회 리스트 조회
  const [contestList, setContestList] = useState<MedalUIItem[]>([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const records = await getMyContestList();
        const transformed: MedalUIItem[] = records.map((item) => ({
          title: `대회 #${item.partyId}`,
          date: new Date(item.createdAt).toLocaleDateString("ko-KR"),
          medalImageSrc: null,
        }));
        setContestList(transformed);
      } catch (err) {
        console.error("대회 기록 조회 실패", err);
      }
    };
    fetchContests();
  }, []);

  const onBackClick = () => {
    navigate("/myPage");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!medalData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>메달 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const filteredList = medalData.medals.filter(item => {
    if (selectedTab === "전체") return true;
    if (selectedTab === "미입상 기록") return !item.isAwarded;
    return true;
  });

  const shownList = filteredList;


  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[23.4375rem] mx-auto bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="내 메달" onBackClick={onBackClick} />
      </div>

      <div className="flex flex-col gap-1 flex-grow overflow-y-auto">
        {filteredList.length > 0 && (
          <>
            <MyPage_Medal2
              myMedalTotal={medalData.myMedalTotal}
              goldCount={medalData.goldCount}
              silverCount={medalData.silverCount}
              bronzeCount={medalData.bronzeCount}
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
        {shownList.length > 0 ? (
          shownList.map((item, idx) => (
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
