import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/system/header/PageHeader";
import TabSelector from "../components/common/TabSelector";
import { useEffect, useState } from "react";
import { useGroupNameStore } from "../store/useGroupNameStore";
import { SortBottomSheet } from "../components/common/SortBottomSheet";
import { deleteParty } from "../api/party/patchParties";
import { Modal_Del } from "../components/group/Modal_Del";
import api from "../api/api";
import { usePartyDetail } from "../api/exercise/getpartyDetail";
import { getJoinParty } from "../api/party/getJoinParty";
import Grad_Mix_L from "../components/common/Btn_Static/Text/Grad_Mix_L";
import { Modal_Join } from "../components/group/Modal_Join";
import axios, { AxiosError } from "axios";

const options = [
  { label: "홈", value: "" },
  { label: "채팅", value: "chat" },
  { label: "캘린더", value: "calendar" },
  { label: "멤버", value: "member" },
];

export const GroupLayout = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const location = useLocation();
  const [select, setSelect] = useState("");
  const { groupName } = useGroupNameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [joinErrorMessage, setJoinErrorMessage] = useState("");

  //////////////////////////////////////////////////////////////////////////////
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await deleteParty(Number(groupId));
      if (res.success) {
        alert("모임이 삭제(비활성화)되었습니다.");
        navigate("/group");
      } else {
        alert(res.message || "삭제에 실패했습니다.");
      }
    } catch (err: any) {
      alert(err.message || "서버 오류가 발생했습니다.");
    } finally {
      setIsDelModalOpen(false);
    }
  };

  const handleSetSubLeader = () => {
    setIsMoreOpen(false);
    navigate(`/group/admin/vice-leader`);
  };

  const handleEditGroup = () => {
    setIsMoreOpen(false);
    navigate(`/group/admin/edit-info/${groupId}`);
  };
  //////////////////////////////////////////////////////////////////////////////

  const returnParam = new URLSearchParams(location.search).get("return");

  useEffect(() => {
    const currentPath = location.pathname.split(`/group/${groupId}/`)[1] ?? "";
    setSelect(currentPath);
  }, [groupId, location.pathname]);

  const handleChange = (value: string) => {
    setSelect(value);
    navigate(`/group/${groupId}/${value}`);
  };

  const handleBackClick = () => {
    if (returnParam) {
      navigate(returnParam);
    } else {
      navigate("/group");
    }
  };

  // 모입가입하기 버튼 관련
  const { data: partyDetail } = usePartyDetail(Number(groupId));
  const [hasPending, setHasPending] = useState(
    partyDetail?.hasPendingJoinRequest ?? false,
  );

  useEffect(() => {
    if (partyDetail?.hasPendingJoinRequest !== undefined) {
      setHasPending(partyDetail.hasPendingJoinRequest);
    }
  }, [partyDetail?.hasPendingJoinRequest]);

  const onClickJoin = async () => {
    try {
      if (groupId) {
        await getJoinParty(Number(groupId));
        setHasPending(true);
        setIsApplied(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;

        const errorMessage =
          axiosError.response?.data?.message || "모입 가입에 실패했습니다.";

        setJoinErrorMessage(errorMessage);
        setIsModalOpen(false);
      }

      console.error("운동 생성 실패: ", err);
    }
  };

  const onClickChat = async () => {
    try {
      const { data } = await api.post("/api/chats/direct", null, {
        params: {
          targetMemberId: partyDetail?.ownerId,
        },
      });

      navigate(`/chat/personal/${data.data.chatRoomId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const isJoined = partyDetail?.memberStatus === "MEMBER";
  const isOwner =
    partyDetail?.memberRole === "party_MANAGER" ||
    partyDetail?.memberRole === "party_SUBMANAGER";

  return (
    <div className="flex flex-col">
      <PageHeader
        title={groupName}
        onBackClick={handleBackClick}
        onMoreClick={isOwner ? () => setIsMoreOpen(true) : undefined}
      />

      <TabSelector
        options={options}
        selected={select}
        onChange={handleChange}
      />

      <div className="pt-14">
        <Outlet />
      </div>

      {/* 모임 옵션 BottomSheet */}
      <SortBottomSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        selected=""
        options={["모임 삭제하기", "부모임 설정하기", "모임 정보 수정하기"]}
        onSelect={label => {
          if (label === "모임 삭제하기") {
            setIsMoreOpen(false);
            setIsDelModalOpen(true);
          }
          if (label === "부모임 설정하기") handleSetSubLeader();
          if (label === "모임 정보 수정하기") handleEditGroup();
        }}
      />

      {!isJoined && (
        <div className="flex flex-col fixed bottom-0 left-1/2 -translate-x-1/2 px-4 z-50">
          {joinErrorMessage && (
            <p className="text-red-500 mt-4 text-xs w-full text-left ml-8">
              {joinErrorMessage}
            </p>
          )}
          <Grad_Mix_L
            type="chat_question"
            label="모임 가입하기"
            onClick={() => setIsModalOpen(true)}
            onImageClick={onClickChat}
            initialStatus={hasPending ? "disabled" : "default"}
          />
        </div>
      )}

      {/* 가입 모달 */}
      {isModalOpen && (
        <Modal_Join
          title={
            isApplied ? "가입 신청이 완료되었어요!" : "모임에 가입하시겠어요?"
          }
          messages={
            isApplied
              ? [
                  "모임장의 승인을 받아 가입이 완료되면,",
                  "알림으로 알려드릴게요",
                ]
              : [
                  "‘가입 신청하기’를 누르시면, 가입 신청이 완료되며",
                  "모임장의 승인 이후 가입이 완료돼요.",
                ]
          }
          confirmLabel={isApplied ? "확인" : "가입 신청하기"}
          onConfirm={isApplied ? () => setIsModalOpen(false) : onClickJoin}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      {/* 삭제 확인 모달 */}
      {isDelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Modal_Del
            onConfirm={handleDelete}
            onCancel={() => setIsDelModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
