import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { PageHeader } from "../../components/common/system/header/PageHeader";
import Vector from "../../assets/icons/Vector.svg?react";
import Caution from "../../assets/icons/Caution.svg?react";
import Female from "../../assets/icons/female.svg?react";
import Male from "../../assets/icons/male.svg?react";

import { Member } from "../../components/common/contentcard/Member";
import type { MemberProps } from "../../components/common/contentcard/Member";

import Grad_GR400_L from "../../components/common/Btn_Static/Text/Grad_GR400_L";
import { Modal_Apply } from "../../components/group/Modal_Apply";

interface MyPageExerciseDetailPageProps {
  exerciseId: number;
  myMemberId: number;
  yourAccessToken: string; //이건 아직

  notice?: string;
  placeName?: string;
  placeAddress?: string;
}

export const MyPageExerciseDetailPage = ({
  exerciseId,
  myMemberId,
  yourAccessToken,

  notice = "명찰을 위한 신분증",
  placeName = "산성 배드민턴장",
  placeAddress = "수정로456번길 19",
}: MyPageExerciseDetailPageProps) => {
  const navigate = useNavigate();

  const [members, setMembers] = useState<MemberProps[]>([]);
  const [waitingMembers, setWaitingMembers] = useState<MemberProps[]>([]);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [participantGenderCount, setParticipantGenderCount] = useState({ male: 0, female: 0 });
  const [waitingGenderCount, setWaitingGenderCount] = useState({ male: 0, female: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const fetchExerciseDetail = async () => {
      try {
        const res = await axios.get(`https://cockple.store/api/exercises/${exerciseId}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json",
          },
        });

        const data = res.data;

        const participantList: MemberProps[] = data.participants.list.map((p: any) => ({
          status: "Participating",
          name: p.name,
          gender: p.gender,
          level: p.level,
          isGuest: !!p.guest,
          guestName: p.guest ?? undefined,
          isMe: p.memberId === myMemberId,
          isLeader: p.position === "모임장",
          imgUrl: p.imgUrl,
          position: p.position,
          canCancel: p.canCancel,
        }));

        const waitingList: MemberProps[] = data.waiting.list.map((w: any) => ({
          status: "waiting",
          name: w.name,
          gender: w.gender,
          level: w.level,
          isGuest: !!w.guest,
          guestName: w.guest ?? undefined,
          isMe: false,
          isLeader: false,
          imgUrl: w.imgUrl,
          position: w.position,
          canCancel: w.canCancel,
        }));

        setMembers(participantList);
        setParticipantsCount(data.participants.currentParticipantCount);
        setParticipantGenderCount(data.participants.genderCount);

        setWaitingMembers(waitingList);
        setWaitingCount(data.waiting.totalCount);
        setWaitingGenderCount(data.waiting.genderCount);
      } catch (err) {
        console.error("운동 상세 정보를 불러오지 못했습니다", err);
      }
    };

    fetchExerciseDetail();
  }, [exerciseId, myMemberId, yourAccessToken]);

  const handleDeleteMember = (idx: number) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
    setParticipantsCount(updated.length);
  };

  return (
    <>
      <PageHeader title="운동 상세" />
      <div className="flex flex-col gap-8">

        {/* 장소 정보 */}
        <div className="border border-[#1ABB65] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Caution className="w-5 h-5" />
            <p className="body-rg-500 truncate">{notice}</p>
          </div>
          <div className="flex items-start gap-2">
            <Vector className="w-5 h-5 mt-1" />
            <div>
              <p className="body-rg-500">{placeName?.trim()}</p>
              <p className="body-rg-500">{placeAddress?.trim()}</p>
            </div>
          </div>
        </div>

        {/* 참여 인원 */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label className="header-h5">참여 인원</label>
              <p className="header-h5">{participantsCount}</p>
            </div>
            <div className="flex items-center gap-2">
              <Female className="w-4 h-4" />
              <p>{participantGenderCount.female}</p>
              <Male className="w-4 h-4" />
              <p>{participantGenderCount.male}</p>
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
              <div className="border-t border-gray-200 mx-1" />
            </div>
          ))}
        </div>

        {/* 대기 인원 */}
        {waitingMembers.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="header-h5">대기 인원</label>
                <p className="header-h5">{waitingCount}</p>
              </div>
              <div className="flex items-center gap-2">
                <Female className="w-4 h-4" />
                <p>{waitingGenderCount.female}</p>
                <Male className="w-4 h-4" />
                <p>{waitingGenderCount.male}</p>
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
                />
                <div className="border-t border-gray-200 mx-1" />
              </div>
            ))}
          </div>
        )}

        {/* 신청 버튼 */}
        <Grad_GR400_L label="신청하기" onClick={() => setIsModalOpen(true)} />

        {isModalOpen && (
          <Modal_Apply
            title={isApplied ? "신청이 완료되었어요!" : "운동을 신청하시겠어요?"}
            messages={
              isApplied
                ? ["'운동 상세' 페이지에서", "운동의 세부 내용들을 확인할 수 있어요."]
                : ["‘신청하기’를 누르시면 운동에 바로 참여됩니다.", "시간과 장소, 공지를 꼭 확인해주세요."]
            }
            confirmLabel={isApplied ? "운동 상세 보기" : "신청하기"}
            onConfirm={() => {
              if (!isApplied) {
                setIsApplied(true);
              } else {
                console.log("운동 상세 페이지로 이동");
                // navigate("/exercises/detail");
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
