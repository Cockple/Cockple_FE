import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../../components/common/system/header/PageHeader";
import { Member, type MemberProps } from "../../../components/common/contentcard/Member";
import { changeGameHost, useGetGameHostCandidates } from "../../../api/game/game";
import { useQueryClient } from "@tanstack/react-query";
import useUserStore from "../../../store/useUserStore";
import DismissIcon from "../../../assets/icons/dismiss.svg?react";
import Search from "../../../assets/icons/search.svg?react";
import Grad_GR400_L from "../../../components/common/Btn_Static/Text/Grad_GR400_L";

export const GameManagerPage = () => {
  const navigate = useNavigate();
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const exerciseIdNumber = Number(exerciseId);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useGetGameHostCandidates(exerciseIdNumber);
  const totalCount = data?.totalCount || 0;

  const { user } = useUserStore();

  const currentUser = data?.participants?.find(
    (p) => p.participantId === user?.memberId
  );

  const isGroupLeaderOrSub =
    currentUser?.partyPosition === "OWNER" ||
    currentUser?.partyPosition === "MANAGER" ||
    currentUser?.partyPosition === "PARTY_MANAGER" ||
    currentUser?.partyPosition === "SUBOWNER" ||
    currentUser?.partyPosition === "PARTY_SUBMANAGER" ||
    currentUser?.partyPosition === "모임장" ||
    currentUser?.partyPosition === "부모임장";

  const members: MemberProps[] = data?.participants.map(p => ({
    participantId: p.participantId,
    // memberId가 응답에 없으므로 일단 participantId로 임시 사용 또는 제외
    memberId: p.participantId,
    status: "Participating" as const,
    name: p.name,
    gender: p.gender as "MALE" | "FEMALE",
    level: p.level,
    lastExerciseDate: p.lastExerciseDate,
    imgUrl: p.profileImageUrl,
    // partyPosition: "모임장", "부모임장", "일반 회원" 등 한글 또는 영문 처리
    isLeader: p.partyPosition === "OWNER" || p.partyPosition === "MANAGER" || p.partyPosition === "PARTY_MANAGER" || p.partyPosition === "모임장",
    isManager: p.isGameHost,
    position: p.partyPosition === "OWNER" || p.partyPosition === "MANAGER" || p.partyPosition === "PARTY_MANAGER" || p.partyPosition === "모임장"
      ? "leader"
      : p.partyPosition === "SUBOWNER" || p.partyPosition === "PARTY_SUBMANAGER" || p.partyPosition === "부모임장"
        ? "sub_leader"
        : null,
  })) || [];

  const [selectedMember, setSelectedMember] = useState<MemberProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);



  const handleAppointClick = (member: MemberProps) => {
    if (member.isManager) {
      // 이미 지정된 경우 취소하거나 무시
      return;
    }
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleConfirmAppoint = async () => {
    if (!selectedMember || selectedMember.participantId === undefined) return;

    try {
      await changeGameHost(exerciseIdNumber, selectedMember.participantId);
      queryClient.invalidateQueries({
        queryKey: ["gameHostCandidates", exerciseIdNumber],
      });
      queryClient.invalidateQueries({
        queryKey: ["exerciseDetail", exerciseIdNumber],
      });

      setIsModalOpen(false);
      setSelectMode(false);
      alert("게임 진행자가 변경되었습니다.");

    } catch (error: any) {
      alert(error?.message || "게임 진행자 변경에 실패했습니다.");
    }
  };

  // 검색 기능
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMembers = members.filter((member) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      member.name?.toLowerCase().includes(term) ||
      member.level?.toLowerCase().includes(term)
    );
  });


  return (
    <div
      className="flex flex-col min-h-screen relative pb-24"
      onClick={() => setSelectMode(false)}
    >
      <PageHeader title="게임 진행자 관리" onBackClick={() => navigate(-1)} />

      <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* 검색창 */}
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

        {/* 인원 표시 */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-left header-h5">참여 인원</label>
              <p className="header-h5">{totalCount}</p>
            </div>
          </div>
        </div>

        {/* 멤버 리스트 */}
        <div className="flex flex-col gap-0">
          {filteredMembers.map((member, idx) => (
            <div key={`member-${member.participantId || idx}`}>
              <Member
                {...member}
                hideNumber={true} // 리스트에서 번호를 가릴지 여부
                selectMode={selectMode} // 선택 모드 활성화 (별 아이콘 표시)
                allowLeaderSelect={true} // 모임장도 게임 진행자로 선택 가능
                onClick={() => {
                  if (!selectMode && member.memberId) {
                    navigate(`/mypage/profile/${member.memberId}`);
                  }
                }}
                onAppointClick={() => handleAppointClick(member)}
              />
              <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
            </div>
          ))}
        </div>
      </div>

      {/* 하단버튼 */}
      {!selectMode && isGroupLeaderOrSub && (
        <div
          className="fixed bottom-0 left-0 w-full flex justify-center z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Grad_GR400_L
            label="수정하기"
            onClick={() => setSelectMode(true)}
          />
        </div>
      )}

      {/* 게임 진행자 지정 모달 */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white w-[21.4375rem] flex flex-col px-3 pt-6 pb-4 shadow-ds300 rounded-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <DismissIcon
              className="absolute top-3 right-3 w-8 h-8 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="flex flex-col items-center text-center mt-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.788 3.1021C11.283 2.0991 12.714 2.0991 13.209 3.1021L15.567 7.8801L20.84 8.6461C21.947 8.8061 22.389 10.1681 21.588 10.9491L17.772 14.6681L18.673 19.9181C18.863 21.0221 17.705 21.8631 16.714 21.3421L11.998 18.8621L7.28303 21.3421C6.29303 21.8621 5.13503 21.0221 5.32303 19.9191L6.22403 14.6681L2.40903 10.9481C1.60803 10.1681 2.05003 8.8071 3.15703 8.6461L8.43003 7.8801L10.788 3.1021Z" fill="#1F74FF" />
              </svg>

              <p className="header-h4 mt-2">게임 진행자로 지정하시겠어요?</p>

              <div className="flex flex-col mt-2 body-rg-500 text-black">
                <p>'지정하기'를 누르시면,</p>
                <p>게임 진행 권한이 부여됩니다.</p>
              </div>
            </div>

            <div className="flex justify-center w-full mt-6">
              <button
                onClick={handleConfirmAppoint}
                className="w-full h-10 rounded-lg border border-[#494F5A] flex items-center justify-center body-md-700 text-[#494F5A] hover:bg-gray-50"
              >
                지정하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
