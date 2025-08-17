// //운동 상세 페이지 -> 신청하기
import { PageHeader } from "../../../components/common/system/header/PageHeader";
import Vector from "../../../assets/icons/Vector.svg?react";
import Caution from "../../../assets/icons/caution.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import { Member } from "../../../components/common/contentcard/Member";
import { useNavigate, useParams  } from "react-router-dom";
import type { MemberProps } from "../../../components/common/contentcard/Member";
import { Modal_ExDel } from "../../../components/group/Modal_ExDel copy";
import { useState, useEffect } from "react";
import { getModalConfig } from "../../../components/group/modalConfig";
import { SortBottomSheet } from "../../../components/common/SortBottomSheet";
import { getExerciseDetail, cancelSelf, deleteExercise  } from "../../../api/exercise/exercises";
import { cancelByLeader } from "../../../api/exercise/participants";
import type  { ExerciseDetailResponse } from "../../../api/exercise/exercises";

export const MyExerciseDetail = () => {
  const navigate = useNavigate();
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const exerciseIdNumber = Number(exerciseId);
 
  const [detail, setDetail] = useState<ExerciseDetailResponse | null>(null);
  const [members, setMembers] = useState<MemberProps[]>([]);
  const [participantsCount, setParticipantsCount] = useState(0);

  const [waitingMembers, setWaitingMembers] = useState<MemberProps[]>([]);
  const [waitingCount, setWaitingCount] = useState(0);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("운동 수정하기");
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);

  const currentUser = members.find(m => m.isMe);
  const isCurrentUserLeader = currentUser?.isLeader ?? false;

  const memberId = Number(localStorage.getItem("memberId") || 1);

  // 운동 상세 조회 이거 다시 확인
  useEffect(() => {
    if (exerciseIdNumber) {
      getExerciseDetail(exerciseIdNumber).then(res => {
        console.log("운동 상세 데이터:", res);
        setDetail(res);

        const participants: MemberProps[] = res.participantMembers.map(p => ({
          participantId: p.id,
          status: "Participating",
          name: p.name,
          gender: p.gender as "MALE" | "FEMALE",
          level: p.level,
          isMe: p.id === memberId,
          isLeader: p.position === "모임장",
          position: p.position,
          imgUrl: p.imgUrl ?? null,
          canCancel: p.canCancel,
          isGuest: !!p.guest,
        }));
        setMembers(participants);
        setParticipantsCount(participants.length);

        const waitingList: MemberProps[] = res.waitingMembers.map(w => ({
          participantId: w.id,
          name: w.name,
          gender: w.gender as "MALE" | "FEMALE",
          level: w.level,
          status: "waiting" as const,
          isMe: w.isMe,
          position: w.position,
        }));
        setWaitingMembers(waitingList);
        setWaitingCount(waitingList.length);
      });
    }
  }, [exerciseIdNumber, memberId]);

