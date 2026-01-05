import { MyPage_Text } from "../../../components/common/contentcard/MyPage_Text";
import { MyPage_Medal } from "../../../components/common/contentcard/MyPage_Medal";
import { useNavigate } from "react-router-dom";

// 메달의 여부에 따라 보이는 컴포넌트가 달라서 이 파일에서 처리함
interface MyPageProps {
  myMedalTotal?: number;
  goldCount?: number;
  silverCount?: number;
  bronzeCount?: number;
  disabled?: boolean;
  onClick?: () => void;
}

export const MyPage = ({
  myMedalTotal = 0,
  goldCount = 0,
  silverCount = 0,
  bronzeCount = 0,
  disabled = false,
}: MyPageProps) => {
  
  // 메달이 없으면 MyPage_Text
  const navigate = useNavigate(); 
  if (myMedalTotal === 0) {
    return (
      <MyPage_Text
        textLabel="내 메달"
        disabled={disabled}
        onClick={() => navigate("/myPage/mymedal")}
      />
    );
  }

  // 메달이 있으면 기존 메달 섹션 보여줌
  return (
    <MyPage_Medal
      myMedalTotal={myMedalTotal}
      goldCount={goldCount}
      silverCount={silverCount}
      bronzeCount={bronzeCount}
      disabled={disabled}
      onClick={() => navigate("/myPage/mymedal")}
    />
  );
};
