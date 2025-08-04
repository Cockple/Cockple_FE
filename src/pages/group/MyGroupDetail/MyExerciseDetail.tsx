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
import { getModalConfig } from "../../../components/group/modalConfig";

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

export const MyExerciseDetail = (props: MyPageExerciseDetailPageProps) => {
  const navigate = useNavigate();

  const {
    notice = "명찰을 위한 신분증",
    placeName = "산성 배드민턴장",
    placeAddress = "수정로456번길 19",
    participantsCount = 5,
    participantGenderCount = { male: 2, female: 1 },

    participantMembers = [
      {
        status: "Participating",
        name: "홍길동",
        gender: "male",
        level: "A조",
        isMe: false,
        isLeader: true,
        position: "leader",
      },
      {
        status: "Participating",
        name: "김민수",
        gender: "male",
        level: "B조",
        isMe: true,
        isLeader: false,
        position: "sub_leader",
      },
      {
        status: "Participating",
        name: "이지은",
        gender: "female",
        level: "C조",
        isMe: false,
        isLeader: false,
        position: null,
      },
    ],
    waitingCount = 2,
    waitingGenderCount = { male: 1, female: 1 },

    waitingMembers = [
      {
        status: "waiting",
        name: "최유리",
        gender: "female",
        level: "E조",
        isMe: false,
        isLeader: false,
        position: null,
      },
      {
        status: "waiting",
        name: "정수민",
        gender: "male",
        level: "F조",
        isMe: false,
        isLeader: false,
        position: null,
      },
    ],
  } = props;

  const [members, setMembers] = useState<MemberProps[]>(participantMembers);

  const [participantsCountState, setParticipantsCount] =
    useState(participantsCount);

  const [waitingMembersState, setWaitingMembers] =
    useState<MemberProps[]>(waitingMembers);
  const [waitingCountState, setWaitingCount] = useState(waitingCount);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isApplied, setIsApplied] = useState(false); // 신청 여부
  const [isSortOpen, setIsSortOpen] = useState(false);
  // const [sortOption, setSortOption] = useState("최신순");

  // 참여 멤버 삭제 함수
  const handleDeleteMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
    setParticipantsCount(updated.length);
  };
  const currentUser = members.find(m => m.isMe);
  const isCurrentUserLeader = currentUser?.isLeader;

  // ‼️ 배포 오류를 위한 임시 코드
  console.log(participantsCountState);
  console.log(isSortOpen);

  return (
    <>
      <PageHeader
        title="내 운동 상세"
        onMoreClick={() => setIsSortOpen(true)}
      />
      <div className="flex flex-col gap-8">
        {/* 장소 정보 */}
        <div className="border border-[#1ABB65] rounded-xl flex flex-col gap-3 p-4 w-full">
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
                participantGenderCount.female} / {participantsCount}
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
              onClick={() => navigate("/mypage/profile")}
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
                  onClick={() => navigate("/mypage/profile")}
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
    </>
  );
};