// 더미 들어오면 삭제 모달 확인
  const handleDeleteMember = async (
    participantId: number,
    options?: { isGuest?: boolean; isLeaderAction?: boolean }
  ) => {
    if (!exerciseIdNumber) return;

    try {
      let res;
      if (options?.isLeaderAction) {
        // 모임장이 다른 참여자 삭제
        res = await cancelByLeader(exerciseIdNumber, participantId, options.isGuest ?? false);
      } else {
        // 일반 참여자가 자신 삭제
        res = await cancelSelf(exerciseIdNumber, participantId);
      }

      if (res?.success) {
        setMembers(prev => prev.filter(m => m.participantId !== participantId));
        setParticipantsCount(res.data.currentParticipants);
        console.log(`${res.data.memberName} 참여 취소 완료`);
      }
    } catch (error) {
      console.error("멤버 삭제 실패:", error);
    }
  };


  if (!detail) {
    return <p className="p-4">불러오는 중...</p>;
  }

  return (
    <>
      <PageHeader
        title="내 운동 상세"
        onMoreClick={() => setIsSortOpen(true)}
      />

      <div className="flex flex-col gap-8">
        {/* 장소 정보 */}
        <div className="mt-5 border border-[#1ABB65] rounded-xl flex flex-col gap-3 p-4 w-full">
          <div className="flex items-center gap-2">
            <Caution className="w-5 h-5" />
            <p className="body-rg-500 truncate">{detail.notice}</p>
          </div>
          <div className="flex items-start gap-2">
            <Vector className="w-5 h-5" />
            <div className="flex flex-col">
              <p className="body-rg-500 truncate text-start">{detail.placeName}</p>
              <p className="body-rg-500 truncate">
                {detail.placeAddress}
              </p>
            </div>
          </div>
        </div>

        {/* 참여 인원 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-left header-h5">참여 인원</label>
              <span>
                {detail.participantGenderCount.male +
                  detail.participantGenderCount.female}{" "}
                / {participantsCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Female className="w-4 h-4" />
              <p className="body-rg-500">
                {detail.participantGenderCount.female}
              </p>
              <Male className="w-4 h-4" />
              <p className="body-rg-500">
                {detail.participantGenderCount.male}
              </p>
            </div>
          </div>
        </div>

        {/* 참여 멤버 리스트 */}
        {members.map((member, idx) => {
          const modalConfig = getModalConfig(
            member.status,
            isCurrentUserLeader,
            member.isMe ?? false,
            member.name,
          );

          return (
            <div key={`participant-${idx}`}>
              <Member
                {...member}
                number={idx + 1}
                position={member.position}
                memberId={member.memberId}
                onClick={() => navigate(`/mypage/profile/${memberId}`)}
                onDelete={() => {
                  if (member.participantId !== undefined) {
                    handleDeleteMember(member.participantId);
                  }
                }}
                showDeleteButton={
                  isCurrentUserLeader || (member.isMe && !isCurrentUserLeader)
                }
                modalConfig={modalConfig ?? undefined}
              />
              <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
            </div>
          );
        })}

        {/* 대기 인원 */}
        {waitingMembers.length > 0 && (
          <div className="flex flex-col gap-2 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-left header-h5">대기 인원</label>
                <p className="header-h5">{waitingCount}</p>
              </div>
              <div className="flex items-center gap-2">
                <Female className="w-4 h-4" />
                <p className="body-rg-500">
                  {detail.waitingGenderCount?.female ?? 0}
                </p>
                <Male className="w-4 h-4" />
                <p className="body-rg-500">
                  {detail.waitingGenderCount?.male ?? 0}
                </p>
              </div>
            </div>

            {waitingMembers.map((member, idx) => {
              const modalConfig = getModalConfig(
                member.status,
                isCurrentUserLeader,
                member.isMe ?? false,
                member.name,
              );
              return (
                <div key={`waiting-${idx}`}>
                  <Member
                    {...member}
                    number={idx + 1}
                    position={member.position}
                    memberId={member.memberId}
                    onClick={() => navigate(`/mypage/profile/${memberId}`)}    
                    onDelete={() => {
                      const updated = waitingMembers.filter(
                        (_, i) => i !== idx,
                      );
                      setWaitingMembers(updated);
                      setWaitingCount(updated.length);
                    }}
                    showDeleteButton={
                      isCurrentUserLeader ||
                      (member.isMe && !isCurrentUserLeader)
                    }
                    modalConfig={modalConfig ?? undefined}
                  />
                  <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
                </div>
              );
            })}
          </div>
        )}
      </div>

     <SortBottomSheet
          isOpen={isSortOpen}
          onClose={() => setIsSortOpen(false)}
          selected={sortOption}
          options={["운동 수정하기", "운동 삭제하기"]}
          onSelect={option => {
            if (option === "운동 수정하기") {
              navigate(`/group/exercise/edit/${exerciseId}`);
            }
            if (option === "운동 삭제하기") {
              setIsSortOpen(false);
              setIsDelModalOpen(true); 
            }
          }}
        />
        {isDelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <Modal_ExDel 
              onConfirm={async () => {
                try {
                  const res = await deleteExercise(Number(exerciseId));
                  if (res.success) {
                    alert("운동이 삭제되었습니다.");
                    navigate(`/myPage/myexercise`); 
                  } else {
                    alert(res.message || "운동 삭제 실패");
                  }
                } catch (err: any) {
                  if (err.code === "403") {
                    alert("권한이 없습니다. (모임장만 삭제 가능)");
                  } else if (err.code === "404") {
                    alert("운동을 찾을 수 없습니다.");
                  } else {
                    alert(err.message || "서버 오류가 발생했습니다.");
                  }
                } finally {
                  setIsDelModalOpen(false);
                }
              }}
              onCancel={() => setIsDelModalOpen(false)}
            />
          </div>
        )}

    </>
  );
};
