import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/common/system/header/PageHeader";
// import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { MyMedal } from "../../components/common/contentcard/MyMedal";
import { MyPage_Medal2 } from "../../components/common/contentcard/MyPage_Medal2";
import { MyMedal_None } from "../../components/MyPage/MyMedal_None";
import { getOtherUserMedals, getMemberContests } from "../../api/contest/member";
import type { MedalItem } from "../../api/contest/contestmy";

interface MedalUIItem {
  // memberId: number;
  contentId: number;
  title: string;
  date: string;
  medalImg: string | null; 
  isAwarded: boolean;
}

export const MyPageProfileMedal = () => {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();
  const numericMemberId = memberId ? Number(memberId) : null;

  const [loading, setLoading] = useState(true);
  const [medalData, setMedalData] = useState<{
    myMedalTotal: number;
    goldCount: number;
    silverCount: number;
    bronzeCount: number;
    medals: MedalItem[];
  } | null>(null);

  const [contestList, setContestList] = useState<MedalUIItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<"전체" | "미입상 기록">("전체");
  const [error, setError] = useState<string | null>(null);

  const onBackClick = () => navigate(-1);

  useEffect(() => {
    if (!numericMemberId) {
      setError("잘못된 회원 ID입니다.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 메달 개수 조회
        const response = await getOtherUserMedals(numericMemberId);
        const medals = response.medals ?? [];
        setMedalData({ ...response, medals });

        // 대회 리스트 조회
        const contests = await getMemberContests(numericMemberId);
       const contestUIList: MedalUIItem[] = contests.map((c) => ({
          contentId: c.contestId,        // contestId 사용
          title: c.contestName,           // contestName 사용
          date: c.date ? new Date(c.date).toLocaleDateString("ko-KR") : "날짜 없음",
          medalImg: c.medalImgUrl || null, // medalImgUrl 사용
          isAwarded: c.medalImgUrl !== "/images/medal/none.png", // 없음 체크
        }));

        setContestList(contestUIList);
      } catch (e: any) {
        setError(e.message || "데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [numericMemberId]);

  if (loading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  if (!medalData) return <div className="flex justify-center items-center h-screen">메달 정보를 불러올 수 없습니다.</div>;

  const shownList: MedalUIItem[] =
    selectedTab === "전체"
      ? contestList
      : contestList.filter((item) => !item.isAwarded);

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[23.4375rem] mx-auto bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="메달" onBackClick={onBackClick} />
      </div>

      <div className="flex flex-col gap-1 flex-grow overflow-y-auto">
        <MyPage_Medal2
          myMedalTotal={medalData.myMedalTotal}
          goldCount={medalData.goldCount}
          silverCount={medalData.silverCount}
          bronzeCount={medalData.bronzeCount}
        />

        {/* 탭 */}
        <div className="w-full mb-4">
          <div className="flex gap-4 px-4 relative h-10">
            <div className="absolute bottom-0 left-0 right-0 h-[0.125rem] bg-[#F4F5F6]" />
            {["전체", "미입상 기록"].map((tab) => (
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

        {/* 대회 리스트 */}
        {shownList.length > 0 ? (
          shownList.map((item) => (
            <React.Fragment key={item.contentId}>
              <MyMedal   
                contentId={item.contentId} 
                memberId={numericMemberId ?? undefined}
                title={item.title} 
                date={item.date} 
                medalImageSrc={item.medalImg || ""} />
              <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
            </React.Fragment>
          ))
        ) : (
          <div className="flex flex-col h-full items-center justify-center">
            <MyMedal_None />
          </div>
        )}

        {/* 대회 기록 추가 버튼 */}
        {/* {shownList.length > 0 && (
          <div className="mt-8">
            <Grad_GR400_L label="대회 기록 추가하기" onClick={() => navigate("/mypage/mymedal/add")} />
          </div>
        )} */}
      </div>
    </div>
  );
};
