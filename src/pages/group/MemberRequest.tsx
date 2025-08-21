import { useEffect, useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import TabSelector from "../../components/common/TabSelector";
import { Member } from "../../components/common/contentcard/Member";
//import type { MemberProps } from "../../components/common/contentcard/Member";
import ApproveModal from "../../components/common/contentcard/alertTest/modal/ApproveModal";
import RejectModal from "../../components/common/contentcard/alertTest/modal/RejectModal";
import { EmptyState } from "../../components/alert/EmptyState";
import { useParams } from "react-router-dom";
import type {
  JoinRequestActionBody,
  MemberJoinRequest,
  MemberJoinRequestResponse,
} from "../../types/memberJoinRequest";
import api from "../../api/api";
import { formatDate } from "../../utils/time";

import { mapLevels } from "../../utils/gradeMapper";

const MemberRequestPage = () => {
  const { partyId } = useParams();
  const [activeTab, setActiveTab] = useState<"request" | "approved">("request");

  // 페이지 상태
  const [requests, setRequests] = useState<MemberJoinRequest[]>([]);
  const [approved, setApproved] = useState<MemberJoinRequest[]>([]);

  // 모달 상태
  const [selectedMember, setSelectedMember] =
    useState<MemberJoinRequest | null>(null);
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);
  //🌟
  const [submitting, setSubmitting] = useState(false);
  // 멤버 신청 목록 요청 (PENDING)
  const fetchPendingMembers = async () => {
    const res = await api.get<MemberJoinRequestResponse>(
      `/api/parties/${partyId}/join-requests?status=PENDING`,
    );

    console.log(res.data.data);
    setRequests(res.data.data.content);
  };

  // 승인된 멤버 목록 요청 (APPROVED)
  const fetchApprovedMembers = async () => {
    const res = await api.get<MemberJoinRequestResponse>(
      `/api/parties/${partyId}/join-requests?status=APPROVED`,
    );

    setApproved(res.data.data.content);
  };

  useEffect(() => {
    if (!partyId) return;
    fetchPendingMembers();
    fetchApprovedMembers();
  }, [partyId]);

  // 승인 처리
  const handleApprove = async () => {
    if (!selectedMember || !partyId) return;

    try {
      setSubmitting(true);
      console.log(selectedMember);
      const body: JoinRequestActionBody = { action: "APPROVE" };
      await api.patch(
        `/api/parties/${partyId}/join-requests/${selectedMember.joinRequestId}`,
        body,
      );
      // 낙관 업데이트(서버 재조회로 바꿔도 됨)
      setApproved(prev => [
        { ...selectedMember, updatedAt: new Date().toISOString() },
        ...prev,
      ]);
      setRequests(prev =>
        prev.filter(r => r.joinRequestId !== selectedMember.joinRequestId),
      );
    } catch (e) {
      console.error(e);
      alert("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
      closeModal();
    }
  };

  // 거절 처리
  const handleReject = async () => {
    if (!selectedMember || !partyId) return;
    try {
      setSubmitting(true);
      const body: JoinRequestActionBody = { action: "REJECT" };
      await api.patch(
        `/api/parties/${partyId}/join-requests/${selectedMember.joinRequestId}`,
        body,
      );
      setRequests(prev =>
        prev.filter(r => r.joinRequestId !== selectedMember.joinRequestId),
      );
    } catch (e) {
      console.error(e);
      alert("거절 처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
      closeModal();
    }
  };

  const openApproveModal = (member: MemberJoinRequest) => {
    setSelectedMember(member);
    setModalType("approve");
  };

  const openRejectModal = (member: MemberJoinRequest) => {
    setSelectedMember(member);
    setModalType("reject");
  };

  const closeModal = () => {
    setSelectedMember(null);
    setModalType(null);
  };

  return (
    <div className="flex flex-col min-h-[86dvh] pt-14">
      <PageHeader title="멤버 신청 관리" />
      <TabSelector
        options={[
          { label: "멤버 신청", value: "request" },
          { label: "승인 완료", value: "approved" },
        ]}
        selected={activeTab}
        onChange={value => setActiveTab(value)}
      />

      <div className="flex-1 flex flex-col gap-3 mt-2">
        {activeTab === "request" && (
          <>
            {requests.length === 0 ? (
              <div className="flex flex-1 justify-center items-center">
                <EmptyState message="멤버 신청 내역" />
              </div>
            ) : (
              requests.map(req => (
                <div className="border-b border-gy-200 pb-1">
                  <Member
                    status="request"
                    requestId={req.joinRequestId}
                    name={req.nickname}
                    gender={req.gender}
                    // level={req.level}
                    level={mapLevels([req.level])[0] ?? "급수 없음"}
                    birth={formatDate(req.createdAt)}
                    imgUrl={req.profileImageUrl}
                    onAccept={
                      submitting ? undefined : () => openApproveModal(req)
                    }
                    onReject={
                      submitting ? undefined : () => openRejectModal(req)
                    }
                  />
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "approved" && (
          <>
            {approved.length === 0 ? (
              <div className="flex flex-1 justify-center items-center">
                <EmptyState message="승인 완료 내역" />
              </div>
            ) : (
              approved.map(req => (
                <Member
                  key={req.joinRequestId}
                  status="approved"
                  requestId={req.joinRequestId}
                  name={req.nickname}
                  gender={req.gender}
                  // level={req.level}
                  level={mapLevels([req.level])[0] ?? "급수 없음"}
                  birth={formatDate(req.updatedAt ?? req.createdAt)}
                  imgUrl={req.profileImageUrl}
                />
              ))
            )}
          </>
        )}
      </div>

      {/* 승인 모달 */}
      {modalType === "approve" && selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center bg-black-60 z-50">
          <ApproveModal
            onClose={submitting ? () => {} : closeModal}
            onApprove={submitting ? () => {} : handleApprove}
            memberName={selectedMember.nickname}
          />
        </div>
      )}

      {/* 거절 모달 */}
      {modalType === "reject" && selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center bg-black-60 z-50">
          <RejectModal
            onClose={submitting ? () => {} : closeModal}
            onReject={submitting ? () => {} : handleReject}
            memberName={selectedMember.nickname}
          />
        </div>
      )}
    </div>
  );
};

// 오늘 날짜 yyyy.mm.dd 형식
// const getToday = () => {
//   const now = new Date();
//   const offset = now.getTimezoneOffset() * 60000;
//   const localTime = new Date(now.getTime() - offset);
//   return localTime.toISOString().split("T")[0].replace(/-/g, ".");
// };

export default MemberRequestPage;
