import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FloatingButton } from "../../common/system/FloatingButton";
import PlusIcon from "@/assets/icons/add_white.svg?url";

interface GroupOwnerActionsProps {
  groupId: string;
  requestCount: number;
}

export const GroupOwnerActions = ({
  groupId,
  requestCount,
}: GroupOwnerActionsProps) => {
  const [plusModalOpen, setPlusModalOpen] = useState(false);
  const [rightOffset, setRightOffset] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        plusModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setPlusModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [plusModalOpen]);

  useEffect(() => {
    const updateOffset = () => {
      const screenWidth = window.innerWidth;
      const contentWidth = Math.min(screenWidth, 444);
      const offset = (screenWidth - contentWidth) / 2 + 16;
      setRightOffset(offset);
    };
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  return (
    <>
      {plusModalOpen && (
        <div
          ref={modalRef}
          className="fixed z-[60] w-39 bg-white border-soft shadow-ds400 flex flex-col p-1"
          style={{ right: rightOffset, bottom: "6rem" }}
        >
          <div
            className="w-full px-2 pt-1.5 pb-2.5 border-b-1 border-gy-200 body-rg-400 flex items-center"
            onClick={() => navigate(`/group/exercise/${groupId}/create`)}
          >
            운동 만들기
          </div>
          <div
            className="w-full px-2 pt-1.5 pb-2.5 border-b-1 border-gy-200 body-rg-400 flex items-center"
            onClick={() => navigate(`/group/making/member/${groupId}`)}
          >
            신규 멤버 초대하기
          </div>
          <div
            className="w-full px-2 pt-1.5 pb-2.5 flex items-center justify-between body-rg-400"
            onClick={() => navigate("member-request")}
          >
            <span>멤버 신청 관리</span>
            {requestCount > 0 && (
              <span className="ml-2 rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                {requestCount > 99 ? "99+" : requestCount}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="fixed z-50 bottom-8" style={{ right: rightOffset }}>
        <div className="relative">
          <FloatingButton
            size="L"
            color="green"
            icon={PlusIcon}
            onClick={() => setPlusModalOpen(true)}
          />
          {requestCount > 0 && (
            <div className="absolute -top-1 -right-1">
              <span className="rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                {requestCount > 99 ? "99+" : requestCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
