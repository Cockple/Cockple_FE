import { MyPage_Text } from "../../components/common/contentcard/MyPage_Text";
import { Profile } from "../../components/MyPage/Profile";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { useNavigate } from "react-router-dom";
import { MyPage_Profile_Medal } from "../../components/common/contentcard/MyPage_Profile_Medal";
import type { GroupMProps } from "./MyPageMyGroupPage";

interface MyPageProps {
  name?: string;
  gender?: "female" | "male";
  level?: string;
  birth?: string;
  profileImage?: File;

  myGroupCount?: number;
  // myExerciseCount?: number;

  myMedalTotal?: number;
  goldCount?: number;
  silverCount?: number;
  bronzeCount?: number;
  disabled?: boolean;
}
export const MyPageProfile = ({
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

  myMedalTotal = 0,
  goldCount = 0,
  silverCount = 0,
  bronzeCount = 0,
  // myGroupCount = 0,
  // myExerciseCount = 0,
  disabled = false,
}: MyPageProps) => {
  const navigate = useNavigate();

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

  // ‼️ 배포 오류를 위한 임시 코드
  const groups = dummyGroups;
  // const [groups, setGroups] = useState<GroupMProps[]>(dummyGroups);

  return (
    <div className="flex flex-col pb-26 overflow-auto">
      <div className="gap-[1.25rem]">
        <PageHeader title="프로필" />
        <Profile
          name={name}
          gender={gender}
          level={level}
          birth={birth}
          profileImage={profileImage}
        />
      </div>

      <div className="my-8 flex flex-col gap-4">
        <MyPage_Text
          textLabel="내 모임"
          numberValue={groups.length}
          onClick={() => navigate("/mypage/mygroup", { state: { groups } })}
        />
        {/* <MyPage_Text textLabel="내 모임" numberValue={myGroupCount} onClick={() => navigate("/mypage/profile/group")} /> */}
        <MyPage_Profile_Medal
          myMedalTotal={myMedalTotal}
          goldCount={goldCount}
          silverCount={silverCount}
          bronzeCount={bronzeCount}
          disabled={disabled}
          onClick={() => navigate("/mypage/profile/medal")}
        />
      </div>

      <Grad_GR400_L
        label="개인 채팅 보내기"
        onClick={() => navigate("/chat/group/:chatId")}
      />
    </div>
  );
};
