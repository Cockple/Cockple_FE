import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  removeMemberFromParty,
  getPartyMembers,
  type Member as ApiMember,
} from "../../../api/party/members";

import { leaveParty } from "../../../api/party/my";
import type { ModalConfig } from "../../../components/group/modalConfig";
import { PageHeader } from "../../../components/common/system/header/PageHeader";
import { Member } from "../../../components/common/contentcard/Member";
import Search from "../../../assets/icons/search.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import type { MemberProps } from "../../../components/common/contentcard/Member";

export const MemberDefault = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const partyId = Number(groupId);

  const [members, setMembers] = useState<MemberProps[]>([]);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [participantGenderCount, setParticipantGenderCount] = useState({
    male: 0,
    female: 0,
  });
  const [myRole, setMyRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 배포 오류 방지 코드
  console.log(myRole);

  const navigate = useNavigate();

  const mapApiMemberToMemberProps = (m: ApiMember): MemberProps => ({
    memberId: m.memberId,
    name: m.nickname,
    imgUrl: m.profileImageUrl || null,
    gender: m.gender,
    level: m.level,
    isMe: !!m.isMe,
    isLeader: m.role === "OWNER",
    position:
      m.role === "OWNER"
        ? "leader"
        : m.role === "SUBOWNER"
          ? "sub_leader"
          : null,
    status: m.role === "WAITING" ? "waiting" : "Participating",
  });

  useEffect(() => {
    const fetchMembers = async () => {
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
          const me = members.find((m: ApiMember) => m.isMe);
          setMyRole(me?.role || null);
        }
      } catch (err) {
        console.error("멤버 조회 실패", err);
      }
    };
    fetchMembers();
  }, [partyId]);

  //모임 탈퇴 나 자신, 모임장
  const handleLeaveOrRemove = async (memberId: number, isMe: boolean) => {
    try {
      if (isMe) {
        // 본인 탈퇴
        const res = await leaveParty(partyId);
        if (res.data.success) {
          alert("모임 탈퇴 성공!");
          setMembers(prev => prev.filter(m => m.memberId !== memberId));
        } else {
          alert(res.data.message || "모임 탈퇴 실패");
        }
      } else {
        // 다른 멤버 삭제
        const res = await removeMemberFromParty(partyId, memberId);
        if (res.data.success) {
          alert("멤버 삭제 성공!");
          setMembers(prev => prev.filter(m => m.memberId !== memberId));
        } else {
          alert(res.data.message || "멤버 삭제 실패");
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "요청 중 오류가 발생했습니다.");
    }
  };

  // 검색어 필터링
  const filteredMembers = members.filter(member => {
    const term = searchTerm.toLowerCase();
    return (
      member.name.toLowerCase().includes(term) ||
      member.level.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <PageHeader title="운동 상세" />

      {/* 검색 및 참여 인원 */}
      <div className="flex flex-col mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="이름, 급수로 검색"
            className="w-full border rounded-xl p-2 pr-14 body-md-500 text-[#C0C4CD] border-[#E4E7EA] focus:outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="w-6 h-6" />
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
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
      {filteredMembers.map((member, idx) => {
        const modalConfig: ModalConfig | undefined =
          member.isMe && !member.isLeader
            ? {
                title: "정말 모임을 탈퇴하시겠어요?",
                messages: [
                  "'탈퇴하기'를 누르시면, 복구할 수 없으니",
                  "신중한 선택 부탁드려요.",
                ],
                confirmLabel: "탈퇴하기",
                onConfirm: () => {
                  if (member.memberId != null) {
                    handleLeaveOrRemove(member.memberId, true);
                  }
                },
              }
            : undefined;

        return (
          <div key={idx}>
            <Member
              {...member}
              number={idx + 1}
              onClick={() => navigate(`/mypage/profile/${member.memberId}`)}
              showDeleteButton={member.isMe && !member.isLeader}
              modalConfig={modalConfig}
            />
            <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
          </div>
        );
      })}
    </>
  );
};
