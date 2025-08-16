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
    //🌟
    // const data = res.data.data.content;
    // const mapped = data.map(toMemberProps("request"));
    // setRequests(mapped);
    setRequests(res.data.data.content);
  };

  // 승인된 멤버 목록 요청 (APPROVED)
  const fetchApprovedMembers = async () => {
    const res = await api.get<MemberJoinRequestResponse>(
      `/api/parties/${partyId}/join-requests?status=APPROVED`,
    );
    //🌟
    // const data = res.data.data.content;
    // const mapped = data.map(toMemberProps("approved"));
    // setApproved(mapped);
    setApproved(res.data.data.content);
  };

  useEffect(() => {
    if (!partyId) return;
    fetchPendingMembers();
    fetchApprovedMembers();
  }, [partyId]);

  // MemberJoinRequest → MemberProps 변환 함수
  // const toMemberProps =
  //   (status: "request" | "approved") =>
  //   (item: MemberJoinReqeust): MemberProps => ({
  //     requestId: item.joinRequestId,
  //     status,
  //     name: item.nickname,
  //     gender: item.gender,
  //     level: item.level,
  //     birth: status === "request" ? item.createdAt : item.updatedAt,
  //   });

  // 승인 처리
  const handleApprove = async () => {
    if (!selectedMember || !partyId) return;

    // 1.
    // const { name, gender, level } = selectedMember;

    // const updated: MemberProps = {
    //   status: "approved",
    //   name,
    //   gender,
    //   level,
    //   birth: getToday(), // 승인 날짜
    // };

    //2.
    // const updated: MemberProps = {
    //   ...selectedMember,
    //   status: "approved",
    //   birth: getToday(),
    // };
    // setApproved(prev => [...prev, updated]);
    // setRequests(prev => prev.filter(m => m.name !== selectedMember.name));
    // closeModal();

    //3.
    try {
      setSubmitting(true);
      const body: JoinRequestActionBody = { action: "APPROVE" };
      await api.patch(
        `/api/parties/${partyId}/join-requests/${selectedMember.requestId}`,
        body,
      );
      // 낙관 업데이트(서버 재조회로 바꿔도 됨)
      setApproved(prev => [
        { ...selectedMember, updatedAt: new Date().toISOString() },
        ...prev,
      ]);
      setRequests(prev =>
        prev.filter(r => r.requestId !== selectedMember.requestId),
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
        `/api/parties/${partyId}/join-requests/${selectedMember.requestId}`,
        body,
      );
      setRequests(prev =>
        prev.filter(r => r.requestId !== selectedMember.requestId),
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
        {/* {activeTab === "request" &&
          requests.map(member => (
            <Member
              key={member.name}
              {...member}
              onAccept={() => openApproveModal(member)}
              onReject={() => openRejectModal(member)}
            />
          ))}

        {activeTab === "approved" &&
          approved.map(member => (
            <Member key={member.name} {...member} status="approved" />
          ))} */}
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
                    requestId={req.requestId}
                    name={req.nickname}
                    gender={req.gender}
                    level={req.level}
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
                  key={req.requestId}
                  status="approved"
                  requestId={req.requestId}
                  name={req.nickname}
                  gender={req.gender}
                  level={req.level}
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
