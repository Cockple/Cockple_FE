import { PageHeader } from "../../components/common/system/header/PageHeader";
import Vector from "../../assets/icons/Vector.svg?react";
import Caution from "../../assets/icons/Caution.svg?react";
import Female from "../../assets/icons/female.svg?react";
import Male from "../../assets/icons/male.svg?react";
import { Member } from "../../components/common/contentcard/Member";
import { useNavigate } from "react-router-dom";
import type { MemberProps } from "../../components/common/contentcard/Member";
import { useState } from "react";

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
export const MyExerciseDetail = (props: MyPageExerciseDetailPageProps) => {
 const {
    notice = "명찰을 위한 신분증",
    placeName = "산성 배드민턴장",
    placeAddress = "수정로456번길 19",
    participantsCount = 5,
    participantGenderCount = { male: 2, female: 3 },
    participantMembers = [
      { status: "Participating", name: "홍길동", gender: "male", level: "A조", isMe: true },
      { status: "Participating", name: "김민수", gender: "male", level: "B조" },
      { status: "Participating", name: "이지은", gender: "female", level: "C조" },
      { status: "Participating", name: "박서준", gender: "male", level: "D조" },
    ],

    waitingCount = 2,
    waitingGenderCount = { male: 1, female: 1 },
    waitingMembers = [
      { status: "waiting", name: "홍길동", gender: "male", level: "A조" },
      { status: "waiting", name: "김민수", gender: "male", level: "B조" },
      { status: "waiting", name: "이지은", gender: "female", level: "C조" },
      { status: "waiting", name: "박서준", gender: "male", level: "D조" },
    ],
  } = props;

  const [members, setMembers] = useState<MemberProps[]>(participantMembers);
  const [waiting, setWaiting] = useState<MemberProps[]>(waitingMembers);
  
  const [participantsCountState, setParticipantsCount] = useState(participantsCount);
  const [waitingCountState, setWaitingCount] = useState(waitingCount);


  // 참여 멤버 삭제 함수
  const handleDeleteMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
    setParticipantsCount(updated.length);
  };

  // 대기 멤버 삭제 함수
  const handleDeleteWaiting = (idx: number) => {
    const updated = waiting.filter((_, i) => i !== idx);
    setWaiting(updated);
    setWaitingCount(updated.length);
  };


const navigate = useNavigate();
  return (
    <>
      <PageHeader title="내 운동 상세" />
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
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
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


        {members.map((member, idx) => (
          <div key={`participant-${idx}`}>
            <Member
              {...member}
              number={idx + 1}
              onClick={() => navigate("/mypage/profile")}
              onDelete={() => handleDeleteMember(idx)}
            />
            <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
          </div>
        ))}




        {/* 대기 인원 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-left header-h5">대기 인원</label>
              <p className="header-h5">{waitingCount}</p>
            </div>
            <div className="flex items-center gap-2">
              <Female className="w-4 h-4" />
              <p className="body-rg-500">{waitingGenderCount.female}</p>
              <Male className="w-4 h-4" />
              <p className="body-rg-500">{waitingGenderCount.male}</p>
            </div>
          </div>
        </div>
        
        {waiting.map((member, idx) => (
          <div key={`waiting-${idx}`}>
            <Member
              {...member}
              number={idx + 1}
              onClick={() => navigate("/mypage/profile")}
              onDelete={() => handleDeleteWaiting(idx)}
            />
            <div className="border-t-[#E4E7EA] border-t-[0.0625rem] mx-1" />
          </div>
        ))}

      </div>
    </>
  );
};
