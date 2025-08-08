import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AlertInvite from "../../components/common/contentcard/alertTest/AlertInvite";
import ApproveModal from "../../components/common/contentcard/alertTest/modal/ApproveModal";
import RejectModal from "../../components/common/contentcard/alertTest/modal/RejectModal";
//import { alertList } from "../../components/alert/alertList";

//api 연결
import api from "../../api/api";

// 아이콘
import { PageHeader } from "../../components/common/system/header/PageHeader";
import { NoAlertMessage } from "../../components/alert/NoAlertMessage";
import AlertTest1 from "../../components/common/contentcard/alertTest/AlertTest1";
import type { AlertListResponse, ResponseAlertDto } from "../../types/alert";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchNotifications = async (): Promise<ResponseAlertDto[]> => {
  const response = await api.get<AlertListResponse>("/api/notifications", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  console.log("내 알림 목록: ", response.data.data);
  return response.data.data;
};

export const AlertPage = () => {
  const navigate = useNavigate();
  //추가
  const queryClient = useQueryClient();

  //const [showApproveModal, setShowApproveModal] = useState(false);
  //const [showRejectModal, setShowRejectModal] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);
  //추가
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);
  //const [notifications, setNotifications] = useState<ResponseAlertDto[]>([]);

  //추가
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60,
  });

  // 알림 리스트 필터링된 상태로 보여주기
  const visibleNotifications = notifications.filter(alert =>
    ["INVITE", "CHANGE", "SIMPLE"].includes(alert.type),
  );

  // 알림 목록 조회 api
  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await api.get<AlertListResponse>(
  //         `/api/notifications`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           },
  //         },
  //       );
  //       console.log("알림 목록 : ", response.data);

  //       const { data } = response.data;
  //       setNotifications(data);
  //     } catch (error) {
  //       console.error("알림 목록 조회 실패:", error);
  //     }
  //   };

  //   fetchNotifications();
  // }, []);

  const handleAccept = (id: number) => {
    setTargetId(id);
    //setShowApproveModal(true);
    setModalType("approve");
  };

  const handleReject = (id: number) => {
    setTargetId(id);
    //setShowRejectModal(true);
    setModalType("reject");
  };

  const handleDetail = (partyId: number, data?: ResponseAlertDto["data"]) => {
    console.log("모임 페이지로 이동", partyId);

    if (data?.exerciseDate && data?.exerciseId) {
      navigate(`/group/${partyId}`, {
        state: {
          exerciseDate: data.exerciseDate,
          exerciseId: data.exerciseId,
        },
      });
    } else {
      navigate(`/group/${partyId}`);
    }
  };

  //모임 초대 수락 api
  //알림 invite_accept patch
  // const confirmApprove = async () => {
  //   if (targetId !== null) {

  //     try {
  //       // 알림 상태 먼저 수정 (INVITE → INVITE_ACCEPT)
  //       const patchNotificationRes = await api.patch(
  //         `/api/notifications/${targetId}`,
  //         { type: "INVITE_ACCEPT" },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           },
  //         },
  //       );
  //       console.log("알림 승인 성공:", patchNotificationRes.data);

  //       // invitationId가 있다면 모임 초대 승인도 추가
  //       const targetAlert = notifications.find(
  //         alert => alert.notificationId === targetId,
  //       );

  //       const invitationId = targetAlert?.data?.invitationId;
  //       if (invitationId) {
  //         const patchInviteRes = await api.patch(
  //           `/api/parties/invitations/${invitationId}`,
  //           { action: "APPROVE" },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //             },
  //           },
  //         );
  //         console.log("모임 초대 승인 성공:", patchInviteRes.data);
  //       }

  //       // 알림 목록에서 제거
  //       setNotifications(prev =>
  //         prev.filter(alert => alert.notificationId !== targetId),
  //       );
  //     } catch (error) {
  //       console.error("승인 처리 중 오류:", error);
  //     }
  //     setShowApproveModal(false);
  //   }
  // };
  const approveMutation = useMutation({
    mutationFn: async (notification: ResponseAlertDto) => {
      const { notificationId, data } = notification;

      // 알림 상태 수정 (INVITE → INVITE_ACCEPT)
      await api.patch(
        `/api/notifications/${notificationId}`,
        { type: "INVITE_ACCEPT" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (data?.invitationId) {
        await api.patch(
          `/api/parties/invitations/${data.invitationId}`,
          { action: "APPROVE" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setModalType(null);
    },
    onError: err => {
      console.error("승인 처리 실패:", err);
    },
  });

  // const confirmReject = async () => {
  //   if (targetId !== null) {
  //     // 알림에서 제거
  //     // setNotifications(prev =>
  //     //   prev.filter(alert => alert.notificationId !== targetId),
  //     // );

  //     // console.log("거절 처리", targetId); // 실제 로직 대체 가능
  //     try {
  //       // 알림 상태 변경 (INVITE → INVITE_REJECT)
  //       const patchNotificationRes = await api.patch(
  //         `/api/notifications/${targetId}`,
  //         { type: "INVITE_REJECT" },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           },
  //         },
  //       );
  //       console.log("알림 거절 성공:", patchNotificationRes.data);

  //       // invitationId 있으면 모임 초대 거절 처리
  //       const targetAlert = notifications.find(
  //         alert => alert.notificationId === targetId,
  //       );

  //       const invitationId = targetAlert?.data?.invitationId;
  //       if (invitationId) {
  //         const patchInviteRes = await api.patch(
  //           `/api/parties/invitations/${invitationId}`,
  //           { action: "REJECT" },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //             },
  //           },
  //         );
  //         console.log("모임 초대 거절 성공:", patchInviteRes.data);
  //       }

  //       // 알림 목록에서 제거
  //       setNotifications(prev =>
  //         prev.filter(alert => alert.notificationId !== targetId),
  //       );
  //     } catch (error) {
  //       console.error("거절 처리 중 오류:", error);
  //     }
  //     setShowRejectModal(false);
  //   }
  // };
  const rejectMutation = useMutation({
    mutationFn: async (notification: ResponseAlertDto) => {
      const { notificationId, data } = notification;

      await api.patch(
        `/api/notifications/${notificationId}`,
        { type: "INVITE_REJECT" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (data?.invitationId) {
        await api.patch(
          `/api/parties/invitations/${data.invitationId}`,
          { action: "REJECT" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setModalType(null);
    },
    onError: err => {
      console.error("거절 처리 실패:", err);
    },
  });

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

  //추가
  const selectedAlert = notifications.find(
    alert => alert.notificationId === targetId,
  );

  return (
    <div className="flex flex-col min-h-[86dvh] -mb-8 overflow-hidden relative">
      {/* 헤더 */}
      <PageHeader title="알림" />

      {/* 알림 카드들 */}
      <div className="flex-1 flex flex-col items-center gap-4">
        {/* {visibleNotifications.length === 0 ? (
          <div className="flex flex-1 justify-center items-center">
            <NoAlertMessage />
          </div>
        ) : (
          visibleNotifications.map(alert => {
            return alert.type === "INVITE" ? (
              <AlertInvite
                key={alert.notificationId}
                groupName={alert.title}
                alertText={alert.content}
                imageSrc={alert.imgUrl}
                onAccept={() => handleAccept(alert.notificationId)}
                onReject={() => handleReject(alert.notificationId)}
              />
            ) : (
              <AlertTest1
                key={alert.notificationId}
                groupName={alert.title}
                alertText={alert.content}
                imageSrc={alert.imgUrl}
                alertType={alert.type}
                descriptionText={getDescriptionText(alert.type)}
                onClick={
                  shouldMoveToDetail(alert.type)
                    ? () => handleDetail(alert.partyId, alert.data)
                    : undefined
                }
              />
            );
          })
        )} */}
        {isLoading ? (
          <div className="text-center mt-10">로딩 중...</div>
        ) : isError ? (
          <div className="text-center mt-10">에러 발생</div>
        ) : visibleNotifications.length === 0 ? (
          <div className="flex flex-1 justify-center items-center">
            <NoAlertMessage />
          </div>
        ) : (
          visibleNotifications.map(alert =>
            alert.type === "INVITE" ? (
              <AlertInvite
                key={alert.notificationId}
                groupName={alert.title}
                alertText={alert.content}
                imageSrc={alert.imgUrl}
                onAccept={() => handleAccept(alert.notificationId)}
                onReject={() => handleReject(alert.notificationId)}
              />
            ) : (
              <AlertTest1
                key={alert.notificationId}
                groupName={alert.title}
                alertText={alert.content}
                imageSrc={alert.imgUrl}
                alertType={alert.type}
                descriptionText={getDescriptionText(alert.type)}
                onClick={
                  shouldMoveToDetail(alert.type)
                    ? () => handleDetail(alert.partyId, alert.data)
                    : undefined
                }
              />
            ),
          )
        )}
      </div>

      {/* 승인 모달 */}
      {/* {showApproveModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black-60 z-50">
          <ApproveModal
            onClose={() => setShowApproveModal(false)}
            onApprove={confirmApprove}
          />
        </div>
      )} */}
      {modalType === "approve" && selectedAlert && (
        <div className="fixed inset-0 flex justify-center items-center bg-black-60 z-50">
          <ApproveModal
            onClose={() => setModalType(null)}
            onApprove={() => approveMutation.mutate(selectedAlert)}
          />
        </div>
      )}

      {/* 거절 모달 */}
      {/* {showRejectModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black-60 z-50">
          <RejectModal
            onClose={() => setShowRejectModal(false)}
            onReject={confirmReject}
          />
        </div>
      )} */}
      {modalType === "reject" && selectedAlert && (
        <div className="fixed inset-0 flex justify-center items-center bg-black-60 z-50">
          <RejectModal
            onClose={() => setModalType(null)}
            onReject={() => rejectMutation.mutate(selectedAlert)}
          />
        </div>
      )}
    </div>
  );
};
