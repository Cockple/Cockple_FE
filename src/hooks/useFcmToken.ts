import { useEffect } from "react";
import { messaging, onMessage, requestFcmToken } from "../firebase";
import api from "../api/api";

export function useFcmToken() {
  useEffect(() => {
    requestFcmToken().then((token) => {
      if (!token) return;
      api.patch("/api/notifications/fcm-token", { fcmToken: token });
      console.log("FCM 토큰 등록 완료:", token);
    });

    // 포그라운드(앱이 열려있을 때) 알림 수신
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("포그라운드 알림 수신:", payload);
      // TODO: 토스트 등 UI 알림 표시
    });

    return () => unsubscribe();
  }, []);
}
