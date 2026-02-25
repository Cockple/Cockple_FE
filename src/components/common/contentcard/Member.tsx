import ProfileImage from "@/assets/icons/ProfileImage.svg?react";
import Prohibition from "@/assets/icons/prohibition.svg?react";
import StarIcon from "@/assets/icons/star_filled_GR.svg?react";
import YEStarIcon from "@/assets/icons/star_filled_YE.svg?react";
import Star from "@/assets/icons/star.svg?react";
import Female from "@/assets/icons/female.svg?react";
import Male from "@/assets/icons/male.svg?react";
import Message from "@/assets/icons/message.svg?react";
import InviteModal from "../../../components/group/groupMaking/InviteModal";
import { Modal_Subtract } from "../../group/Modal_Subtract";
import { useState } from "react";
import type { ModalConfig } from "../../group/modalConfig";
import { getModalConfig } from "../../group/modalConfig";

type MemberStatus =
  | "Participating"
  | "waiting"
  | "invite"
  | "request"
  | "approved";

interface MemberProps {
  participantId?: number; // 참여자 Id
  memberId?: number; // 고유 Id
  requestId?: number; // joinRequestId를 매핑
  status: MemberStatus;
  name: string;
  gender: "MALE" | "FEMALE";
  level: string;
  lastExerciseDate?: string;
  birth?: string;
  showStar?: boolean;
  isGuest?: boolean;
  guestNumber?: boolean;
  guestName?: string;
  number?: number | string;
  isMe?: boolean;
  isLeader?: boolean;
  isManager?: boolean;
  inviterName?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onClick?: () => void;
  onDelete?: () => void;
  imgUrl?: string | null;
  position?: string | null;
  canCancel?: boolean;
  //모달창 나오는 글 화면에 따라 다르게 나오게
  showDeleteButton?: boolean;
  modalConfig?: {
    title: string;
    messages: string[];
    confirmLabel: string;
    onConfirm?: () => void;
  };
  //부모임장 지정
  onAppointClick?: () => void;
  selectMode?: boolean;
  useDeleteModal?: boolean;
  hideNumber?: boolean;
}

export type { MemberProps };

// 프로필 이미지 렌더링
const Avatar = ({ imgUrl, name }: { imgUrl?: string | null; name: string }) => {
  if (imgUrl) {
    return <img src={imgUrl} alt={`${name} 프로필`} className="w-[2.5rem] h-[2.5rem] rounded-full object-cover" />;
  }
  return <ProfileImage className="w-[2.5rem] h-[2.5rem]" />;
};

const MemberInfo = ({ name, gender, level, lastExerciseDate, isGuest, guestName, isLeader, position }: Partial<MemberProps>) => {
  const formattedDate = lastExerciseDate?.replace(/-/g, ".");

  return (
    <div className="flex flex-col justify-center gap-[0.25rem] h-[2.75rem]">
      <div className="flex items-center gap-1">
        <p className="header-h5 text-black">{name}</p>
        {isLeader && <StarIcon className="w-[1rem] h-[1rem]" />}
        {!isLeader && position === "sub_leader" && <YEStarIcon className="w-[1rem] h-[1rem]" />}
      </div>
      <div className="flex items-center gap-[0.25rem] body-sm-500">
        {gender === "FEMALE" ? <Female className="w-[1rem] h-[1rem]" /> : <Male className="w-[1rem] h-[1rem]" />}
        <p className="whitespace-nowrap">{level}</p>

        {formattedDate && (
          <>
            <span className="text-[#D6DAE0]">|</span>
            <p className="text-[#767B89] whitespace-nowrap">마지막 운동일 {formattedDate}</p>
          </>
        )}

        {isGuest && (
          <>
            <span className="text-[#D6DAE0]">|</span>
            <p className="text-[#D6DAE0] whitespace-nowrap">{guestName} 게스트</p>
          </>
        )}
      </div>
    </div>
  );
};

