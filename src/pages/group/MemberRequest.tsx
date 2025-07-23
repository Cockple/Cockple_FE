import { useState } from "react";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import TabSelector from "../../components/common/TabSelector";
import { Member } from "../../components/common/contentcard/Member";
import type { MemberProps } from "../../components/common/contentcard/Member";
import ApproveModal from "../../components/common/contentcard/alertTest/modal/ApproveModal";
import RejectModal from "../../components/common/contentcard/alertTest/modal/RejectModal";
import { NoAlertMessage } from "../../components/alert/NoAlertMessage";

const MemberRequestPage = () => {
  const [activeTab, setActiveTab] = useState<"request" | "approved">("request");

  // 멤버 상태 관리
  const [requests, setRequests] = useState<MemberProps[]>([
    {
      status: "request",
      name: "김세익스피어",
      gender: "female",
      level: "전국 D조",
      birth: "2000.05.05",
    },
    {
      status: "request",
      name: "김철수",
      gender: "female",
      level: "전국 D조",
      birth: "2000.05.05",
    },
    {
      status: "request",
      name: "김그레이스",
      gender: "female",
      level: "전국 D조",
      birth: "2000.05.05",
    },
  ]);

  const [approved, setApproved] = useState<MemberProps[]>([]);

  // 모달 상태
  const [selectedMember, setSelectedMember] = useState<MemberProps | null>(
    null,
  );
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);

  // 승인 처리
  const handleApprove = () => {
    if (!selectedMember) return;
    const { name, gender, level } = selectedMember;

    const updated: MemberProps = {
      status: "approved",
      name,
      gender,
      level,
      birth: getToday(), // 승인 날짜
    };
    setApproved(prev => [...prev, updated]);
    setRequests(prev => prev.filter(m => m.name !== selectedMember.name));
    closeModal();
  };

  // 거절 처리
  const handleReject = () => {
    if (!selectedMember) return;
    setRequests(prev => prev.filter(m => m.name !== selectedMember.name));
    closeModal();
  };

  const openApproveModal = (member: MemberProps) => {
    setSelectedMember(member);
    setModalType("approve");
  };

  const openRejectModal = (member: MemberProps) => {
    setSelectedMember(member);
    setModalType("reject");
  };

  const closeModal = () => {
    setSelectedMember(null);
    setModalType(null);
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
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
                <NoAlertMessage message="멤버 신청 내역" />
              </div>
            ) : (
              requests.map(member => (
                <Member
                  key={member.name}
                  {...member}
                  onAccept={() => openApproveModal(member)}
                  onReject={() => openRejectModal(member)}
                />
              ))
            )}
          </>
        )}

        {activeTab === "approved" && (
          <>
            {approved.length === 0 ? (
              <div className="flex flex-1 justify-center items-center">
                <NoAlertMessage message="승인 완료 내역" />
              </div>
            ) : (
              approved.map(member => (
                <Member key={member.name} {...member} status="approved" />
              ))
            )}
          </>
        )}
      </div>

      {/* 승인 모달 */}
      {modalType === "approve" && selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center bg-black-60 z-50">
          <ApproveModal
            onClose={closeModal}
            onApprove={handleApprove}
            memberName={selectedMember.name}
          />
        </div>
      )}

      {/* 거절 모달 */}
      {modalType === "reject" && selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center bg-black-60 z-50">
          <RejectModal
            onClose={closeModal}
            onReject={handleReject}
            memberName={selectedMember.name}
          />
        </div>
      )}
    </div>
  );
};

// 오늘 날짜 yyyy.mm.dd 형식
const getToday = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localTime = new Date(now.getTime() - offset);
  return localTime.toISOString().split("T")[0].replace(/-/g, ".");
};

export default MemberRequestPage;
