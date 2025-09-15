// 모임 -> 모임탭에 멤버 화면
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  removeMemberFromParty,
  getPartyMembers,
  type Member as ApiMember,
} from "../../../api/party/members";
import { leaveParty } from "../../../api/party/my";
import type { ModalConfig } from "../../../components/group/modalConfig";
import { Member } from "../../../components/common/contentcard/Member";
import Search from "../../../assets/icons/search.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import type { MemberProps } from "../../../components/common/contentcard/Member";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { useNavigate } from "react-router-dom";

export const MemberDefault = () => {
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
  const [myRole, setMyRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // API 멤버 -> 프론트 MemberProps 매핑
  const mapApiMemberToMemberProps = (m: ApiMember): MemberProps => ({
    memberId: m.memberId,
    name: m.nickname,
    imgUrl: m.profileImageUrl
      ? `https://s3.ap-northeast-2.amazonaws.com/cockple-bucket/${m.profileImageUrl}`
      : null,
    gender: m.gender,
    level: m.level,
    isMe: !!m.isMe,
    isLeader:
      m.role === "OWNER" || m.role === "MANAGER" || m.role === "party_MANAGER",
    position:
      m.role === "OWNER" || m.role === "MANAGER" || m.role === "party_MANAGER"
        ? "leader"
        : m.role === "SUBOWNER"
        ? "sub_leader"
        : null,
    status: m.role === "WAITING" ? "waiting" : "Participating",
    inviterName: "", 
  });

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true); // 로딩 시작
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
          console.log("본인 role:", me?.role);
        }
      } catch (err) {
        console.error("멤버 조회 실패", err);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };
    fetchMembers();
  }, [partyId]);

  // 모임 탈퇴 or 다른 멤버 삭제
  const handleLeaveOrRemove = async (memberId: number, isMe: boolean) => {
    try {
      if (isMe) {
        const res = await leaveParty(partyId);
        if (res.data.success) {
          alert("모임 탈퇴 성공!");
          setMembers((prev) => prev.filter((m) => m.memberId !== memberId));
        } else {
          alert(res.data.message || "모임 탈퇴 실패");
        }
      } else {
        const res = await removeMemberFromParty(partyId, memberId);
        if (res.data.success) {
          alert("멤버 삭제 성공!");
          setMembers((prev) => prev.filter((m) => m.memberId !== memberId));
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
  const filteredMembers = members.filter((member) => {
    const term = searchTerm.toLowerCase();
    return (
      member.name.toLowerCase().includes(term) ||
      member.level.toLowerCase().includes(term)
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

  return (
    <>
      {/* 검색 및 참여 인원 */}
      <div className="flex flex-col mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="이름, 급수로 검색"
            className="w-full border rounded-xl p-2 pr-14 body-md-500 text-[#C0C4CD] border-[#E4E7EA] focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          const isCurrentUser = member.isMe ?? false;
          const isLeaderUser =
            myRole === "OWNER" || myRole === "MANAGER" || myRole === "party_MANAGER"; 
          const showDeleteButton = isCurrentUser || (isLeaderUser && !isCurrentUser);
 
          const modalConfig: ModalConfig | undefined = showDeleteButton
            ? {
                title: isCurrentUser
                  ? "정말 모임을 탈퇴하시겠어요?"
                  : "정말 이 멤버를 추방하시겠어요?",
                messages: isCurrentUser
                  ? [
                      "'탈퇴하기'를 누르시면, 복구할 수 없으니",
                      "신중한 선택 부탁드려요.",
                    ]
                  : ["이 멤버를 모임에서 제외하시겠어요?", "복구할 수 없습니다."],
                confirmLabel: isCurrentUser ? "탈퇴하기" : "추방하기",
                onConfirm: () => handleLeaveOrRemove(member.memberId!, isCurrentUser),
              }
            : undefined;
        return (
          <div key={idx}>
            <Member
              {...member}
              number={idx + 1}
              imgUrl={member.imgUrl}
              showDeleteButton={showDeleteButton}
              modalConfig={modalConfig}
              onClick={() => navigate(`/mypage/profile/${member.memberId}`)}

            />
            <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
          </div>
        );
      })}
    </>
  );
};
