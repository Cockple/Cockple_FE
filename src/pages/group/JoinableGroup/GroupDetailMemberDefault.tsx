import { PageHeader } from "../../../components/common/system/header/PageHeader";
import Search from "../../../assets/icons/search.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import { Member } from "../../../components/common/contentcard/Member";
import { useNavigate } from "react-router-dom";
import type { MemberProps } from "../../../components/common/contentcard/Member";
import { Modal_Join } from "../../../components/group/Modal_Join";
import { useState } from "react";
import TabSelector from "../../../components/common/TabSelector";
import Grad_Mix_L from "../../../components/common/Btn_Static/Text/Grad_Mix_L";
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
}

export const GroupDetailMemberDefault = (
  props: MyPageExerciseDetailPageProps,
) => {
  const {
    // notice = "명찰을 위한 신분증",
    // placeName = "산성 배드민턴장",
    // placeAddress = "수정로456번길 19",
    participantsCount = 5,
    participantGenderCount = { male: 2, female: 3 },
    participantMembers = [
        {
          requestId: 1,
          status: "Participating",
          name: "홍길동",
          gender: "MALE", 
          level: "A조",
          isMe: false,
          isLeader: true,
          position: "leader",
        },
        {
          requestId: 2,
          status: "Participating",
          name: "김민수",
          gender: "MALE",
          level: "B조",
          isMe: true,
          isLeader: false,
          position: "sub_leader",
        },
        {
          requestId: 3,
          status: "Participating",
          name: "이지은",
          gender: "FEMALE",
          level: "C조",
          isMe: false,
          isLeader: false,
          position: null,
        },
        {
          requestId: 4,
          status: "Participating",
          name: "박서준",
          gender: "MALE",
          level: "D조",
          isMe: false,
          isLeader: false,
          position: null,
        },
      ],
      } = props;

  const [members, setMembers] = useState<MemberProps[]>(participantMembers);

  const [participantsCountState, setParticipantsCount] =
    useState(participantsCount);

  // ‼️ 배포 오류를 위한 임시 코드
  console.log(participantsCountState);

  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false); // 신청 여부

  // ‼️ 배포 오류를 위한 임시 코드
  const isApproved = false;
  // const [isApproved, setIsApproved] = useState(false); // 모임장이 승인했는지 여부 -> 서버

  //검색 기능
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const filteredMembers = members.filter(member => {
    const nameMatch = member.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const levelMatch = member.level
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return nameMatch || levelMatch;
  });

  // 참여 멤버 삭제 함수
  const handleDeleteMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
    setParticipantsCount(updated.length);
  };

  const initialTab = (location.state?.tab ?? "home") as
    | "home"
    | "chat"
    | "Calendar"
    | "member";
  const [activeTab, setActiveTab] = useState<
    "home" | "chat" | "Calendar" | "member"
  >(initialTab);

  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="운동 상세" />
      <div className="flex flex-col ">
        <TabSelector
          selected={activeTab}
          onChange={value =>
            setActiveTab(value as "home" | "chat" | "Calendar" | "member")
          }
          options={[
            { label: "홈", value: "home" },
            { label: "채팅", value: "chat" },
            { label: "캘린더", value: "Calendar" },
            { label: "멤버", value: "member" },
          ]}
        />
        <div className="mb-8">
          <div className="relative mt-15">
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
              onClick={() => navigate("/mypage/profile")}
              onDelete={() => handleDeleteMember(idx)}
              // modalConfig={modalConfig as ModalConfig}
            />
            <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
          </div>
        ))}
      </div>

      <div className="mt-8 relative">
        <Grad_Mix_L
          type="chat_question"
          label="모임 가입하기"
          initialStatus={isApproved ? "disabled" : "default"}
          onClick={() => {
            if (!isApproved) {
              setIsModalOpen(true);
            }
          }}
        />
      </div>

      {isModalOpen && (
        <Modal_Join
          title={
            isApplied ? "가입 신청이 완료되었어요!" : "모임에 가입하시겠어요?"
          }
          messages={
            isApplied
              ? [
                  "모임장의 승인을 받아 가입이 완료되면,",
                  "알림으로 알려드릴게요",
                ]
              : [
                  "‘가입 신청하기’를 누르시면, 가입 신청이 완료되며",
                  "모임장의 승인 이후 가입이 완료돼요.",
                ]
          }
          confirmLabel={isApplied ? "확인" : "가입 신청하기"}
          onConfirm={() => {
            if (!isApplied) {
              setIsApplied(true); // 신청 상태로 전환
            }
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
