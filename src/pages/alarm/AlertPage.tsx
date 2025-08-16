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
import { EmptyState } from "../../components/alert/EmptyState";
import AlertTest1 from "../../components/common/contentcard/alertTest/AlertTest1";
import type { AlertListResponse, ResponseAlertDto } from "../../types/alert";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

const fetchNotifications = async (): Promise<ResponseAlertDto[]> => {
  const response = await api.get<AlertListResponse>(
    "/api/notifications",
    // {
    // headers: {
    //   Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    // },
    // }
  );

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

  // 안전 파서
  function extractInvitationId(data: ResponseAlertDto["data"]): number | null {
    if (!data) return null;

    // data가 문자열(JSON)로 오는 케이스 대응
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        const id = parsed?.invitationId;
        return typeof id === "number" ? id : Number(id ?? NaN);
      } catch {
        return null;
      }
    }

    // 객체로 오는 케이스도 대비
    const id = data?.invitationId;
    return typeof id === "number" ? id : Number(id ?? NaN);
  }

  const approveMutation = useMutation({
    mutationFn: async (notification: ResponseAlertDto) => {
      const { notificationId, partyId } = notification;
      const invitationId = extractInvitationId(notification.data);

      // 알림 상태 수정 (INVITE → INVITE_ACCEPT)
      await api.patch(
        `/api/notifications/${notificationId}?type=INVITE_ACCEPT`,
        //{ type: "INVITE_ACCEPT" },
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        //   },
        // },
      );

      if (partyId && invitationId) {
        await api.patch(
          `/api/parties/invitations/${invitationId}`,
          { action: "APPROVE" },
          // {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          //   },
          // },
        );
        console.log("모임으로 승인 요청 보냄, 초대 아이디: ", invitationId);
      } else if (partyId && !invitationId) {
        console.log("모임 있지만 invitationId 없음");
      } else {
        console.log("모임도 없고 invitationId도 없음");
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

  const rejectMutation = useMutation({
    mutationFn: async (notification: ResponseAlertDto) => {
      const { notificationId, data } = notification;

      await api.patch(
        `/api/notifications/${notificationId}?type=INVITE_REJECT`,
        //{ type: "INVITE_REJECT" },
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        //   },
        // },
      );

      if (data?.invitationId) {
        await api.patch(
          `/api/parties/invitations/${data.invitationId}`,
          { action: "REJECT" },
          // {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          //   },
          // },
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
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <div className="text-center mt-10">에러 발생</div>
        ) : visibleNotifications.length === 0 ? (
          <div className="flex flex-1 justify-center items-center">
            <EmptyState />
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

      {modalType === "approve" && selectedAlert && (
        <div className="fixed inset-0 flex justify-center items-center bg-black-60 z-50">
          <ApproveModal
            onClose={() => setModalType(null)}
            onApprove={() => approveMutation.mutate(selectedAlert)}
          />
        </div>
      )}

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
