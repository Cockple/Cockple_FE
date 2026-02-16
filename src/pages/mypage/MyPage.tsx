// 내 마이페이지
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MainHeader } from "../../components/common/system/header/MainHeader";
import { MyPage_Text } from "../../components/common/contentcard/MyPage_Text";
import { Profile } from "../../components/MyPage/Profile";
import { MyPage as MyPageContentcard } from "../../components/common/contentcard/MyPage";

import { useMyPageStore } from "../../store/useMyPageStore";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import White_L_Thin from "../../components/common/Btn_Static/Text/White_L_Thin";
import White_L from "../../components/common/Btn_Static/Text/White_L";
import { ModalLeave } from "@/components/MyPage/Modal_Leave";

interface MyPageProps {
  disabled?: boolean;
}

export const MyPage = ({ disabled = false }: MyPageProps) => {
  const navigate = useNavigate();
  const { profile, fetchMyProfile, isLoading } = useMyPageStore();

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const [modal, setModal] = useState(false);

  //로딩 화면
  if (isLoading || !profile) {
    return (
      <div className="flex flex-col h-screen w-full bg-white">
        <div className="w-full">
          <MainHeader />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center pb-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const totalMedals = profile.myMedalTotal || 0;
  const gold = profile.goldCount || 0;
  const silver = profile.silverCount || 0;
  const bronze = profile.bronzeCount || 0;

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
                  goldCount: gold,
                  silverCount: silver,
                  bronzeCount: bronze,
                  myMedalTotal: totalMedals,
                  disabled,
                });
                navigate("/myPage/mymedal", {
                  state: {
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
              onClick={() =>
                window.open(
                  "https://www.notion.so/25634aa25d2880fd8572f0454c209030",
                )
              }
            />
            <White_L
              initialStatus="clicked"
              label="이용약관"
              onClick={() =>
                window.open(
                  "https://www.notion.so/25634aa25d28807fa768df5deb1afc6f",
                )
              }
            />
            <White_L
              initialStatus="clicked"
              label=" 설정"
              onClick={() => alert("설정 클릭")}
            />
            <White_L
              initialStatus="clicked"
              label="회원탈퇴"
              onClick={() => setModal(true)}
            />
            {/* <CautionModal /> */}
            {modal && (
              <div className="-ml-[11px]">
                <ModalLeave onClose={() => setModal(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
