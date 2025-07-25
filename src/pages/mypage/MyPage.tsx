import { MainHeader } from "../../components/common/system/header/MainHeader";
import { MyPage_Text } from "../../components/common/contentcard/MyPage_Text";
import { Profile } from "../../components/MyPage/Profile";
import { MyPage as MyPageContentcard } from "../../components/common/contentcard/MyPage";
import White_L_Thin from "../../components/common/Btn_Static/Text/White_L_Thin";
import White_L from "../../components/common/Btn_Static/Text/White_L";
import { useNavigate } from "react-router-dom";
import type { GroupMProps } from "./MyPageMyGroupPage";
import type { ContentCardLProps } from "../../components/common/contentcard/ContentCardL";


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

interface MedalItem {
  id: number;
  title: string;
  date: string;
  medalImageSrc: string;
  isAwarded: boolean;
  type: "gold" | "silver" | "bronze" | "none";
}

export const MyPage = ({
  // name,
  // gender,
  // level,
  // birth,
  // profileImage,
  name = "김태연",
  gender = "female",
  level = "중급",
  birth = "1990-04-18",
  profileImage,

  // myMedalTotal = 0,
  goldCount = 0,
  // silverCount = 0,
  // bronzeCount = 0,
  // myGroupCount = 0,
  // myExerciseCount = 0,
  disabled = false,
}: MyPageProps) => {
  // export const MyPage = ({
  //   name = "김태연",
  //   gender = "female",
  //   level = "중급",
  //   birth = "1990-04-18",
  //   profileImage = dummyProfileImage,

  //   myMedalTotal = 10,
  //   goldCount = 3,
  //   silverCount = 4,
  //   bronzeCount = 3,
  //   disabled = false,
  //   myGroupCount = 4,
  //   myExerciseCount = 5,
  // }: MyPageProps) => {

  //모임 더미 데이터
  const dummyGroups: GroupMProps[] = [
    {
      id: 1,
      groupName: "운동모임 A",
      groupImage: "",
      location: "서울",
      femaleLevel: "초급",
      maleLevel: "중급",
      nextActivitDate: "2025-07-19",
      upcomingCount: 5,
      isMine: true,
    },
    {
      id: 2,
      groupName: "요가모임 B",
      groupImage: "",
      location: "부산",
      femaleLevel: "중급",
      maleLevel: "중급",
      nextActivitDate: "2025-07-20",
      upcomingCount: 2,
      isMine: false,
    },
    {
      id: 3,
      groupName: "축구모임 C",
      groupImage: "",
      location: "대전",
      femaleLevel: "고급",
      maleLevel: "고급",
      nextActivitDate: "2025-07-21",
      upcomingCount: 7,
      isMine: true,
    },
  ];
  //운동 더미 데이터
  const dummyEx: ContentCardLProps[] = [
    {
      id: 1,
      isUserJoined: true,
      isGuestAllowedByOwner: true,
      isCompleted: true,
      title: "하위",
      date: "2025-07-20",
      location: "인천",
      time: "오전",
      femaleLevel: "전국",
      maleLevel: "초딩",
      currentCount: 1,
      totalCount: 3,
      like: true,
    },
    {
      id: 2,
      isUserJoined: false,
      isGuestAllowedByOwner: true,
      isCompleted: false,
      title: "하위",
      date: "2025-07-29",
      location: "인천",
      time: "오전",
      femaleLevel: "전국",
      maleLevel: "초딩",
      currentCount: 1,
      totalCount: 3,
      like: true,
    },
    {
      id: 3,
      isUserJoined: true,
      isGuestAllowedByOwner: true,
      isCompleted: true,
      title: "하위",
      date: "2025-07-25",
      location: "인천",
      time: "오전",
      femaleLevel: "전국",
      maleLevel: "초딩",
      currentCount: 1,
      totalCount: 3,
      like: true,
    },
  ];

  //메달 더미
  const dummyMedals: MedalItem[] = [
    {
      id: 1,
      title: "2024년 동네 마라톤 대회",
      date: "2024.05.10",
      medalImageSrc: "/images/medal_gold.png",
      isAwarded: true,
      type: "gold",
    },
    {
      id: 2,
      title: "주말 배드민턴 친선전",
      date: "2024.06.15",
      medalImageSrc: "/images/medal_silver.png",
      isAwarded: false,
      type: "silver",
    },
    {
      id: 3,
      title: "새벽 조깅 챌린지",
      date: "2024.07.08",
      medalImageSrc: "/images/medal_none.png",
      isAwarded: false,
      type: "none",
    },
    {
      id: 4,
      title: "수영장 자유형 기록 측정",
      date: "2024.07.12",
      medalImageSrc: "/images/medal_none.png",
      isAwarded: false,
      type: "none",
    },
  ];

  // ‼️ 배포 오류를 위한 임시 코드
  const groups = dummyGroups;
  const exercises = dummyEx;
  // const [groups, setGroups] = useState<GroupMProps[]>(dummyGroups);
  // const [exercises, setExercises] = useState<ContentCardLProps[]>(dummyEx);
  const totalMedals = dummyMedals.filter(m => m.isAwarded).length;
  const gold = dummyMedals.filter(m => m.type === "gold").length;
  const silver = dummyMedals.filter(m => m.type === "silver").length;
  const bronze = dummyMedals.filter(m => m.type === "bronze").length;
  const navigate = useNavigate();

  console.log(goldCount);
  return (
    <div className="flex flex-col overflow-auto">
      <div className="flex flex-col gap-[1.25rem]">
        <div className="max-w-full w-full">
          <MainHeader hasNotification={true} />
        </div>
        <Profile
          name={name}
          gender={gender}
          level={level}
          birth={birth}
          profileImage={profileImage}
        />
      </div>

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
          numberValue={groups.length}
          onClick={() => navigate("/mypage/mygroup", { state: { groups } })}
        />
        <MyPage_Text
          textLabel="내 운동"
          numberValue={exercises.length}
          onClick={() =>
            navigate("/myPage/myexercise", {
              state: { myActivityCount: exercises },
            })
          }
        />

        {/* <MyPage_Text textLabel="내 모임" numberValue={myGroupCount} onClick={() => navigate("/myPage/mygroup")} /> */}
        {/* <MyPage_Text textLabel="내 운동" numberValue={myExerciseCount} onClick={() => navigate("/myPage/myexercise")}/> */}
        {/* <MyPageContentcard
          myMedalTotal={myMedalTotal}
          goldCount={goldCount}
          silverCount={silverCount}
          bronzeCount={bronzeCount}
          disabled={disabled}
          onClick={() => navigate("/myPage/mymedal")}  
        /> */}
        <MyPageContentcard
          myMedalTotal={totalMedals}
          goldCount={gold}
          silverCount={silver}
          bronzeCount={bronze}
          disabled={disabled}
          onClick={() => {
            console.log("navigate with state:", {
              medals: dummyMedals,
              goldCount: gold,
              silverCount: silver,
              bronzeCount: bronze,
              myMedalTotal: totalMedals,
              disabled,
            });
            navigate("/myPage/mymedal", {
              state: {
                medals: dummyMedals,
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
  );
};
