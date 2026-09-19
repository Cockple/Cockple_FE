import { useState, useRef, useEffect } from "react";
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
import type { AlertListResponse, ResponseAlertDto, AlertListPage } from "../../types/alert";
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { AlertSkeleton } from "../../components/alert/AlertSkeleton";
import DefaultGroupImg from "@/assets/icons/defaultGroupImg.svg?url";

const fetchNotifications = async ({ pageParam = null }: { pageParam?: number | null }): Promise<AlertListPage> => {
  const cursorParam = pageParam ? `&cursor=${pageParam}` : "";
  const response = await api.get<AlertListResponse>(
    `/api/v2/notifications?destination=APP${cursorParam}`
  );
  return response.data.data;
};

export const AlertPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [targetId, setTargetId] = useState<number | null>(null);
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    staleTime: 1000 * 60,
  });

  const notifications = data?.pages.flatMap(page => page.notifications) || [];

  // INVITE/CHANGE/SIMPLE 만 노출
  const visibleNotifications = notifications.filter(alert =>
    ["INVITE", "CHANGE", "SIMPLE"].includes(alert.type),
  );

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isLoading]);

  const handleAccept = (id: number) => {
    setTargetId(id);
    setModalType("approve");
  };

  const handleReject = (id: number) => {
    setTargetId(id);
    setModalType("reject");
  };

  const handleDetail = (partyId: number, data?: ResponseAlertDto["data"]) => {
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

    const id = data?.invitationId;
    return typeof id === "number" ? id : Number(id ?? NaN);
  }

  // 🌟CHANGE/SIMPLE 읽음 처리 공통 뮤테이션
  const markReadMutation = useMutation({
    mutationFn: async (notification: ResponseAlertDto) => {
      const { notificationId } = notification;
      await api.patch(`/api/v2/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: err => {
      console.error("읽음 처리 실패:", err);
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (notification: ResponseAlertDto) => {
      const { notificationId, partyId } = notification;
      const invitationId = extractInvitationId(notification.data);

      // V2: 알림 읽음 처리만 하고, 수락은 초대 API로 별도 호출
      await api.patch(`/api/v2/notifications/${notificationId}/read`);

      if (partyId && invitationId) {
        await api.patch(`/api/parties/invitations/${invitationId}`, {
          action: "APPROVE",
        });
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

      // V2: 알림 읽음 처리만 하고, 거절은 초대 API로 별도 호출
      await api.patch(`/api/v2/notifications/${notificationId}/read`);

      if (data?.invitationId) {
        await api.patch(`/api/parties/invitations/${data.invitationId}`, {
          action: "REJECT",
        });
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
    // SIMPLE(운동/모임 삭제 알림 등)은 상세 이동 X
    return !(type === "SIMPLE");
  };

  const getDescriptionText = (type: string) => {
    if (shouldMoveToDetail(type)) {
      return "클릭하시면 모임 페이지로 이동해요.";
    }
    return undefined;
  };

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
          <AlertSkeleton />
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
                imageSrc={alert.imgUrl?.endsWith("/null") ? DefaultGroupImg : (alert.imgUrl ?? DefaultGroupImg)}
                onAccept={() => handleAccept(alert.notificationId)}
                onReject={() => handleReject(alert.notificationId)}
              />
            ) : (
              <AlertTest1
                key={alert.notificationId}
                groupName={alert.title}
                alertText={alert.content}
                imageSrc={alert.imgUrl?.endsWith("/null") ? DefaultGroupImg : (alert.imgUrl ?? DefaultGroupImg)}
                alertType={alert.type}
                isRead={alert.isRead}
                descriptionText={getDescriptionText(alert.type)}
                onClick={() => {
                  markReadMutation.mutate(alert);
                  if (shouldMoveToDetail(alert.type)) {
                    handleDetail(alert.partyId, alert.data);
                  }
                }}
              />
            ),
          )
        )}
        {hasNextPage && <div ref={observerRef} className="h-10 w-full" />}
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
