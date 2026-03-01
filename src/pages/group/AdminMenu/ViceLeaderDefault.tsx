// 부모임장 설정 페이지
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../../../components/common/system/header/PageHeader";
import Search from "../../../assets/icons/search.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import { Member } from "../../../components/common/contentcard/Member";
import type { MemberProps } from "../../../components/common/contentcard/Member";
import Grad_GR400_L from "../../../components/common/Btn_Static/Text/Grad_GR400_L";
import { Modal_Appoint, type AppointModalType } from "../../../components/group/Modal_Appoint";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import {
  getPartyMembers,
  updateMemberRole,
  type Member as ApiMember,
} from "../../../api/party/members";

export const ViceLeaderDefault = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const partyId = Number(groupId);
  const navigate = useNavigate();

  const [members, setMembers] = useState<MemberProps[]>([]);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [participantGenderCount, setParticipantGenderCount] = useState({
    male: 0,
    female: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  
  const [targetMemberId, setTargetMemberId] = useState<number | null>(null);

  // API 멤버 -> 프론트 MemberProps 매핑
  const mapApiMemberToMemberProps = (m: ApiMember): MemberProps => ({
    memberId: m.memberId,
    name: m.nickname,
    imgUrl: m.profileImageUrl || null,
    gender: m.gender,
    level: m.level,
    lastExerciseDate: m.lastExerciseDate,
    isMe: !!m.isMe,
    isLeader:
      m.role === "OWNER" || m.role === "MANAGER" || m.role === "party_MANAGER",
    position:
      m.role === "OWNER" || m.role === "MANAGER" || m.role === "party_MANAGER"
        ? "leader"
        : m.role === "SUBOWNER" || m.role === "party_SUBMANAGER"
        ? "sub_leader"
        : null,
    status: m.role === "WAITING" ? "waiting" : "Participating",
    inviterName: "",
  });

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const res = await getPartyMembers(partyId);
        if (res.success) {
          const { summary, members } = res.data;
          const mappedMembers = members.map(mapApiMemberToMemberProps);
          setMembers(mappedMembers);
          setParticipantsCount(summary.totalCount);
          setParticipantGenderCount({
            male: summary.maleCount,
            female: summary.femaleCount,
          });
        }
      } catch (err) {
        console.error("멤버 조회 실패", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, [partyId]);

  // 검색 기능
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMembers = members.filter((member) => {
    const term = searchTerm.toLowerCase();
    return (
      member.name?.toLowerCase().includes(term) ||
      member.level?.toLowerCase().includes(term)
    );
  });

  // 로딩 시 스피너 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  const hasSubLeader = members.some((m) => m.position === "sub_leader");
  const handleAppointConfirm = async () => {
    if (targetMemberId === null) return;

    const targetMember = members.find((m) => m.memberId === targetMemberId);
    const isCurrentlySubLeader = targetMember?.position === "sub_leader";
    const newRole = isCurrentlySubLeader ? "party_MEMBER" : "party_SUBMANAGER";

    try {
      await updateMemberRole(partyId, targetMemberId, newRole);
      const updated = members.map((m) => {
        if (m.memberId === targetMemberId) {
          return { ...m, position: isCurrentlySubLeader ? null : "sub_leader" };
        }
        if (m.position === "sub_leader" && !isCurrentlySubLeader) {
          return { ...m, position: null };
        }
        return m;
      });

      setMembers(updated);
      alert(isCurrentlySubLeader ? "부모임장 권한이 해제되었습니다." : "부모임장으로 지정되었습니다.");

    } catch (error) {
      alert("부모임장 설정에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setSelectMode(false);
      setIsModalOpen(false);
    }
  };

  const getModalType = (): AppointModalType => {
    const targetMember = members.find((m) => m.memberId === targetMemberId);
    const isTargetSubLeader = targetMember?.position === "sub_leader";
    
    if (!hasSubLeader) return "appoint"; // 모임에 부모임장이 0명일 때
    if (isTargetSubLeader) return "cancel"; // 기존 부모임장을 해제할 때
    return "change"; 
  };
return (
    <div 
      className="flex flex-col min-h-screen relative pb-24" 
      onClick={() => setSelectMode(false)}
    >
      <PageHeader title="부모임장 설정" />
      
      <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="mb-8 mt-5">
          <div className="relative">
            <input
              type="text"
              placeholder="이름, 급수로 검색"
              className="w-full border rounded-xl p-2 pr-14 body-md-500 place:text-[#C0C4CD] border-[#E4E7EA] focus:outline-none"
              onChange={handleSearchChange}
              value={searchTerm}
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

        {/* 멤버 리스트 */}
        {filteredMembers.map((member, idx) => (
          <div key={`participant-${member.memberId || idx}`}>
            <Member
              {...member}
              number={idx + 1}
              imgUrl={member.imgUrl}
              lastExerciseDate={undefined}
              onClick={() => {
                if (!selectMode) {
                  navigate(`/mypage/profile/${member.memberId}`);
                }
              }}
              selectMode={selectMode}
              onAppointClick={() => {
                setTargetMemberId(member.memberId!);
                setIsModalOpen(true);
              }}
            />
            <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
          </div>
        ))}
      </div>

      {/* 하단버튼 */}
      {!selectMode && (
        <div 
          className="fixed bottom-0"
          onClick={(e) => e.stopPropagation()} 
        >
          <Grad_GR400_L
            label={hasSubLeader ? "수정하기" : "부모임장 지정하기"}
            onClick={() => setSelectMode(true)} 
          />
        </div>
      )}

      {/* 지정 모달 */}
      {isModalOpen && (
        <Modal_Appoint
          modalType={getModalType()}
          onConfirm={handleAppointConfirm}
          onCancel={() => {
            setIsModalOpen(false);
            setTargetMemberId(null);
          }}
        />
      )}
    </div>
  );
};