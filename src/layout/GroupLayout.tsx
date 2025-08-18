import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/system/header/PageHeader";
import TabSelector from "../components/common/TabSelector";
import { useEffect, useState } from "react";
import { useGroupNameStore } from "../store/useGroupNameStore";
import { SortBottomSheet } from "../components/common/SortBottomSheet";
import { deleteParty } from "../api/party/patchParties";
import { Modal_Del } from "../components/group/Modal_Del";

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

  return (
    <div className="flex flex-col">
      <PageHeader
        title={groupName}
        onBackClick={handleBackClick}
        onMoreClick={() => setIsMoreOpen(true)}
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
