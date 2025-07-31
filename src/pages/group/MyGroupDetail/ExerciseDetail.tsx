// 운동 상세 페이지 -> 대기 신청
import { PageHeader } from "../../../components/common/system/header/PageHeader";
import Vector from "../../../assets/icons/Vector.svg?react";
import Caution from "../../../assets/icons/Caution.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import { Member } from "../../../components/common/contentcard/Member";
import { useNavigate } from "react-router-dom";
import type { MemberProps } from "../../../components/common/contentcard/Member";
import { useState } from "react";
import Grad_GR400_L from "../../../components/common/Btn_Static/Text/Grad_GR400_L";
import { Modal_Apply } from "../../../components/group/Modal_Apply";
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
};

// export const MyPageExerciseDetailPage = ({
//   notice = "",
//   placeName = "",
//   placeAddress = "",

//   participantsCount = 0,
//   participantGenderCount = { male: 0, female: 0 },
//   participantMembers = [],

//   waitingCount = 0,
//   waitingGenderCount = { male: 0, female: 0 },
//   waitingMembers = [],
// }: MyPageExerciseDetailPageProps) => {

// export const MyPageExerciseDetailPage = ({
export const ExerciseDetail = (props: MyPageExerciseDetailPageProps) => {
 const {
    notice = "명찰을 위한 신분증",
    placeName = "산성 배드민턴장",
    placeAddress = "수정로456번길 19",
    participantsCount = 5,
    participantGenderCount = { male: 2, female: 3 },
   participantMembers = [
      { status: "Participating", name: "홍길동", gender: "male", level: "A조", isMe: false, isLeader: true, position: "leader"}, 
      { status: "Participating", name: "김민수", gender: "male", level: "B조", isMe: true,isLeader: false, position: "sub_leader" },
      { status: "Participating", name: "이지은", gender: "female", level: "C조", isMe: false, isLeader: false, position: null },
      { status: "Participating", name: "박서준", gender: "male", level: "D조", isMe: false, isLeader: false, position: null },
    ],
  } = props;

  const [members, setMembers] = useState<MemberProps[]>(participantMembers);
  
  const [participantsCountState, setParticipantsCount] = useState(participantsCount);
  const [waitingMembers, setWaitingMembers] = useState<MemberProps[]>([]);
  const [waitingCount, setWaitingCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [isApplied, setIsApplied] = useState(false); // 신청 여부 

  // 참여 멤버 삭제 함수
  const handleDeleteMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
    setParticipantsCount(updated.length);
  };
  const currentUser = members.find(m => m.isMe);
  const isCurrentUserLeader = currentUser?.isLeader;

  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="운동 상세" />
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
              <p className="body-rg-500 truncate text-left" style={{ textIndent: '0', paddingLeft: '0', marginLeft: '0' }}>
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
                {participantGenderCount.male + participantGenderCount.female} / {participantsCount}
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
            member.name
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
        {waitingMembers.length > 0 && (
          <div className="flex flex-col gap-2  mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-left header-h5">대기 인원</label>
                <p className="header-h5">{waitingCount}</p>
              </div>
            </div>

            {waitingMembers.map((member, idx) => (
              <div key={`waiting-${idx}`}>
                <Member
                  {...member}
                  number={idx + 1}
                  onClick={() => navigate("/mypage/profile")}
                  onDelete={() => {
                    const updated = waitingMembers.filter((_, i) => i !== idx);
                    setWaitingMembers(updated);
                    setWaitingCount(updated.length);
                  }}
                  showDeleteButton={!!isCurrentUserLeader || (member.isMe && !isCurrentUserLeader)} // 여기를 추가

                />
                <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
              </div>
            ))}
          </div>
        )}
      <div className="mt-8">

        <Grad_GR400_L label="대기 신청하기" onClick={() => setIsModalOpen(true)} />
        {isModalOpen && (
          <Modal_Apply
            title={
              isApplied
                ? "대기 인원으로 신청하시겠어요?"
                : "대기 인원으로 신청되었어요."
            }
            messages={
              isApplied
                ? ["'운동 상세' 페이지에서","운동의 세부 내용들을 확인할 수 있어요."]
                : [
                    "참여 기능 인원이 초과되었어요.",
                    "'신청하기'를 누르시면, 빈 자리가 생길 경우",
                    "순차적으로 참여 인원으로 변경됩니다."
                  ]
            }
            confirmLabel={isApplied ? "운동 상세 보기" : "신청하기"}
            onConfirm={() => {
            if (!isApplied) {
              setIsApplied(true); 
              
              // 하드 코드
              const myWaitingMember: MemberProps = {
                status: "waiting",
                name: "나", // 혹은 유저 이름 정보 가져올 수 있으면 대체
                gender: "female", // 또는 "male" 실제 유저 성별로
                level: "미정",    // 없으면 "미정" 또는 생략
                isMe: true,
              };

              const updated = [...waitingMembers, myWaitingMember];
              setWaitingMembers(updated);
              setWaitingCount(updated.length);
            } else {
              console.log("운동 상세 페이지로 이동");
              // navigate("");
            }
            setIsModalOpen(false);
          }}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};
