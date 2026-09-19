import { ChatOwnerWithDrawnModal } from "@/components/chat/ChatOwnerWithDrawanModal";
import { ModalLeave } from "@/components/MyPage/Modal_Leave";
import { useState } from "react";

interface ModalContainerProp {
  onClose: () => void;
}

export const ModalContainer = ({ onClose }: ModalContainerProp) => {
  //const [leaveOpen, setLeaveOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [ownerName, setOwnerName] = useState("");

  const openOwnerModal = (name: string) => {
    setOwnerName(name);
    //setLeaveOpen(false);
    setOwnerOpen(true);
  };

  return (
    <>
      {!ownerOpen && (
        <div className="-ml-[11px]">
          <ModalLeave onClose={onClose} onOwnerError={openOwnerModal} />
        </div>
      )}
      {ownerOpen && (
        <div className="-ml-[11px]">
          <ChatOwnerWithDrawnModal
            owner={ownerName}
            onClose={() => {
              setOwnerOpen(false);
              onClose();
            }}
          />
        </div>
      )}
    </>
  );
};
