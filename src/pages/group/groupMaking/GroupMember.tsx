import { PageHeader } from "../../../components/common/system/header/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import Btn_Static from "../../../components/common/Btn_Static/Btn_Static";

import { useState } from "react";
import InviteModal from "../../../components/group/groupMaking/InviteModal";
import SearchInput from "../../../components/chat/SearchInput";
import MemberCard from "../../../components/group/groupMaking/MemberCard";
import { useMemberInfinite } from "../../../api/party/useMemberInfinite";
import { useMutation } from "@tanstack/react-query";
import api from "../../../api/api";

interface ApiMember {
  userId: number;
  gender: "MALE" | "FEMALE";
  nickname: string;
  level: string;
  profileImageUrl: string | null;
  status: "waiting";
}

export const GroupMember = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(`/group/${partyId}`); //임시 하드코딩
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const paramsId = useParams();
  const partyId = Number(paramsId.partyId);
  console.log(partyId);
  const openModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsOpenModal(true);
  };

  const axios = api;

  const handleCloseLeave = () => {
    setIsOpenModal(false);
  };
  const [search, setSearch] = useState("");

  const { data: page, isLoading } = useMemberInfinite({
    levelSearch: search,
    page: 0,
    size: 10,
  });

  const submitInvite = async (userId: number) => {
    const res = await axios.post(`/api/parties/${partyId}/invitations`, {
      userId,
    });
    return res.data;
  };

  const handleInviteConfirm = () => {
    if (selectedUserId != null) handleInviteLeave.mutate(selectedUserId);
  };

  const handleInviteLeave = useMutation({
    mutationFn: submitInvite,
    onSuccess: () => {
      console.log("성공");
      setIsOpenModal(false);
    },
    onError: err => {
      console.log(err);
    },
  });

  const members: ApiMember[] = page?.content || [];

  const mamberList = members.map(member => ({
    id: member.userId,
    name: member.nickname,
    gender: member.gender,
    level: member.level,
    avatar: member.profileImageUrl,
    status: "waiting",
  }));

  const filteredMembers = mamberList.filter(member =>
    member.level.includes(search.trim()),
  );

  if (!isLoading) {
    console.log(page);
  }

  //--------------데이터 보고싶으면 partyId를 23로 하드코딩 하세요!!!----------
  return (
    <>
      <div className="flex flex-col -mb-8" style={{ minHeight: "91dvh" }}>
        <PageHeader title="신규 멤버 추천" />
        <section className="text-left flex flex-col  gap-5 w-full mb-6 flex-1">
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
                onMessageClick={() => openModal(member.id)}
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
            label="만든 모임 보러가기"
            kind="GR400"
            size="L"
            initialStatus={"default"}
          />
        </div>
        {isOpenModal && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <InviteModal
              onInvite={handleInviteConfirm}
              onClose={handleCloseLeave}
            />
          </div>
        )}
      </div>
    </>
  );
};
