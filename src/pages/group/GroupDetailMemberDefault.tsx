// 더 이상 이 경로와 이 파일은 사용하지 않습니다. 모임 경로가 나오면 그때 삭제하겠습니다.
import { PageHeader } from "../../components/common/system/header/PageHeader";
import Search from "../../assets/icons/search.svg?react";
import Caution from "../../assets/icons/Caution.svg?react";
import Female from "../../assets/icons/female.svg?react";
import Male from "../../assets/icons/male.svg?react";
import { Member } from "../../components/common/contentcard/Member";
import { useNavigate } from "react-router-dom";
import type { MemberProps } from "../../components/common/contentcard/Member";
import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { Modal_Apply } from "../../components/group/Modal_Apply";
import { useState } from "react";
import TabSelector from "../../components/common/TabSelector";
import { useLocation } from "react-router-dom";
import Grad_Mix_L from "../../components/common/Btn_Static/Text/Grad_Mix_L";

interface MyPageExerciseDetailPageProps {
  notice?: string;
  placeName?: string;
  placeAddress?: string;

  participantsCount?: number;
  participantGenderCount?: { male: number; female: number };
  participantMembers?: MemberProps[];

  waitingCount?: number;
  waitingGenderCount?: { male: number; female: number };
  waitingMembers?: MemberProps[];
};

// export const MyPageExerciseDetailPage = ({
//   notice = "",
//   placeName = "",
//   placeAddress = "",

//   participantsCount = 0,
//   participantGenderCount = { male: 0, female: 0 },
//   participantMembers = [],

//   waitingCount = 0,
//   waitingGenderCount = { male: 0, female: 0 },
//   waitingMembers = [],
// }: MyPageExerciseDetailPageProps) => {

// export const MyPageExerciseDetailPage = ({
export const GroupDetailMemberDefault = (props: MyPageExerciseDetailPageProps) => {
 const {
    notice = "명찰을 위한 신분증",
    placeName = "산성 배드민턴장",
    placeAddress = "수정로456번길 19",
    participantsCount = 5,
    participantGenderCount = { male: 2, female: 3 },
    participantMembers = [
      { status: "Participating", name: "홍길동", gender: "male", level: "A조", isMe: true },
      { status: "Participating", name: "김민수", gender: "male", level: "B조" },
      { status: "Participating", name: "이지은", gender: "female", level: "C조" },
      { status: "Participating", name: "박서준", gender: "male", level: "D조" },
    ],
  } = props;

  const [members, setMembers] = useState<MemberProps[]>(participantMembers);
  
  const [participantsCountState, setParticipantsCount] = useState(participantsCount);
  const [waitingMembers, setWaitingMembers] = useState<MemberProps[]>(props.waitingMembers ?? []);
  const [waitingCount, setWaitingCount] = useState(props.waitingCount ?? 0);

  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [isApplied, setIsApplied] = useState(false); // 신청 여부 

  // 참여 멤버 삭제 함수
  const handleDeleteMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
    setParticipantsCount(updated.length);
  };

const initialTab = (location.state?.tab ?? "home") as "home" | "chat" | "Calendar" | "member";
  const [activeTab, setActiveTab] = useState<"home" | "chat" | "Calendar" | "member">(initialTab);

  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="운동 상세" />
      <div className="flex flex-col ">
       <TabSelector
        selected={activeTab}
        onChange={value => setActiveTab(value as "home" | "chat" | "Calendar" | "member")}
        options={[
          { label: "홈", value: "home" },
          { label: "채팅", value: "chat" },
          { label: "캘린더", value: "Calendar" },
          { label: "멤버", value: "member" },
        ]}
      />
        <div className="mb-8">
          
          <div className="relative">
            <input
              type="text"
              placeholder="이름, 급수로 검색"
              className="w-full border rounded-xl	p-2 pr-14 body-md-500  text-[#C0C4CD] border-[#E4E7EA] focus:outline-none"
              onClick={() => navigate("/myPage/edit/location")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="w-6 h-6" />
            </span>
          </div>
        </div>

        {/* 참여 인원 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-left header-h5">참여 인원</label>
              <p className="header-h5">{participantsCount}</p>
            </div>
            <div className="flex items-center gap-2">
              <Female className="w-4 h-4" />
              <p className="body-rg-500">{participantGenderCount.female}</p>
              <Male className="w-4 h-4" />
              <p className="body-rg-500">{participantGenderCount.male}</p>
            </div>
          </div>
        </div>

        {members.map((member, idx) => (
          <div key={`participant-${idx}`}>
            <Member
              {...member}
              number={idx + 1}
              onClick={() => navigate("/mypage/profile")}
              onDelete={() => handleDeleteMember(idx)}
            />
            <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
          </div>
        ))}
       </div>

        <Grad_Mix_L
          type="chat_question"
          label="모임 가입하기"
          // onImageClick={() => setIsDeleteModalOpen(true)}
        />
    </>
  );
};
