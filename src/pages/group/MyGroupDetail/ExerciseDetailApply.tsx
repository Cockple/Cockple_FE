//운동 상세 페이지 -> 신청하기 (이게 뭐지???)
import { PageHeader } from "../../../components/common/system/header/PageHeader";
import Vector from "../../../assets/icons/Vector.svg?react";
import Caution from "../../../assets/icons/caution.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import { Member } from "../../../components/common/contentcard/Member";
import { useNavigate } from "react-router-dom";
import type { MemberProps } from "../../../components/common/contentcard/Member";
import { useState } from "react";
import Grad_GR400_L from "../../../components/common/Btn_Static/Text/Grad_GR400_L";
import { Modal_Join } from "../../../components/group/Modal_Join";
import { getModalConfig } from "../../../components/group/modalConfig";
import { SortBottomSheet } from "../../../components/common/SortBottomSheet";

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

export const ExerciseDetailApply = (props: MyPageExerciseDetailPageProps) => {
  const navigate = useNavigate();

  const {
    notice = "명찰을 위한 신분증",
    placeName = "산성 배드민턴장",
    placeAddress = "수정로456번길 19",
    participantsCount = 5,
    participantGenderCount = { male: 2, female: 1 },

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
        memberId: 1,
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
        memberId: 2,
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
        memberId: 3,
      },
    ],
    waitingCount = 2,
    waitingGenderCount = { male: 1, female: 1 },

    waitingMembers = [
      {
        requestId: 101,
        status: "waiting",
        name: "최유리",
        gender: "FEMALE",
        level: "E조",
        isMe: false,
        isLeader: false,
        position: null,
        memberId: 4,
      },
      {
        requestId: 102,
        status: "waiting",
        name: "정수민",
        gender: "MALE",
        level: "F조",
        isMe: false,
        isLeader: false,
        position: null,
        memberId: 5,
      },
    ],
  } = props;

  const [members, setMembers] = useState<MemberProps[]>(participantMembers);

  const [participantsCountState, setParticipantsCount] =
    useState(participantsCount);
  const [waitingMembersState, setWaitingMembers] =
    useState<MemberProps[]>(waitingMembers);
  const [waitingCountState, setWaitingCount] = useState(waitingCount);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false); // 신청 여부
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("운동 수정하기");

  // 참여 멤버 삭제 함수
  const handleDeleteMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
    setParticipantsCount(updated.length);
  };
  const currentUser = members.find(m => m.isMe);
  const isCurrentUserLeader = currentUser?.isLeader;

  return (
    <>
      <PageHeader title="운동 상세" onMoreClick={() => setIsSortOpen(true)} />
      <div className="flex flex-col gap-8">
        {/* 장소 정보 */}
        <div className="mt-5 border border-[#1ABB65] rounded-xl flex flex-col gap-3 p-4 w-full">
          <div className="flex items-center gap-2">
            <Caution className="w-5 h-5" />
            <p className="body-rg-500 truncate">{notice}</p>
          </div>
          <div className="flex items-start gap-2">
            <Vector className="w-5 h-5 mt-4" />
            <div className="flex flex-col">
              <p
                className="body-rg-500 truncate text-left"
                style={{ textIndent: "0", paddingLeft: "0", marginLeft: "0" }}
              >
                {placeName?.trim()}
              </p>
              <p className="body-rg-500 truncate">{placeAddress?.trim()}</p>
            </div>
          </div>
        </div>

        {/* 참여 인원 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-left header-h5">참여 인원</label>
              {participantGenderCount.male +
                participantGenderCount.female} / {participantsCountState}
            </div>
            <div className="flex items-center gap-2">
              <Female className="w-4 h-4" />
              <p className="body-rg-500">{participantGenderCount.female}</p>
              <Male className="w-4 h-4" />
              <p className="body-rg-500">{participantGenderCount.male}</p>
            </div>
          </div>
        </div>
      </div>
      {members.map((member, idx) => {
        const modalConfig = getModalConfig(
          member.status,
          isCurrentUserLeader ?? false,
          member.isMe ?? false,
          member.name,
        );

        return (
          <div key={`participant-${idx}`}>
            <Member
              {...member}
              number={idx + 1}
              position={member.position}
              onClick={() => navigate(`/mypage/profile/${member.memberId}`)}
              onDelete={() => handleDeleteMember(idx)}
              showDeleteButton={
                !!isCurrentUserLeader || (member.isMe && !isCurrentUserLeader)
              }
              modalConfig={modalConfig ?? undefined}
            />
            <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
          </div>
        );
      })}

      {/* 대기 인원 */}
      {waitingMembersState.length > 0 && (
        <div className="flex flex-col gap-2 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-left header-h5">대기 인원</label>
              <p className="header-h5">{waitingCountState}</p>
            </div>
            <div className="flex items-center gap-2">
              <Female className="w-4 h-4" />
              <p className="body-rg-500">{waitingGenderCount?.female ?? 0}</p>
              <Male className="w-4 h-4" />
              <p className="body-rg-500">{waitingGenderCount?.male ?? 0}</p>
            </div>
          </div>

          {waitingMembersState.map((member, idx) => {
            const modalConfig = getModalConfig(
              member.status,
              isCurrentUserLeader ?? false,
              member.isMe ?? false,
              member.name,
            );
            return (
              <div key={`waiting-${idx}`}>
                <Member
                  {...member}
                  number={idx + 1}
                  position={member.position}
                  onClick={() => navigate(`/mypage/profile/${member.memberId}`)}
                  onDelete={() => {
                    const updated = waitingMembersState.filter(
                      (_, i) => i !== idx,
                    );
                    setWaitingMembers(updated);
                    setWaitingCount(updated.length);
                  }}
                  showDeleteButton={
                    !!isCurrentUserLeader ||
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
      <div className="mt-8">
        <Grad_GR400_L label="신청하기" onClick={() => setIsModalOpen(true)} />
        {isModalOpen && (
          <Modal_Join
            title={
              isApplied ? "신청이 완료되었어요!" : "운동을 신청하시겠어요?"
            }
            messages={
              isApplied
                ? [
                    "'운동 상세' 페이지에서",
                    "운동의 세부 내용들을 확인할 수 있어요.",
                  ]
                : [
                    "‘신청하기’를 누르시면 운동에 바로 참여됩니다.",
                    "시간과 장소, 공지를 꼭 확인해주세요.",
                  ]
            }
            confirmLabel={isApplied ? "운동 상세 보기" : "신청하기"}
            onConfirm={() => {
              if (!isApplied) {
                setIsApplied(true);
              } else {
                navigate("");
              }
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>

      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selected={sortOption}
        onSelect={option => setSortOption(option)}
        options={["운동 수정하기", "운동 삭제하기"]}
      />
    </>
  );
};
