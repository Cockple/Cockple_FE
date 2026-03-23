import { useEffect } from "react";
import { messaging, onMessage, requestFcmToken } from "../firebase";

async function registerToken() {
  await requestFcmToken();
}

export function useFcmToken() {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("포그라운드 알림 수신:", payload);
    });

    const cleanupUserGestureListeners = () => {
      document.removeEventListener("click", handleFirstGesture);
      document.removeEventListener("touchstart", handleFirstGesture);
      document.removeEventListener("keydown", handleFirstGesture);
    };

    const handleFirstGesture = () => {
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
      console.info("알림 권한이 차단되어 있습니다. 브라우저 설정에서 허용이 필요합니다.");
    }

    return () => {
      cleanupUserGestureListeners();
      unsubscribe();
    };
  }, []);
}
