import { PageHeader } from "../../../components/common/system/header/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import Btn_Static from "../../../components/common/Btn_Static/Btn_Static";

import { useMemo, useState } from "react";
import InviteModal from "../../../components/group/groupMaking/InviteModal";
import SearchInput from "../../../components/chat/SearchInput";
import MemberCard from "../../../components/group/groupMaking/MemberCard";
import { useMemberInfinite } from "../../../api/party/useMemberInfinite";
import { useMutation } from "@tanstack/react-query";
import api from "../../../api/api";
import axiosLib from "axios";
import { useDebounce } from "../../../hooks/useDebounce";

interface ApiMember {
  userId: number;
  gender: "MALE" | "FEMALE";
  nickname: string;
  level: string;
  profileImageUrl: string | null;
  status: "invite";
}

export const GroupMember = () => {
  const navigate = useNavigate();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const paramsId = useParams();
  const partyId = Number(paramsId.partyId);

  //디바운스
  const debouncedSearch = useDebounce(search, 300);

  const { data: page, isLoading } = useMemberInfinite({
    levelSearch: debouncedSearch,
    page: 0,
    size: 10,
  });

  const submitInvite = async (userId: number) => {
    const res = await api.post(`/api/parties/${partyId}/invitations`, {
      userId,
    });
    return res.data;
  };

  const handleInviteLeave = useMutation({
    mutationFn: submitInvite,
    onSuccess: () => {
      console.log("성공");
      setIsOpenModal(false);
    },
    onError: err => {
      if (axiosLib.isAxiosError(err)) {
        if (err.response?.data?.code === "PARTY409") {
          setIsOpenModal(false);
          alert("이미 초대를 보냈습니다.");
        } else {
          console.error(err.response?.data);
        }
      }
    },
  });

  const members: ApiMember[] = page?.content || [];

  const memberList = useMemo(
    () =>
      members.map(m => ({
        id: m.userId,
        name: m.nickname,
        gender: m.gender,
        level: m.level,
        avatar: m.profileImageUrl,
        status: "invite" as const,
      })),
    [members],
  );

  const filteredMembers = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return memberList;
    return memberList.filter(m => m.level?.toLowerCase().includes(q));
  }, [memberList, debouncedSearch]);

  if (!isLoading) {
    console.log(page);
  }
  const openModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsOpenModal(true);
  };

  const handleCloseLeave = () => {
    setIsOpenModal(false);
  };

  const handleInviteConfirm = () => {
    if (selectedUserId != null) handleInviteLeave.mutate(selectedUserId);
  };

  const handleNext = () => {
    navigate(`/group/${partyId}`);
  };

  return (
    <>
      <div className="flex flex-col -mb-8 pt-14 min-h-dvh">
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
          {filteredMembers.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              onMessageClick={() => openModal(member.id)}
            />
          ))}
        </section>

        {/* 버튼 */}
        <div
          className={`flex items-center justify-center mb-6 mt-38 shrink-0 `}
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
