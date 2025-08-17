import { MainHeader } from "../../components/common/system/header/MainHeader";
import { MyPage_Text } from "../../components/common/contentcard/MyPage_Text";
import { Profile } from "../../components/MyPage/Profile";
import { MyPage as MyPageContentcard } from "../../components/common/contentcard/MyPage";
import White_L_Thin from "../../components/common/Btn_Static/Text/White_L_Thin";
import White_L from "../../components/common/Btn_Static/Text/White_L";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyProfile } from "../../api/member/my";

interface MyPageProps {
  name?: string;
  gender?: "female" | "male";
  level?: string;
  birth?: string;
  profileImage?: File;

  myGroupCount?: number;
  myExerciseCount?: number;

  myMedalTotal?: number;
  goldCount?: number;
  silverCount?: number;
  bronzeCount?: number;
  disabled?: boolean;
}

export const MyPage = ({ disabled = false }: MyPageProps) => {
  const [profile, setProfile] = useState<MyPageProps>({
    name: "",
    gender: "female",
    level: "",
    birth: "",
    profileImage: undefined,
    goldCount: 0,
    silverCount: 0,
    bronzeCount: 0,
    myGroupCount: 0,
    myExerciseCount: 0,
    myMedalTotal: 0,
    disabled,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getMyProfile();

        setProfile({
          name: data.memberName,
          gender: data.gender === "MALE" ? "male" : "female",
          level: convertLevel(data.level),
          birth: data.birth,
          goldCount: data.myGoldMedalCnt,
          silverCount: data.mySilverMedalCnt,
          bronzeCount: data.myBronzeMedalCnt,
          myGroupCount: data.myPartyCnt,
          myExerciseCount: data.myExerciseCnt,
          myMedalTotal:
            data.myGoldMedalCnt + data.mySilverMedalCnt + data.myBronzeMedalCnt,
          profileImage: undefined,
          disabled,
        });
      } catch (error) {
        console.error("프로필 불러오기 실패", error);
      }
    }

    fetchProfile();
  }, [disabled]);

  // 레벨 변환 (서버 레벨: EXPERT → 중급 등)
  function convertLevel(level: string): string {
    switch (level) {
      case "BEGINNER":
        return "초급";
      case "INTERMEDIATE":
        return "중급";
      case "EXPERT":
        return "고급";
      default:
        return "정보 없음";
    }
  }

  const totalMedals = profile.myMedalTotal || 0;
  const gold = profile.goldCount || 0;
  const silver = profile.silverCount || 0;
  const bronze = profile.bronzeCount || 0;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col overflow-hidden w-full">
      <div className="flex flex-col gap-[1.25rem] w-full">
        <div className="w-full">
          <MainHeader />
        </div>
        <div className="w-full flex flex-col items-center overflow-y-auto overflow-x-hidden px-4">
          {profile.name && profile.gender && profile.level && (
            <Profile
              name={profile.name}
              gender={profile.gender}
              level={profile.level}
              birth={profile.birth}
              profileImage={profile.profileImage}
            />
          )}
          <div className="mt-4">
            <White_L_Thin
              label="정보 수정하기"
              initialStatus="clicked"
              onClick={() => navigate("/myPage/edit")}
            />
          </div>

          <div className="my-8 flex flex-col gap-4">
            <MyPage_Text
              textLabel="내 모임"
              numberValue={profile.myGroupCount}
              onClick={() => navigate("/mypage/mygroup")}
            />
            <MyPage_Text
              textLabel="내 운동"
              numberValue={profile.myExerciseCount}
              onClick={() => navigate("/myPage/myexercise")}
            />
            <MyPageContentcard
              myMedalTotal={totalMedals}
              goldCount={gold}
              silverCount={silver}
              bronzeCount={bronze}
              disabled={disabled}
              onClick={() => {
                console.log("navigate with state:", {
                  // medals: dummyMedals,
                  goldCount: gold,
                  silverCount: silver,
                  bronzeCount: bronze,
                  myMedalTotal: totalMedals,
                  disabled,
                });
                navigate("/myPage/mymedal", {
                  state: {
                    // medals: dummyMedals,
                    goldCount: gold,
                    silverCount: silver,
                    bronzeCount: bronze,
                    myMedalTotal: totalMedals,
                    disabled,
                  },
                });
              }}
            />
          </div>

          <div className="gap-[0.25rem]">
            <White_L
              initialStatus="clicked"
              label="공지사항"
              onClick={() => alert("공지사항 클릭")}
            />
            <White_L
              initialStatus="clicked"
              label="이용약관"
              onClick={() => alert("이용약관 클릭")}
            />
            <White_L
              initialStatus="clicked"
              label=" 설정"
              onClick={() => alert("설정 클릭")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
