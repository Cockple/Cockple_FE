import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Clear_M from "../../components/common/Btn_Static/Icon_Btn/Clear_M";
import AlertInvite from "../../components/common/contentcard/alertTest/AlertInvite";
import AlertInviteApproved from "../../components/common/contentcard/alertTest/AlertInviteApproved";
import ApproveModal from "../../components/common/contentcard/alertTest/modal/ApproveModal";
import RejectModal from "../../components/common/contentcard/alertTest/modal/RejectModal";
import AlertChange from "../../components/common/contentcard/alertTest/AlertChange";
import AlertShadow from "../../components/common/contentcard/alertTest/AlertShadow";
import { alertList } from "../../components/alert/alertList";
// 아이콘
import ArrowLeft from "../../assets/icons/arrow_left.svg";
import { MainHeader } from "../../components/common/system/header/MainHeader";
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { NoAlertMessage } from "../../components/alert/NoAlertMessage";

export const AlertPage = () => {
  const navigate = useNavigate();

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvedList, setApprovedList] = useState<
    { id: number; date: string }[]
  >([]);
  const [targetId, setTargetId] = useState<number | null>(null);

  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    return `${year}.${month}.${date} 승인 완료`;
  };

  const handleAccept = (id: number) => {
    setTargetId(id);
    setShowApproveModal(true);
  };

  const handleReject = (id: number) => {
    setTargetId(id);
    setShowRejectModal(true);
  };

  const handleDetail = (id: number) => {
    console.log("상세보기 이동", id);
  };

  const confirmApprove = () => {
    if (targetId !== null) {
      const formattedDate = getTodayDate();
      setApprovedList(prev => [...prev, { id: targetId, date: formattedDate }]);
    }
    setShowApproveModal(false);
  };

  const confirmReject = () => {
    if (targetId !== null) {
      console.log("거절 처리", targetId); // 실제 로직 대체 가능
    }
    setShowRejectModal(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-scroll [&::-webkit-scrollbar]:hidden relative">
      {/* 헤더 */}
      {/* <div className="h-[3.5rem] flex items-center gap-3 shrink-0 bg-white">
        <Clear_M
          iconMap={{
            disabled: ArrowLeft,
            default: ArrowLeft,
            pressing: ArrowLeft,
            clicked: ArrowLeft,
          }}
          onClick={() => navigate("/")}
        />
        <div className="header-h4">알림</div>
      </div> */}
      <PageHeader title="알림" onBackClick={() => navigate("/")} />

      {/* 알림 카드들 */}
      <div className="flex flex-col items-center gap-4">
        {alertList.length === 0 ? (
          <NoAlertMessage />
        ) : (
          alertList.map(alert => {
            // 이미 승인된 경우 → AlertInviteApproved 렌더링
            const approved = approvedList.find(a => a.id === alert.id);
            if (alert.type === "invite" && approved) {
              return (
                <AlertInviteApproved
                  key={alert.id}
                  groupName={alert.groupName}
                  alertText={alert.alertText}
                  imageSrc={alert.imageSrc}
                  approvedDate={approved.date}
                />
              );
            }

            switch (alert.type) {
              case "invite":
                return (
                  <AlertInvite
                    key={alert.id}
                    groupName={alert.groupName}
                    alertText={alert.alertText}
                    imageSrc={alert.imageSrc}
                    onAccept={() => handleAccept(alert.id)}
                    onReject={() => handleReject(alert.id)}
                  />
                );
              case "change":
                return (
                  <AlertChange
                    key={alert.id}
                    groupName={alert.groupName}
                    alertText={alert.alertText}
                    imageSrc={alert.imageSrc}
                    onClick={() => handleDetail(alert.id)}
                  />
                );
              case "simple":
                return (
                  <AlertShadow
                    key={alert.id}
                    groupName={alert.groupName}
                    alertText={alert.alertText}
                    imageSrc={alert.imageSrc}
                  />
                );
              default:
                return null;
            }
          })
        )}
      </div>

      {/* 승인 모달 */}
      {showApproveModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black-60 z-10">
          <ApproveModal
            onClose={() => setShowApproveModal(false)}
            onApprove={confirmApprove}
          />
        </div>
      )}

      {/* 거절 모달 */}
      {showRejectModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black-60 z-10">
          <RejectModal
            onClose={() => setShowRejectModal(false)}
            onReject={confirmReject}
          />
        </div>
      )}
    </div>
  );
};
