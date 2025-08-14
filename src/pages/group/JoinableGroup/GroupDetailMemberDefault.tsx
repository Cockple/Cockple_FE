import { PageHeader } from "../../../components/common/system/header/PageHeader";
import Search from "../../../assets/icons/search.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import { Member } from "../../../components/common/contentcard/Member";
import { useNavigate } from "react-router-dom";
import type { MemberProps } from "../../../components/common/contentcard/Member";
import { Modal_Join } from "../../../components/group/Modal_Join";
import { useState, useEffect } from "react";
import TabSelector from "../../../components/common/TabSelector";
import Grad_Mix_L from "../../../components/common/Btn_Static/Text/Grad_Mix_L";
import { useLocation,useParams  } from "react-router-dom";
import { getPartyMembers, type Member as ApiMember} from "../../../api/party/members";
import { joinParty } from "../../../api/party/JoinRequests";

const mapApiMemberToMemberProps = (m: ApiMember): MemberProps => ({
  memberId: m.memberId,
  name: m.nickname,
  imgUrl: m.profileImageUrl || null,
  // role: m.role,
  gender: m.gender,
  level: m.level,
  isMe: m.isMe,
  isLeader: m.role === "OWNER",
  position: m.role === "OWNER" ? "leader" : m.role === "SUBOWNER" ? "sub_leader" : null,
  status: "Participating", 
});

export const GroupDetailMemberDefault = () => {
  const { partyId } = useParams<{ partyId: string }>(); 
  const numericPartyId = Number(partyId);

  const [members, setMembers] = useState<MemberProps[]>([]);
  const [participantsCount, setParticipantsCount] = useState<number>(0);
  const [participantGenderCount, setParticipantGenderCount] = useState<{ male: number; female: number }>({
    male: 0,
    female: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false); // 신청 여부
  const isApproved = false; // 서버 승인 여부

  const [searchTerm, setSearchTerm] = useState("");

  // API 호출
useEffect(() => {
  const fetchMembers = async () => {
    try {
      const res = await getPartyMembers(numericPartyId);
   if (res.success) {
  const { summary, members } = res.data; // content → members로 변경

  const mappedMembers: MemberProps[] = members.map(mapApiMemberToMemberProps);
  setMembers(mappedMembers);

  setParticipantsCount(summary.totalCount);
  setParticipantGenderCount({ male: summary.maleCount, female: summary.femaleCount });
}

    } catch (err) {
      console.error("멤버 조회 실패", err);
    }
  };

  fetchMembers();
}, [numericPartyId]);

  const filteredMembers = members.filter(member => {
    // const nameMatch = member.nickname?.toLowerCase().includes(searchTerm.toLowerCase());
    // const levelMatch = member.level?.toLowerCase().includes(searchTerm.toLowerCase());
    // return nameMatch || levelMatch;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 멤버 삭제
  const handleDeleteMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
    setParticipantsCount(updated.length);
  };

  const initialTab = (location.state?.tab ?? "home") as "home" | "chat" | "Calendar" | "member";
  const [activeTab, setActiveTab] = useState<"home" | "chat" | "Calendar" | "member">(initialTab);

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
          title={isApplied ? "가입 신청이 완료되었어요!" : "모임에 가입하시겠어요?"}
          messages={
            isApplied
              ? ["모임장의 승인을 받아 가입이 완료되면,", "알림으로 알려드릴게요"]
              : ["‘가입 신청하기’를 누르시면, 가입 신청이 완료되며", "모임장의 승인 이후 가입이 완료돼요."]
          }
          confirmLabel={isApplied ? "확인" : "가입 신청하기"}
          onConfirm={async () => {
            if (!isApplied) {
              try {
                const res = await joinParty(numericPartyId); 
                if (res.success) {
                  alert("가입 신청 성공!");
                  setIsApplied(true); 
                } else {
                  alert(res.message || "가입 신청 실패");
                  console.error(res.errorReason);
                }
              } catch (err) {
                console.error("가입 신청 API 호출 실패", err);
              }
            }
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
