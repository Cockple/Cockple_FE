import ProfileImage from "../../../assets/icons/ProfileImage.svg?react";
import Prohibition from "../../../assets/icons/prohibition.svg?react";
import StarIcon  from "../../../assets/icons/star_filled_GR.svg?react";
import Female from "../../../assets/icons/female.svg?react";
import Male from "../../../assets/icons/male.svg?react";
import Message from "../../../assets/icons/message.svg?react";
import { Modal_Subtract_Leader } from "../../MyPage/Modal_Subtract_Leader";
import { useState } from "react";

type MemberStatus = "Participating" | "waiting" | "invite" | "request" | "approved";

interface MemberProps {
  status: MemberStatus;
  name: string;
  gender: "male" | "female";
  level: string;
  birth?: string;
  showStar?: boolean;
  isGuest?: boolean;
  guestName?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onClick?: () => void;
  onDelete?: () => void;
}

export type { MemberProps };  

const MemberInfo = ({
  name,
  gender,
  level,
  isGuest = false,
  guestName,
  showStar = false,
}: {
  name: string;
  gender: "male" | "female";
  level: string;
  isGuest?: boolean;
  guestName?: string;
  showStar?: boolean;

}) => {
  return (
    <div className="flex flex-col justify-center gap-[0.25rem] w-[9.75rem] h-[2.75rem]">
      <div className="flex items-center gap-1">
        <p className="header-h5 text-black">{name}</p>
        {showStar && <StarIcon className="w-[1rem] h-[1rem]" />}
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
  onAccept,
  onReject,
  onClick,
  onDelete, 
}: MemberProps) => {
  //모달창 ->  서버장일때에만 가능하도록 수정
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderContent = () => {
    switch (status) {
      case "Participating":
        return (

          <div className="relative">
            <div
              className="w-[21.44rem] h-[4.75rem] bg-white rounded-[1rem] px-4 py-2 flex items-center gap-3"
              onClick={onClick}
            >
              <p className="body-md-500">No. 00</p>
              <ProfileImage className="w-[2.5rem] h-[2.5rem]" />
              <MemberInfo {...{ name, gender, level, showStar, isGuest, guestName }} />
              <Prohibition
                className="w-[2rem] h-[2rem] ml-auto cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              />
            </div>

            {isModalOpen && (
              <div className="absolute z-50 top-[5rem] left-1/2 -translate-x-1/2">
                <Modal_Subtract_Leader
                  onClose={() => setIsModalOpen(false)}
                  onConfirm={() => {
                    setIsModalOpen(false);
                    onDelete?.(); // 삭제
                  }}
                />
              </div>
            )}
          </div>
        );

      case "waiting":
        return (
          <div className="w-[21.44rem] h-[4.75rem] bg-white rounded-[1rem] px-4 py-2 flex items-center gap-3">
            <p className="body-md-500">대기00</p>
            <ProfileImage className="w-[2.5rem] h-[2.5rem]" />
            <MemberInfo {...{ name, gender, level, isGuest }} />
            <Prohibition className="w-[2rem] h-[2rem] ml-auto" />
          </div>
        );

      case "invite":
        return (
          <div className="w-[21.44rem] h-[4.75rem] bg-white rounded-[1rem] px-4 py-2 flex items-center gap-3">
            <ProfileImage className="w-[2.5rem] h-[2.5rem]" />
            <MemberInfo {...{ name, gender, level }} />
            <Message className="w-[2rem] h-[2rem] ml-auto" />
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
                    <Female className="w-[1rem] h-[1rem]" />
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
                    <Female className="w-[1rem] h-[1rem]" />
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
