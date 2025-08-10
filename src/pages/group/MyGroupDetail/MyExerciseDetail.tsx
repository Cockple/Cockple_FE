// //운동 상세 페이지 -> 신청하기
// import { PageHeader } from "../../../components/common/system/header/PageHeader";
// import Vector from "../../../assets/icons/Vector.svg?react";
// import Caution from "../../../assets/icons/caution.svg?react";
// import Female from "../../../assets/icons/female.svg?react";
// import Male from "../../../assets/icons/male.svg?react";
// import { Member } from "../../../components/common/contentcard/Member";
// import { useNavigate, useParams } from "react-router-dom";
// import type { MemberProps } from "../../../components/common/contentcard/Member";

// import { useState, useEffect } from "react";
// import { getModalConfig } from "../../../components/group/modalConfig";
// import { SortBottomSheet } from "../../../components/common/SortBottomSheet";
// // import { getExerciseDetail, deleteParticipantMember} from "../../../api/exercise/exercises";
// // import type { ExerciseDetailResponse } from "../../../api/exercise/exercises";

// export const MyExerciseDetail = () => {
//   const { exerciseId } = useParams<{ exerciseId: string }>();
//   // const exerciseId = "1"; // 임시 테스트용

//   const navigate = useNavigate();

//   // 로딩 상태
//   const [loading, setLoading] = useState(true);
//   // 운동 상세 데이터
//   // const [detail, setDetail] = useState<ExerciseDetailResponse | null>(null);

//   // UI 상태
//   const [members, setMembers] = useState<MemberProps[]>([]);
//   const [participantsCount, setParticipantsCount] = useState(0);
//   const [waitingMembers, setWaitingMembers] = useState<MemberProps[]>([]);
//   const [waitingCount, setWaitingCount] = useState(0);

//   const [isSortOpen, setIsSortOpen] = useState(false);
//   const [sortOption, setSortOption] = useState("운동 수정하기");

//   // 현재 로그인 멤버 정보 (isMe true)
//   // const currentUser = members.find((m) => m.isMe);

//   const isCurrentUserLeader = currentUser?.isLeader;

//   // useEffect(() => {
//   //   if (!exerciseId) return;

//   //   const fetchDetail = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const data = await getExerciseDetail(Number(exerciseId));
//   //       setDetail(data);
//   //       setMembers(data.participantMembers);
//   //       setParticipantsCount(data.participantsCount);
//   //       setWaitingMembers(data.waitingMembers);
//   //       setWaitingCount(data.waitingCount);

//   //     } catch (error) {
//   //       console.error("운동 상세 조회 실패", error);
//   //       alert("운동 상세 정보를 불러오지 못했습니다.");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchDetail();
//   // }, [exerciseId]);

//   // 참여 멤버 삭제 핸들러
// // const handleDeleteMember = async (idx: number) => {
// //   const memberToDelete = members[idx];
// //   if (!memberToDelete || memberToDelete.requestId === undefined) {
// //     console.error("삭제할 멤버의 requestId가 없습니다.");
// //     return;
// //   }

// //   try {
// //     await deleteParticipantMember(Number(exerciseId), memberToDelete.requestId);

// //     const updated = members.filter((_, i) => i !== idx);
// //     setMembers(updated);
// //     setParticipantsCount(updated.length);
// //   } catch (error) {
// //     console.error("멤버 삭제 실패", error);
// //     alert("멤버 삭제에 실패했습니다.");
// //   }
// // };

//   if (loading) {
//     return <div className="text-center py-10">로딩 중...</div>;
//   }

//   // if (!detail) {
//   //   return <div className="text-center py-10 text-red-500">운동 정보를 찾을 수 없습니다.</div>;
//   // }

//   useEffect(() => {
//     console.log("useEffect 실행됨, exerciseId:", exerciseId);
//     if (!exerciseId) {
//       console.warn("exerciseId가 없습니다.");
//       return;
//     }
//     // 이하 생략
//   }, [exerciseId]);

//    return (
//     <>
//       <PageHeader title="내 운동 상세" onMoreClick={() => setIsSortOpen(true)} />

//       <div className="flex flex-col gap-8">
//         {/* 장소 정보 */}
//         <div className="mt-5 border border-[#1ABB65] rounded-xl flex flex-col gap-3 p-4 w-full">
//           <div className="flex items-center gap-2">
//             <Caution className="w-5 h-5" />
//             <p className="body-rg-500 truncate">{detail.notice}</p>
//           </div>
//           <div className="flex items-start gap-2">
//             <Vector className="w-5 h-5 mt-4" />
//             <div className="flex flex-col">
//               <p className="body-rg-500 truncate">{detail.placeName?.trim()}</p>
//               <p className="body-rg-500 truncate">{detail.placeAddress?.trim()}</p>
//             </div>
//           </div>
//         </div>

//         {/* 참여 인원 */}
//         <div className="flex flex-col">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <label className="text-left header-h5">참여 인원</label>
//               <span>
//                 {detail.participantGenderCount.male + detail.participantGenderCount.female} / {participantsCount}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Female className="w-4 h-4" />
//               <p className="body-rg-500">{detail.participantGenderCount.female}</p>
//               <Male className="w-4 h-4" />
//               <p className="body-rg-500">{detail.participantGenderCount.male}</p>
//             </div>
//           </div>
//         </div>

