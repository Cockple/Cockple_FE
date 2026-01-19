//신규 멤버 초대 화면
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
  const debouncedSearch = useDebounce(search, 200);

  const { data: page, isLoading } = useMemberInfinite({
    levelSearch: debouncedSearch,
    page: 0,
    size: 10,
  });

  //임시 데이터
  const MOCK_MEMBERS: ApiMember[] = Array.from({ length: 10 }, (_, index) => ({
    userId: 1000 + index,
    nickname: `게스트 ${index + 1}`,
    gender: index % 2 === 0 ? "MALE" : "FEMALE",
    level: ["초심자", "D조", "C조", "B조", "A조"][index % 5],
    profileImageUrl: null,
    status: "invite",
  }));

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

  const members: ApiMember[] = page?.content?.length ? page.content : MOCK_MEMBERS;

  const memberList = useMemo(
    () =>
      members.map(member => ({
        id: member.userId,
        name: member.nickname,
        gender: member.gender,
        level: member.level,
        avatar: member.profileImageUrl,
        status: "invite" as const,
      })),
    [members],
  );
  if (!isLoading) {

    console.log(page);

  }
  const filteredMembers = useMemo(() => {
    const filterText = debouncedSearch.trim().toLowerCase();
    if (!filterText) return memberList;
    return memberList.filter(member =>
      member.level?.toLowerCase().includes(filterText),
    );
  }, [memberList, debouncedSearch]);

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
      <div className="flex flex-col -mb-8 pt-14 min-h-dvh relative">
        <PageHeader title="신규 멤버 추천" />
        
        {/* 🌟 1. 리스트 영역에 하단 패딩(pb-24) 추가 
             버튼이 Fixed로 뜨기 때문에 리스트 끝부분이 가려지지 않게 여백 확보 */}
        <section className="text-left flex flex-col gap-5 w-full mb-6 flex-1 pb-24">
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

        {/* 🌟 2. 버튼 Fixed 적용 */}
        <div
          className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[444px] px-4 pb-8 pt-4 z-10"
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