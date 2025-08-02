import { PageHeader } from "../../../components/common/system/header/PageHeader";
import Search from "../../../assets/icons/search.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import { Member } from "../../../components/common/contentcard/Member";
import { useNavigate } from "react-router-dom";
import type { MemberProps } from "../../../components/common/contentcard/Member";
import { useState } from "react";
import TabSelector from "../../../components/common/TabSelector";
import { getModalConfig } from "../../../components/group/modalConfig";
import type { ModalConfig } from "../../../components/group/modalConfig";
import { useLocation } from "react-router-dom"; 

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

export const MemberDefault = (props: MyPageExerciseDetailPageProps) => {
 const {
    participantsCount = 5,
    participantGenderCount = { male: 2, female: 3 },
    participantMembers = [
      { status: "Participating", name: "홍길동", gender: "male", level: "A조", isMe: false, isLeader: true, position: "leader"}, 
      { status: "Participating", name: "김민수", gender: "male", level: "B조", isMe: true,isLeader: false, position: "sub_leader" },
      { status: "Participating", name: "이지은", gender: "female", level: "C조", isMe: false, isLeader: false, position: null },
      { status: "Participating", name: "박서준", gender: "male", level: "D조", isMe: false, isLeader: false, position: null },
    ],
  } = props;

  const [members, setMembers] = useState<MemberProps[]>(participantMembers);
  
  const [participantsCountState, setParticipantsCount] = useState(participantsCount);
  
  const location = useLocation(); 
  const navigate = useNavigate();

  //검색 기능
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const filteredMembers = members.filter((member) => {
    const nameMatch = member.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const levelMatch = member.level?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || levelMatch;
  });


  // 참여 멤버 삭제 함수
  const handleDeleteMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
    setParticipantsCount(updated.length);
  };

  const status = "Participating"; 
  const isLeader = false;         
  const isMe = true;     
  const currentUser = members.find(m => m.isMe);
  const isCurrentUserLeader = currentUser?.isLeader;

 const modalConfig = getModalConfig(
  status,
  isLeader,
  isMe,
  "", 
  {
    title: "정말 모임을 탈퇴하시겠어요?",
    messages: [
      "'탈퇴하기'를 누르시면, 복구할 수 없으니",
      "신중한 선택 부탁드려요."
    ],
    confirmLabel: "탈퇴하기",
  }
);


  const initialTab = (location.state?.tab ?? "home") as "home" | "chat" | "Calendar" | "member";
  const [activeTab, setActiveTab] = useState<"home" | "chat" | "Calendar" | "member">(initialTab);

  return (
    <>
      <PageHeader title="민턴클로버(운동 이름)" />
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
              onChange={handleSearchChange} 
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

        {filteredMembers.map((member, idx) => (
          <div key={`participant-${idx}`}>
              <Member
                {...member}
                number={idx + 1}
                position={member.position}
                onClick={() => navigate("/mypage/profile")}
                onDelete={() => handleDeleteMember(idx)}
                showDeleteButton={
                  !!isCurrentUserLeader || (member.isMe && !isCurrentUserLeader)
                }
                modalConfig={modalConfig as ModalConfig}
              />
            <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
          </div>
        ))}
       </div>
    </>
  );
};
