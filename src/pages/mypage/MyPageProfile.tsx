import { MyPage_Text } from "../../components/common/contentcard/MyPage_Text";
import { Profile } from "../../components/MyPage/Profile";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { MyPage_Profile_Medal } from "../../components/common/contentcard/MyPage_Profile_Medal";
import { getProfile } from "../../api/member/profile";
import { getOtherUserMedals } from "../../api/contest/member"; 
import type { ProfileResponseData } from "../../api/member/profile";
import { useState, useEffect } from "react";

export const MyPageProfile = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const numericMemberId = memberId ? Number(memberId) : null;
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<ProfileResponseData | null>(null);
  const [medalData, setMedalData] = useState({
    myMedalTotal: 0,
    goldCount: 0,
    silverCount: 0,
    bronzeCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (numericMemberId === null || Number.isNaN(numericMemberId)) {
      setError("잘못된 회원 ID입니다.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 프로필 조회
        const profile = await getProfile(numericMemberId);
        setProfileData(profile);

        // 다른 회원 메달 조회
        const medals = await getOtherUserMedals(numericMemberId);
        console.log("medals:", medals);
        setMedalData({
          myMedalTotal: medals.myMedalTotal,
          goldCount: medals.goldCount,
          silverCount: medals.silverCount,
          bronzeCount: medals.bronzeCount,
        });

      } catch (e: any) {
        setError(e.message || "데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [numericMemberId]);

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (error) return <div className="text-center py-10 text-red-500">에러: {error}</div>;

  return (
    <div className="flex flex-col overflow-hidden w-full">
      <PageHeader title="프로필" />
      <Profile
        name={profileData?.memberName || ""}
        gender={profileData?.gender === "MALE" ? "male" : "female"}
        level={profileData?.level || ""}
        birth={profileData?.birth || ""}
        profileImage={profileData?.profileImgUrl || ""}
      />

      <div className="my-8 flex flex-col gap-4 w-full items-center">
        <MyPage_Text
          textLabel="내 모임"
          numberValue={profileData?.myGroupCount ?? 0}
          onClick={() => navigate("/mypage/mygroup")}
        />

       <MyPage_Profile_Medal
          myMedalTotal={medalData.myMedalTotal}
          goldCount={medalData.goldCount}
          silverCount={medalData.silverCount}
          bronzeCount={medalData.bronzeCount}
          onClick={() =>
            navigate(`/mypage/profile/medal/${numericMemberId}`, {
              state: {
                myMedalTotal: medalData.myMedalTotal,
                goldCount: medalData.goldCount,
                silverCount: medalData.silverCount,
                bronzeCount: medalData.bronzeCount,
              },
            })
          }
        />
      </div>

      <Grad_GR400_L
        label="개인 채팅 보내기"
        onClick={() => navigate("/chat/group/:chatId")}
      />
    </div>
  );
};