// Participating, waiting 
const ListMemberLayout = ({ props, onShowDeleteModal }: { props: MemberProps; onShowDeleteModal: () => void }) => {
  const { status, number, guestNumber, hideNumber, selectMode, isLeader, showDeleteButton, onClick, onAppointClick, useDeleteModal, onDelete } = props;

  const getNumberText = () => {
    if (guestNumber) return number;
    return status === "Participating" ? `No.${number}` : `대기.${number}`;
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    useDeleteModal ? onShowDeleteModal() : onDelete?.();
  };

  return (
    <div className="w-full h-[4.75rem] bg-white rounded-[1rem] px-4 py-2 flex items-center gap-3" onClick={onClick}>
      {!hideNumber && <p className="body-md-500 whitespace-nowrap">{getNumberText()}</p>}
      <Avatar imgUrl={props.imgUrl} name={props.name} />
      <MemberInfo {...props} />
      
      {selectMode && !isLeader && (
        <Star className="w-6 h-6 ml-auto cursor-pointer" onClick={(e) => { e.stopPropagation(); onAppointClick?.(); }} />
      )}
      {showDeleteButton && (
        <Prohibition className="w-[2rem] h-[2rem] ml-auto cursor-pointer" onClick={handleDeleteClick} />
      )}
    </div>
  );
};

// Invite 
const InviteMemberLayout = ({ props }: { props: MemberProps }) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  return (
    <div className="w-[21.44rem] h-[4.75rem] bg-white rounded-[1rem] px-4 py-2 flex items-center gap-3">
      <Avatar imgUrl={props.imgUrl} name={props.name} />
      <MemberInfo {...props} />
      <Message 
        className="w-[2rem] h-[2rem] ml-auto cursor-pointer" 
        onClick={(e) => { e.stopPropagation(); setIsApplyModalOpen(true); }} 
      />
      {isApplyModalOpen && (
        <InviteModal onInvite={() => setIsApplyModalOpen(false)} onClose={() => setIsApplyModalOpen(false)} />
      )}
    </div>
  );
};

// Request, Approved 
const RequestApprovalLayout = ({ props }: { props: MemberProps }) => {
  const isApproved = props.status === "approved";

  return (
    <div className="w-[21.44rem] h-[7.5rem] rounded-[1rem] bg-white p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Avatar imgUrl={props.imgUrl} name={props.name} />
        <div className="flex flex-col justify-center gap-[0.25rem] w-[15.44rem] h-[2.75rem]">
          <p className="header-h5 text-black">{props.name}</p>
          <div className="flex justify-between items-center w-full body-sm-500 text-[#767B89]">
            <div className="flex items-center gap-[0.25rem]">
              {props.gender === "FEMALE" ? <Female className="w-[1rem] h-[1rem]" /> : <Male className="w-[1rem] h-[1rem]" />}
              <p className="whitespace-nowrap">{props.level}</p>
            </div>
            <p className="whitespace-nowrap">{props.birth}</p>
          </div>
        </div>
      </div>
      
      {/* 상태에 따라 버튼 스타일과 동작 분기 */}
      <div className="flex items-center gap-2 body-sm-500">
        <button
          className={`w-[9.47rem] h-[2rem] px-3 py-1 rounded-lg border ${isApproved ? 'border-[#C0C4CD] text-[#C0C4CD]' : 'border-[#F62D2D] text-[#F62D2D]'}`}
          onClick={!isApproved ? props.onReject : undefined}
        >
          거절
        </button>
        <button
          className={`w-[9.47rem] h-[2rem] px-3 py-1 rounded-lg text-white ${isApproved ? 'bg-[#C0C4CD]' : 'bg-[#0B9A4E]'}`}
          onClick={!isApproved ? props.onAccept : undefined}
        >
          {isApproved ? `${props.birth} 승인 완료` : '수락'}
        </button>
      </div>
    </div>
  );
};


export const Member = (props: MemberProps & { modalConfig?: ModalConfig }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const modalConfig = props.modalConfig ?? getModalConfig(props.status, props.isLeader ?? false, props.isMe ?? false, props.name);

  const handleConfirm = () => {
    modalConfig?.onConfirm ? modalConfig.onConfirm() : props.onDelete?.();
    setIsModalOpen(false);
  };

  const renderContent = () => {
    switch (props.status) {
      case "Participating":
      case "waiting":
        return (
          <div className="relative">
            <ListMemberLayout props={props} onShowDeleteModal={() => setIsModalOpen(true)} />
            {isModalOpen && modalConfig && (
              <Modal_Subtract
                title={modalConfig.title}
                messages={modalConfig.messages}
                confirmLabel={modalConfig.confirmLabel}
                onCancel={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
              />
            )}
          </div>
        );
      case "invite":
        return <InviteMemberLayout props={props} />;
      case "request":
      case "approved":
        return <RequestApprovalLayout props={props} />;
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};