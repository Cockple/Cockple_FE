import { MyPage_Text } from "../../components/common/contentcard/MyPage_Text";
import { Profile } from "../../components/MyPage/Profile";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useNavigate } from "react-router-dom";
import { MyPage_Profile_Medal } from "../../components/common/contentcard/MyPage_Profile_Medal";
import { getProfile } from "../../api/member/profile";
import { getOtherUserMedals } from "../../api/contest/member"; //이거 확인해라
import type { ProfileResponseData } from "../../api/member/profile";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const MyPageProfile = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const numericMemberId = memberId ? Number(memberId) : null;
  // 숫자가 아닌 경우 에러 처리
  if (numericMemberId === null || Number.isNaN(numericMemberId)) {
  }

  const [profileData, setProfileData] = useState<ProfileResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalMedals = profileData?.myGoldMedalCnt! + profileData?.mySilverMedalCnt! + profileData?.myBronzeMedalCnt! || 0;
  const gold = profileData?.myGoldMedalCnt || 0;
  const silver = profileData?.mySilverMedalCnt || 0;
  const bronze = profileData?.myBronzeMedalCnt || 0;
  const navigate = useNavigate();

  useEffect(() => {
    if (numericMemberId === null || Number.isNaN(numericMemberId)) {
      setError("잘못된 회원 ID입니다.");
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getProfile(numericMemberId);
        setProfileData(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [numericMemberId]);

  return (
    <div className="flex flex-col overflow-hidden w-full">
      <div className="flex flex-col gap-[1.25rem] w-full">
        <PageHeader title="프로필" />
        <Profile
          name={profileData?.memberName || ""}
          gender={profileData?.gender === "MALE" ? "male" : "female"}
          level={profileData?.level || ""}
          birth={profileData?.birth || ""}
          profileImage={profileData?.profileImgUrl || ""}
        />
      </div>

      <div className="my-8 flex flex-col gap-4 w-full items-center">
        <MyPage_Text
          textLabel="내 모임"
          numberValue={profileData?.myGroupCount ?? 0}
          onClick={() => navigate("/mypage/mygroup")}
        />

        <MyPage_Profile_Medal
            myMedalTotal={totalMedals}
            goldCount={gold}
            silverCount={silver}
            bronzeCount={bronze}
              onClick={() => {
                console.log("navigate with state:", {
                  // medals: dummyMedals,
                  goldCount: gold,
                  silverCount: silver,
                  bronzeCount: bronze,
                  myMedalTotal: totalMedals,
                });
                navigate("/myPage/mymedal", {
                  state: {
                    // medals: dummyMedals,
                    goldCount: gold,
                    silverCount: silver,
                    bronzeCount: bronze,
                    myMedalTotal: totalMedals,
                  },
                });
              }}
        />
      </div>

      <Grad_GR400_L
        label="개인 채팅 보내기"
        onClick={() => navigate("/chat/group/:chatId")}
      />
    </div>
  );
};
