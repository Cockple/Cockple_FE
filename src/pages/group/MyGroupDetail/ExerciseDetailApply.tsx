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
import { Modal_Apply } from "../../../components/group/Modal_Apply";
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false); // 신청 여부
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");

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

  return (
    <>
      <PageHeader title="운동 상세" onMoreClick={() => setIsSortOpen(true)} />
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
      <div className="mt-8">
        <Grad_GR400_L label="신청하기" onClick={() => setIsModalOpen(true)} />
        {isModalOpen && (
          <Modal_Apply
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
                console.log("운동 상세 페이지로 이동");
                // navigate("")
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

// 아래 코드는 API연결 코드입니다. 아직 토큰값이 없어 연동X
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// import { PageHeader } from "../../components/common/system/header/PageHeader";
// import Vector from "../../assets/icons/Vector.svg?react";
// import Caution from "../../assets/icons/Caution.svg?react";
// import Female from "../../assets/icons/female.svg?react";
// import Male from "../../assets/icons/male.svg?react";

// import { Member } from "../../components/common/contentcard/Member";
// import type { MemberProps } from "../../components/common/contentcard/Member";

// import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
// import { Modal_Apply } from "../../components/group/Modal_Apply";

// interface MyPageExerciseDetailPageProps {
//   exerciseId: number;
//   myMemberId: number;
//   yourAccessToken: string; //이건 아직

//   notice?: string;
//   placeName?: string;
//   placeAddress?: string;
// }

// export const MyPageExerciseDetailPage = ({
//   exerciseId,
//   myMemberId,
//   yourAccessToken,

//   notice = "명찰을 위한 신분증",
//   placeName = "산성 배드민턴장",
//   placeAddress = "수정로456번길 19",
// }: MyPageExerciseDetailPageProps) => {
//   const navigate = useNavigate();

//   const [members, setMembers] = useState<MemberProps[]>([]);
//   const [waitingMembers, setWaitingMembers] = useState<MemberProps[]>([]);
//   const [participantsCount, setParticipantsCount] = useState(0);
//   const [waitingCount, setWaitingCount] = useState(0);
//   const [participantGenderCount, setParticipantGenderCount] = useState({ male: 0, female: 0 });
//   const [waitingGenderCount, setWaitingGenderCount] = useState({ male: 0, female: 0 });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isApplied, setIsApplied] = useState(false);

//   useEffect(() => {
//     const fetchExerciseDetail = async () => {
//       try {
//         const res = await axios.get(`https://cockple.store/api/exercises/${exerciseId}`, {
//           headers: {
//             Authorization: `Bearer ${access_token}`,
//             Accept: "application/json",
//           },
//         });

//         const data = res.data;

//         const participantList: MemberProps[] = data.participants.list.map((p: any) => ({
//           status: "Participating",
//           name: p.name,
//           gender: p.gender,
//           level: p.level,
//           isGuest: !!p.guest,
//           guestName: p.guest ?? undefined,
//           isMe: p.memberId === myMemberId,
//           isLeader: p.position === "모임장",
//           imgUrl: p.imgUrl,
//           position: p.position,
//           canCancel: p.canCancel,
//         }));

//         const waitingList: MemberProps[] = data.waiting.list.map((w: any) => ({
//           status: "waiting",
//           name: w.name,
//           gender: w.gender,
//           level: w.level,
//           isGuest: !!w.guest,
//           guestName: w.guest ?? undefined,
//           isMe: false,
//           isLeader: false,
//           imgUrl: w.imgUrl,
//           position: w.position,
//           canCancel: w.canCancel,
//         }));

//         setMembers(participantList);
//         setParticipantsCount(data.participants.currentParticipantCount);
//         setParticipantGenderCount(data.participants.genderCount);

//         setWaitingMembers(waitingList);
//         setWaitingCount(data.waiting.totalCount);
//         setWaitingGenderCount(data.waiting.genderCount);
//       } catch (err) {
//         console.error("운동 상세 정보를 불러오지 못했습니다", err);
//       }
//     };

//     fetchExerciseDetail();
//   }, [exerciseId, myMemberId, yourAccessToken]);

//   const handleDeleteMember = (idx: number) => {
//     const updated = members.filter((_, i) => i !== idx);
//     setMembers(updated);
//     setParticipantsCount(updated.length);
//   };

//   return (
//     <>
//       <PageHeader title="운동 상세" />
//       <div className="flex flex-col gap-8">

//         {/* 장소 정보 */}
//         <div className="border border-[#1ABB65] rounded-xl p-4">
//           <div className="flex items-center gap-2 mb-2">
//             <Caution className="w-5 h-5" />
//             <p className="body-rg-500 truncate">{notice}</p>
//           </div>
//           <div className="flex items-start gap-2">
//             <Vector className="w-5 h-5 mt-1" />
//             <div>
//               <p className="body-rg-500">{placeName?.trim()}</p>
//               <p className="body-rg-500">{placeAddress?.trim()}</p>
//             </div>
//           </div>
//         </div>

//         {/* 참여 인원 */}
//         <div className="flex flex-col gap-2">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-2">
//               <label className="header-h5">참여 인원</label>
//               <p className="header-h5">{participantsCount}</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Female className="w-4 h-4" />
//               <p>{participantGenderCount.female}</p>
//               <Male className="w-4 h-4" />
//               <p>{participantGenderCount.male}</p>
//             </div>
//           </div>

//           {members.map((member, idx) => (
//             <div key={`participant-${idx}`}>
//               <Member
//                 {...member}
//                 number={idx + 1}
//                 onClick={() => navigate("/mypage/profile")}
//                 onDelete={() => handleDeleteMember(idx)}
//               />
//               <div className="border-t border-gray-200 mx-1" />
//             </div>
//           ))}
//         </div>

//         {/* 대기 인원 */}
//         {waitingMembers.length > 0 && (
//           <div className="flex flex-col gap-2">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <label className="header-h5">대기 인원</label>
//                 <p className="header-h5">{waitingCount}</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Female className="w-4 h-4" />
//                 <p>{waitingGenderCount.female}</p>
//                 <Male className="w-4 h-4" />
//                 <p>{waitingGenderCount.male}</p>
//               </div>
//             </div>

//             {waitingMembers.map((member, idx) => (
//               <div key={`waiting-${idx}`}>
//                 <Member
//                   {...member}
//                   number={idx + 1}
//                   onClick={() => navigate("/mypage/profile")}
//                   onDelete={() => {
//                     const updated = waitingMembers.filter((_, i) => i !== idx);
//                     setWaitingMembers(updated);
//                     setWaitingCount(updated.length);
//                   }}
//                 />
//                 <div className="border-t border-gray-200 mx-1" />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* 신청 버튼 */}
//         <Grad_GR400_L label="신청하기" onClick={() => setIsModalOpen(true)} />

//         {isModalOpen && (
//           <Modal_Apply
//             title={isApplied ? "신청이 완료되었어요!" : "운동을 신청하시겠어요?"}
//             messages={
//               isApplied
//                 ? ["'운동 상세' 페이지에서", "운동의 세부 내용들을 확인할 수 있어요."]
//                 : ["‘신청하기’를 누르시면 운동에 바로 참여됩니다.", "시간과 장소, 공지를 꼭 확인해주세요."]
//             }
//             confirmLabel={isApplied ? "운동 상세 보기" : "신청하기"}
//             onConfirm={() => {
//               if (!isApplied) {
//                 setIsApplied(true);
//               } else {
//                 console.log("운동 상세 페이지로 이동");
//                 // navigate("/exercises/detail");
//               }
//               setIsModalOpen(false);
//             }}
//             onCancel={() => setIsModalOpen(false)}
//           />
//         )}
//       </div>
//     </>
//   );
// };
