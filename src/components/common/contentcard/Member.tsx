import ProfileImage from "../../../assets/icons/ProfileImage.svg?react";
import Prohibition from "../../../assets/icons/prohibition.svg?react";
import StarIcon from "../../../assets/icons/star_filled_GR.svg?react";
import YEStarIcon from "../../../assets/icons/star_filled_YE.svg?react";
import Star from "../../../assets/icons/star.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import Message from "../../../assets/icons/message.svg?react";
import { Modal_Invite } from "../../group/Modal_Invite";

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
  requestId: number; // joinRequestId를 매핑
  status: MemberStatus;
  name: string;
  gender: "male" | "female";
  level: string;
  birth?: string;
  showStar?: boolean;
  isGuest?: boolean;
  guestName?: string;
  number?: number;
  isMe?: boolean;
  isLeader?: boolean;

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
}

export type { MemberProps };

const MemberInfo = ({
  name,
  gender,
  level,
  isGuest,
  guestName,
  // showStar,
  isLeader,
  position,
}: {
  name: string;
  gender: "male" | "female";
  level: string;
  isGuest?: boolean;
  guestName?: string;
  showStar?: boolean;
  isLeader?: boolean;
  position?: string | null;
}) => {
  return (
    <div className="flex flex-col justify-center gap-[0.25rem] w-[9.75rem] h-[2.75rem]">
      <div className="flex items-center gap-1">
        <p className="header-h5 text-black">{name}</p>
        {isLeader && <StarIcon className="w-[1rem] h-[1rem]" />}
        {!isLeader && position === "sub_leader" && (
          <YEStarIcon className="w-[1rem] h-[1rem]" />
        )}
      </div>
      <div className="flex items-center gap-[0.25rem] body-sm-500">
        {gender === "female" ? (
          <Female className="w-[1rem] h-[1rem]" />
        ) : (
          <Male className="w-[1rem] h-[1rem]" />
        )}
        <p className="whitespace-nowrap">{level}</p>
        {isGuest && (
          <>
            <span className="text-[#D6DAE0]">|</span>
            <p className="truncate overflow-hidden whitespace-nowrap max-w-[5rem]">
              {guestName}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export const Member = ({
  status,
  name,
  gender,
  level,
  birth,
  showStar,
  isGuest,
  guestName,
  number,
  onAccept,
  onReject,
  onClick,
  onDelete,
  useDeleteModal = true,
  isMe = false,
  isLeader = false,
  position = null,
  showDeleteButton = false,
  modalConfig: propModalConfig,
  //부모임장 선택시
  selectMode,
  onAppointClick,
}: MemberProps & { modalConfig?: ModalConfig }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const modalConfig =
    propModalConfig ?? getModalConfig(status, isLeader, isMe, name);

  const handleConfirm = () => {
    if (modalConfig?.onConfirm) {
      modalConfig.onConfirm();
    } else {
      onDelete?.();
    }
    setIsModalOpen(false);
  };

  const renderModal = () => {
    if (!isModalOpen || !modalConfig) return null;

    return (
      <Modal_Subtract
        title={modalConfig.title}
        messages={modalConfig.messages}
        confirmLabel={modalConfig.confirmLabel}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    );
  };
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (useDeleteModal) {
      setIsModalOpen(true);
    } else {
      onDelete?.();
    }
    console.log("삭제 버튼 클릭됨, 모달 상태:", true);
  };
  const renderContent = () => {
    switch (status) {
      case "Participating":
      case "waiting":
        return (
          <div className="relative">
            <div
              className="w-[21.44rem] h-[4.75rem] bg-white rounded-[1rem] px-4 py-2 flex items-center gap-3"
              onClick={onClick}
            >
              <p className="body-md-500">
                No. {number?.toString().padStart(2, "0")}
              </p>
              <ProfileImage className="w-[2.5rem] h-[2.5rem]" />
              <MemberInfo
                name={name}
                gender={gender}
                level={level}
                isGuest={isGuest}
                guestName={guestName}
                showStar={showStar}
                isLeader={isLeader}
                position={position ?? null}
              />
              {selectMode && !isLeader && (
                <Star
                  className="w-6 h-6 ml-auto cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    onAppointClick?.();
                  }}
                />
              )}
              {showDeleteButton && (
                <Prohibition
                  className="w-[2rem] h-[2rem] ml-auto cursor-pointer"
                  onClick={handleDeleteClick}
                />
              )}
            </div>
            {renderModal()}
          </div>
        );

      case "invite":
        return (
          <div className="w-[21.44rem] h-[4.75rem] bg-white rounded-[1rem] px-4 py-2 flex items-center gap-3">
            <ProfileImage className="w-[2.5rem] h-[2.5rem]" />
            <MemberInfo {...{ name, gender, level }} />
            <Message
              className="w-[2rem] h-[2rem] ml-auto cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                setIsApplyModalOpen(true);
                console.log("삭제 버튼 클릭됨, 모달 상태:", true);
              }}
            />
            {isApplyModalOpen && (
              <Modal_Invite
                onConfirm={() => {
                  setIsApplyModalOpen(false);
                }}
                onCancel={() => {
                  setIsApplyModalOpen(false);
                }}
              />
            )}
          </div>
        );

      case "request":
        return (
          <div className="w-[21.44rem] h-[7.5rem] rounded-[1rem] bg-white p-4 space-y-3">
            <div className="flex items-center gap-3">
              <ProfileImage className="w-[2.5rem] h-[2.5rem]" />
              <div className="flex flex-col justify-center gap-[0.25rem] w-[15.44rem] h-[2.75rem]">
                <div className="flex items-center gap-1">
                  <p className="header-h5 text-black">{name}</p>
                </div>
                <div className="flex justify-between items-center w-full body-sm-500 text-[#767B89]">
                  <div className="flex items-center gap-[0.25rem]">
                    {gender === "female" ? (
                      <Female className="w-[1rem] h-[1rem]" />
                    ) : (
                      <Male className="w-[1rem] h-[1rem]" />
                    )}
                    <p className="whitespace-nowrap">{level}</p>
                  </div>
                  <p className="whitespace-nowrap">{birth}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 body-sm-500">
              <button
                className="w-[9.47rem] h-[2rem] px-3 py-1 rounded-lg border border-[#F62D2D] text-[#F62D2D]"
                onClick={onReject}
              >
                거절
              </button>
              <button
                className="w-[9.47rem] h-[2rem] px-3 py-1 rounded-lg bg-[#0B9A4E] text-white"
                onClick={onAccept}
              >
                수락
              </button>
            </div>
          </div>
        );

      case "approved":
        return (
          <div className="w-[21.44rem] h-[7.5rem] rounded-[1rem] bg-white p-4 space-y-3">
            <div className="flex items-center gap-3">
              <ProfileImage className="w-[2.5rem] h-[2.5rem]" />
              <div className="flex flex-col justify-center gap-[0.25rem] w-[15.44rem] h-[2.75rem]">
                <div className="flex items-center gap-1">
                  <p className="header-h5 text-black">{name}</p>
                </div>
                <div className="flex justify-between items-center w-full body-sm-500 text-[#767B89]">
                  <div className="flex items-center gap-[0.25rem]">
                    {gender === "female" ? (
                      <Female className="w-[1rem] h-[1rem]" />
                    ) : (
                      <Male className="w-[1rem] h-[1rem]" />
                    )}
                    <p className="whitespace-nowrap">{level}</p>
                  </div>
                  <p className="whitespace-nowrap">{birth}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 body-sm-500">
              <button className="w-[9.47rem] h-[2rem] px-3 py-1 rounded-lg border border-[#C0C4CD] text-[#C0C4CD]">
                거절
              </button>
              <button className="w-[9.47rem] h-[2rem] px-3 py-1 rounded-lg bg-[#C0C4CD] text-white">
                {birth} 승인 완료
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};
