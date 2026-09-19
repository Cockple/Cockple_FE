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

    const unsubscribe = onMessage(messaging, () => {});

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
    }

    return () => {
      cleanupUserGestureListeners();
      unsubscribe();
    };
  }, []);
}
