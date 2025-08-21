// 운동 상세 페이지 -> 신청하기
import { PageHeader } from "../../../components/common/system/header/PageHeader";
import Vector from "../../../assets/icons/Vector.svg?react";
import Caution from "../../../assets/icons/caution.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import { Member } from "../../../components/common/contentcard/Member";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { MemberProps } from "../../../components/common/contentcard/Member";
import { Modal_ExDel } from "../../../components/group/Modal_ExDel copy";
import { useState, useEffect } from "react";
import { getModalConfig } from "../../../components/group/modalConfig";
import { SortBottomSheet } from "../../../components/common/SortBottomSheet";
import {
  getExerciseDetail,
  cancelSelf,
  deleteExercise,
} from "../../../api/exercise/exercises";
import { cancelByLeader } from "../../../api/exercise/participants";
import type {
  ExerciseDetailResponse,
  CancelSelfResponse,
} from "../../../api/exercise/exercises";
import useUserStore from "../../../store/useUserStore";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";

import { useQueryClient } from "@tanstack/react-query";

export const MyExerciseDetail = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const queryClient = useQueryClient();

  const { exerciseId } = useParams<{ exerciseId: string }>();
  const exerciseIdNumber = Number(exerciseId);

  const [detail, setDetail] = useState<ExerciseDetailResponse | null>(null);
  const [members, setMembers] = useState<MemberProps[]>([]);
  const [participantsCount, setParticipantsCount] = useState(0);

  const [waitingMembers, setWaitingMembers] = useState<MemberProps[]>([]);
  const [waitingCount, setWaitingCount] = useState(0);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isCurrentUserLeader, setIsCurrentUserLeader] = useState(false);

  const [searchParams] = useSearchParams();
  const returnPath = searchParams.get("returnPath") ?? -1;

  // 운동 상세 조회
  useEffect(() => {
    if (exerciseIdNumber) {
      getExerciseDetail(exerciseIdNumber, user?.memberId).then(res => {
        console.log("운동 상세 데이터:", res);
        setDetail(res);

        setIsCurrentUserLeader(res.isManager);

        const participants: MemberProps[] = res.participantMembers.map(p => ({
          participantId: p.id,
          status: "Participating",
          name: p.name,
          gender: p.gender as "MALE" | "FEMALE",
          level: p.level,
          isMe: p.id === user?.memberId,
          memberId: p.id,
          isLeader: p.position === "party_MANAGER",
          position: p.position,
          imgUrl: p.imgUrl ?? null,
          canCancel: p.canCancel,
          isGuest: !!p.guest,
          inviterName: p.inviterName ?? "", 

        }));
        setMembers(participants);
        setParticipantsCount(participants.length);

        const waitingList: MemberProps[] = res.waitingMembers.map(w => ({
          participantId: w.id,
          name: w.name,
          gender: w.gender as "MALE" | "FEMALE",
          level: w.level,
          status: "waiting" as const,
          isMe: w.id === user?.memberId,
          position: w.position,
          isGuest: !!w.guest,
          inviterName: w.inviterName ?? "", 

        }));
        setWaitingMembers(waitingList);
        setWaitingCount(waitingList.length);
      });
    }
  }, [exerciseIdNumber, user?.memberId]);

  // 운동 취소 / 멤버 삭제 -> 새로고침 문제 ( 확인 필요 )
   const handleDeleteMember = async (
    participantId: number,
    options?: { isGuest?: boolean; isLeaderAction?: boolean }
  ) => {
    if (!exerciseIdNumber) return;

    try {
      let res: CancelSelfResponse;
      if (options?.isLeaderAction) {
        res = await cancelByLeader(
          exerciseIdNumber,
          participantId,
          options.isGuest ?? false
        );
      } else {
        res = await cancelSelf(exerciseIdNumber);
      }

      if (res.success) {
        alert("참여 취소 완료");
        setMembers(prev => prev.filter(m => m.participantId !== participantId));
        setWaitingMembers(prev => prev.filter(m => m.participantId !== participantId));
        setParticipantsCount(prev => prev - 1);
        setWaitingCount(prev => prev - 1);

        queryClient.invalidateQueries({
          queryKey: ["exerciseDetail"], 
          exact: false,
        });
      }
    } catch (error: any) {
      console.error("멤버 삭제 실패:", error);
      alert(error?.message || "참여 취소 실패");
    }
  };

  // const handleDeleteMember = async (
  //   participantId: number,
  //   options?: { isGuest?: boolean; isLeaderAction?: boolean },
  // ) => {
  //   if (!exerciseIdNumber) return;

  //   try {
  //     let res: CancelSelfResponse;
  //     if (options?.isLeaderAction) {
  //       // 모임장이 다른 참여자 또는 게스트 추방
  //       res = await cancelByLeader(
  //         exerciseIdNumber,
  //         participantId,
  //         options.isGuest ?? false,
  //       );
  //     } else {
  //       // 나 자신 모임 취소
  //       res = await cancelSelf(exerciseIdNumber);
  //     }

  //     if (res.success) {
  //       setMembers(prev => prev.filter(m => m.participantId !== participantId));
  //       setParticipantsCount(prev => prev - 1);
  //       alert("참여 취소 완료");
  //     }
  //   } catch (error: any) {
  //     console.error("멤버 삭제 실패:", error);
  //     alert(error?.message || "참여 취소 실패");
  //   }
  // };

  if (!detail) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="내 운동 상세"
        onMoreClick={
          isCurrentUserLeader ? () => setIsSortOpen(true) : undefined
        }
        onBackClick={() => {
          if (returnPath === -1) navigate(-1);
          else navigate(returnPath);
        }}
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
              <p className="body-rg-500 truncate text-start">
                {detail.placeName}
              </p>
              <p className="body-rg-500 truncate">{detail.placeAddress}</p>
            </div>
          </div>
        </div>

        {/* 참여 인원 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-left header-h5">참여 인원</label>
<span>
  {detail.participantGenderCount.male + detail.participantGenderCount.female} / {detail.participantsCount}
</span>

            </div>
            <div className="flex items-center gap-2">
              <Female className="w-4 h-4" />
              <p className="body-rg-500">{detail.participantGenderCount.female}</p>
              <Male className="w-4 h-4" />
              <p className="body-rg-500">{detail.participantGenderCount.male}</p>
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
                guestName={member.inviterName} 
                imgUrl={member.imgUrl}
                onDelete={() => {
                  if (member.participantId !== undefined) {
                    handleDeleteMember(member.participantId, {
                      isLeaderAction: isCurrentUserLeader && !member.isMe,
                      isGuest: member.isGuest, 
                    });
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
                <p className="body-rg-500">{detail.waitingGenderCount?.female ?? 0}</p>
                <Male className="w-4 h-4" />
                <p className="body-rg-500">{detail.waitingGenderCount?.male ?? 0}</p>
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
                    guestName={member.inviterName} 
                    imgUrl={member.imgUrl}
                    onDelete={() => {
                      if (member.participantId !== undefined) {
                        handleDeleteMember(member.participantId, {
                          isLeaderAction: isCurrentUserLeader && !member.isMe,
                          isGuest: member.isGuest, 
                        });
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
          </div>
        )}
      </div>

      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        options={["운동 수정하기", "운동 삭제하기"]}
        onSelect={option => {
          if (option === "운동 수정하기") {
            navigate(
              `/group/exercise/edit/${exerciseId}?returnPath=${returnPath}`,
            );
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
