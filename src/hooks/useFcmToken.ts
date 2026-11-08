import { useEffect } from "react";
import { getFirebaseMessaging, onMessage, requestFcmToken } from "../firebase";

async function registerToken() {
  await requestFcmToken();
}

export function useFcmToken() {
  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const cleanupUserGestureListeners = () => {
      document.removeEventListener("click", handleFirstGesture);
      document.removeEventListener("touchstart", handleFirstGesture);
      document.removeEventListener("keydown", handleFirstGesture);
    };

    const handleFirstGesture = () => {
      cleanupUserGestureListeners();
      registerToken();
    };

    async function initFcm() {
      const messaging = await getFirebaseMessaging();
      if (!isMounted || !messaging) {
        return;
      }

      unsubscribe = onMessage(messaging, () => {});

      if (Notification.permission === "granted") {
        // 이미 허용된 경우 바로 등록
        registerToken();
      } else if (Notification.permission === "default") {
        // iOS는 user gesture 없이 requestPermission 불가
        document.addEventListener("click", handleFirstGesture);
        document.addEventListener("touchstart", handleFirstGesture);
        document.addEventListener("keydown", handleFirstGesture);
      }
    }

    initFcm();

    return () => {
      isMounted = false;
      cleanupUserGestureListeners();
      unsubscribe?.();
    };
  }, []);
}
