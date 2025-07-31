import { PageHeader } from "../../../components/common/system/header/PageHeader";
import { useNavigate } from "react-router-dom";
import Btn_Static from "../../../components/common/Btn_Static/Btn_Static";

import { useState } from "react";
import InviteModal from "../../../components/group/groupMaking/InviteModal";
import SearchInput from "../../../components/chat/SearchInput";
import MemberCard from "../../../components/group/groupMaking/MemberCard";

type MemberStatus =
  | "waiting"
  | "invite"
  | "request"
  | "approved"
  | "Participating";

interface MemberProps {
  name: string;
  gender: "male" | "female";
  level: string;
  birth?: string;
  status: MemberStatus;
}

const members: MemberProps[] = [
  {
    name: "누구겡",
    gender: "male",
    level: "D조",
    status: "approved",
  },
  {
    name: "누구겡",
    gender: "female",
    level: "C조",
    status: "approved",
  },
  {
    name: "누구겡",
    gender: "male",
    level: "B조",
    status: "approved",
  },
  {
    name: "누구겡",
    gender: "male",
    level: "초급",
    status: "approved",
  },
];

export const GroupMember = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/group/1"); //임시 하드코딩
  };

  const [isOpenModal, setIsOpenModal] = useState(false);

  const openModal = () => {
    setIsOpenModal(true);
  };

  const handleInviteLeave = () => {
    setIsOpenModal(false);
  };

  const handleCloseLeave = () => {
    setIsOpenModal(false);
  };
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter(member =>
    member.level.includes(search.trim()),
  );

  return (
    <>
      <div className="flex flex-col -mb-8">
        <PageHeader title="신규 멤버 추천" />
        <section className="text-left flex flex-col  gap-5 w-full mb-6 min-h-80">
          {/* 첫번째 */}
          <div className="mt-4">
            <SearchInput
              placeholder="급수로 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* 두번째 */}
          <div>
            {filteredMembers.map((member, idx) => (
              <MemberCard
                key={idx}
                member={member}
                onMessageClick={openModal}
              />
            ))}
          </div>
        </section>

        {/* 버튼 */}
        <div
          className={`flex items-center justify-center mb-4 mt-38 shrink-0 `}
          onClick={handleNext}
        >
          <Btn_Static
            label="다음"
            kind="GR400"
            size="L"
            initialStatus={"default"}
          />
        </div>
        {isOpenModal && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <InviteModal
              onInvite={handleInviteLeave}
              onClose={handleCloseLeave}
            />
          </div>
        )}
      </div>
    </>
  );
};