//         {/* 참여 멤버 리스트 */}
//         {members.map((member, idx) => {
//           const modalConfig = getModalConfig(
//             member.status,
//             isCurrentUserLeader ?? false,
//             member.isMe ?? false,
//             member.name,
//           );

//           return (
//             <div key={`participant-${idx}`}>
//               <Member
//                 {...member}
//                 number={idx + 1}
//                 position={member.position}
//                 onClick={() => navigate("/mypage/profile")}
//                 onDelete={() => handleDeleteMember(idx)}
//                 showDeleteButton={
//                   !!isCurrentUserLeader || (member.isMe && !isCurrentUserLeader)
//                 }
//                 modalConfig={modalConfig ?? undefined}
//               />
//               <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
//             </div>
//           );
//         })}

//         {/* 대기 인원 */}
//         {waitingMembers.length > 0 && (
//           <div className="flex flex-col gap-2 mt-8">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <label className="text-left header-h5">대기 인원</label>
//                 <p className="header-h5">{waitingCount}</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Female className="w-4 h-4" />
//                 <p className="body-rg-500">{detail.waitingGenderCount?.female ?? 0}</p>
//                 <Male className="w-4 h-4" />
//                 <p className="body-rg-500">{detail.waitingGenderCount?.male ?? 0}</p>
//               </div>
//             </div>

//             {waitingMembers.map((member, idx) => {
//               const modalConfig = getModalConfig(
//                 member.status,
//                 isCurrentUserLeader ?? false,
//                 member.isMe ?? false,
//                 member.name,
//               );
//               return (
//                 <div key={`waiting-${idx}`}>
//                   <Member
//                     {...member}
//                     number={idx + 1}
//                     position={member.position}
//                     onClick={() => navigate("/mypage/profile")}
//                     onDelete={() => {
//                       // 대기 멤버 삭제 처리 (로컬 UI만 업데이트)
//                       const updated = waitingMembers.filter((_, i) => i !== idx);
//                       setWaitingMembers(updated);
//                       setWaitingCount(updated.length);
//                     }}
//                     showDeleteButton={
//                       !!isCurrentUserLeader ||
//                       (member.isMe && !isCurrentUserLeader)
//                     }
//                     modalConfig={modalConfig ?? undefined}
//                   />
//                   <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <SortBottomSheet
//         isOpen={isSortOpen}
//         onClose={() => setIsSortOpen(false)}
//         selected={sortOption}
//         onSelect={(option) => setSortOption(option)}
//         options={["운동 수정하기", "운동 삭제하기"]}
//       />
//     </>
//   );
// };
// API 연결 전 코드입니다
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
import { SortBottomSheet } from "../../../components/common/SortBottomSheet";

export const MyExerciseDetail = () => {
  const navigate = useNavigate();

  // 임시 더미 데이터 (API 연결 전 테스트용)
  // const [detail, setDetail] = useState({
  //   notice: "운동 전 몸풀기 꼭 하세요!",
  //   placeName: "강남 헬스장",
  //   placeAddress: "서울시 강남구 테헤란로 123",
  //   participantGenderCount: { male: 3, female: 2 },
  //   waitingGenderCount: { male: 1, female: 0 },
  // });

  // 배포 오류 임시 코드
  const detail = {
    notice: "운동 전 몸풀기 꼭 하세요!",
    placeName: "강남 헬스장",
    placeAddress: "서울시 강남구 테헤란로 123",
    participantGenderCount: { male: 3, female: 2 },
    waitingGenderCount: { male: 1, female: 0 },
  };

  const [members, setMembers] = useState<MemberProps[]>([
    {
      requestId: 1,
      status: "Participating",
      name: "홍길동",
      gender: "MALE",
      level: "A조",
      isMe: false,
      isLeader: true,
      position: "leader",
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
    },
  ]);

  const [participantsCount, setParticipantsCount] = useState(members.length);

  const [waitingMembers, setWaitingMembers] = useState<MemberProps[]>([
    {
      requestId: 101,
      status: "waiting",
      name: "최유리",
      gender: "FEMALE",
      level: "E조",
      isMe: false,
      isLeader: false,
      position: null,
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
    },
  ]);
  const [waitingCount, setWaitingCount] = useState(waitingMembers.length);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("운동 수정하기");

  // 현재 로그인 멤버 정보 찾기
  const currentUser = members.find(m => m.isMe);
  const isCurrentUserLeader = currentUser?.isLeader ?? false;

  // 참여 멤버 삭제 (로컬 상태만)
  const handleDeleteMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
    setParticipantsCount(updated.length);
  };

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
            <Vector className="w-5 h-5 mt-4" />
            <div className="flex flex-col">
              <p className="body-rg-500 truncate">{detail.placeName?.trim()}</p>
              <p className="body-rg-500 truncate">
                {detail.placeAddress?.trim()}
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
                onClick={() => navigate("/mypage/profile")}
                onDelete={() => handleDeleteMember(idx)}
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
                    onClick={() => navigate("/mypage/profile")}
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
        onSelect={option => setSortOption(option)}
        options={["운동 수정하기", "운동 삭제하기"]}
      />
    </>
  );
};
