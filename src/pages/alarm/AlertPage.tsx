import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AlertInvite from "../../components/common/contentcard/alertTest/AlertInvite";
//import AlertInviteApproved from "../../components/common/contentcard/alertTest/AlertInviteApproved";
import ApproveModal from "../../components/common/contentcard/alertTest/modal/ApproveModal";
import RejectModal from "../../components/common/contentcard/alertTest/modal/RejectModal";
// import AlertChange from "../../components/common/contentcard/alertTest/AlertChange";
// import AlertShadow from "../../components/common/contentcard/alertTest/AlertShadow";
import { alertList } from "../../components/alert/alertList";
// 아이콘
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { NoAlertMessage } from "../../components/alert/NoAlertMessage";
import AlertTest1 from "../../components/common/contentcard/alertTest/AlertTest1";

export const AlertPage = () => {
  const navigate = useNavigate();

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);

  const [notifications, setNotifications] = useState(alertList);

  // 알림 리스트 필터링된 상태로 보여주기
  const visibleNotifications = notifications.filter(alert =>
    ["invite", "change", "simple"].includes(alert.type),
  );

  const handleAccept = (id: number) => {
    setTargetId(id);
    setShowApproveModal(true);
  };

  const handleReject = (id: number) => {
    setTargetId(id);
    setShowRejectModal(true);
  };

  // const handleDetail = (id: number) => {
  //   console.log("상세보기 이동", id);
  // };
  const handleDetail = (groupId: number) => {
    console.log("모임 페이지로 이동", groupId);
    navigate(`/group/${groupId}`); // 필요 시 id 기반 라우팅
  };

  //모임 초대 수락 api
  //알림 invite_accept patch
  const confirmApprove = () => {
    if (targetId !== null) {
      //     try {
      //     const response = await axios.patch(`/api/notifications/${targetId}`, {
      //       type: "invite_accept",
      //     });

      //     console.log("승인 성공:", response.data);

      //     // 알림에서 제거
      //     setNotifications(prev =>
      //       prev.filter(alert => alert.notificationId !== targetId)
      //     );
      //   } catch (error) {
      //     console.error("승인 처리 중 오류:", error);
      //   }
      // }

      // 알림에서 제거
      setNotifications(prev =>
        prev.filter(alert => alert.notificationId !== targetId),
      );
      console.log("승인 처리", targetId);
    }
    setShowApproveModal(false);
  };

  const confirmReject = () => {
    if (targetId !== null) {
      //     try {
      //     const response = await axios.patch(`/api/notifications/${targetId}`, {
      //       type: "invite_reject",
      //     });

      //     console.log("거절 성공:", response.data);

      //     // 알림에서 제거
      //     setNotifications(prev =>
      //       prev.filter(alert => alert.notificationId !== targetId)
      //     );
      //   } catch (error) {
      //     console.error("거절 처리 중 오류:", error);
      //   }
      // }
      // 알림에서 제거
      setNotifications(prev =>
        prev.filter(alert => alert.notificationId !== targetId),
      );

      console.log("거절 처리", targetId); // 실제 로직 대체 가능
    }
    setShowRejectModal(false);
  };

  const shouldMoveToDetail = (type: string): boolean => {
    // 운동 삭제 & 모임 삭제 제외
    return !(type === "simple");
  };

  const getDescriptionText = (type: string) => {
    if (shouldMoveToDetail(type)) {
      return "클릭하시면 모임 페이지로 이동해요.";
    }
    return undefined;
  };

  return (
    <div className="flex flex-col h-screen overflow-y-scroll [&::-webkit-scrollbar]:hidden relative">
      {/* 헤더 */}
      <PageHeader title="알림" onBackClick={() => navigate("/")} />

      {/* 알림 카드들 */}
      <div className="flex-1 flex flex-col items-center gap-4">
        {visibleNotifications.length === 0 ? (
          <div className="flex flex-1 justify-center items-center">
            <NoAlertMessage />
          </div>
        ) : (
          visibleNotifications.map(alert => {
            return alert.type === "invite" ? (
              <AlertInvite
                key={alert.notificationId}
                groupName={alert.title}
                alertText={alert.content}
                imageSrc={alert.imgKey}
                onAccept={() => handleAccept(alert.notificationId)}
                onReject={() => handleReject(alert.notificationId)}
              />
            ) : (
              <AlertTest1
                key={alert.notificationId}
                groupName={alert.title}
                alertText={alert.content}
                imageSrc={alert.imgKey}
                descriptionText={getDescriptionText(alert.type)}
                onClick={
                  shouldMoveToDetail(alert.type)
                    ? () => handleDetail(alert.groupId)
                    : undefined
                }
              />
            );
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
