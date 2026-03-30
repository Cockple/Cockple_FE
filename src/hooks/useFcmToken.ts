import { useEffect } from "react";
import { messaging, onMessage, requestFcmToken } from "../firebase";

async function registerToken() {
  await requestFcmToken();
}

export function useFcmToken() {
  useEffect(() => {
    if (typeof Notification === "undefined") {
      console.warn("[FCM] 이 환경은 Notification API를 지원하지 않습니다.");
      return;
    }

    console.log("[FCM] useFcmToken mounted. permission:", Notification.permission);

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("[FCM] 포그라운드 알림 수신:", payload);
    });

    const cleanupUserGestureListeners = () => {
      document.removeEventListener("click", handleFirstGesture);
      document.removeEventListener("touchstart", handleFirstGesture);
      document.removeEventListener("keydown", handleFirstGesture);
    };

    const handleFirstGesture = () => {
      console.log("[FCM] 사용자 제스처 감지 -> 토큰 등록 시도");
      cleanupUserGestureListeners();
      registerToken();
    };

    if (Notification.permission === "granted") {
      // 이미 허용된 경우 바로 등록
      registerToken();
    } else if (Notification.permission === "default") {
      // iOS는 user gesture 없이 requestPermission 불가
      document.addEventListener("click", handleFirstGesture);
      document.addEventListener("touchstart", handleFirstGesture);
      document.addEventListener("keydown", handleFirstGesture);
    } else {
      console.info("[FCM] 알림 권한이 차단되어 있습니다. 브라우저 설정에서 허용이 필요합니다.");
    }

    return () => {
      console.log("[FCM] useFcmToken cleanup");
      cleanupUserGestureListeners();
      unsubscribe();
    };
  }, []);
}
