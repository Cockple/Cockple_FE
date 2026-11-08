import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type Messaging,
} from "firebase/messaging";
import api from "./api/api";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
let messagingInstance: Messaging | null = null;

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (messagingInstance) return messagingInstance;

  try {
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      Boolean(navigator.serviceWorker) &&
      typeof Notification !== "undefined" &&
      (await isSupported());

    if (!supported) {
      console.warn("[FCM] 이 브라우저는 Firebase Messaging을 지원하지 않습니다.");
      return null;
    }

    messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch (e) {
    console.warn("[FCM] Firebase Messaging 지원 여부 확인/초기화 실패:", e);
    return null;
  }
}

async function sendTokenToServer(token: string) {
  try {
    await api.patch("/api/notifications/fcm-token", { fcmToken: token });
  } catch (error) {
    console.error("FCM 토큰 서버 전송 실패", error);
  }
}

export async function requestFcmToken(): Promise<string | null> {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      return null;
    }

    if (Notification.permission === "denied") {
      console.warn("[FCM] 알림 권한이 차단(denied) 상태입니다.");
      return null;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return null;
      }
    }

    // localStorage 캐시 없이 항상 현재 SW에 맞는 토큰을 가져옴
    // (Safari PWA와 일반 Safari는 SW가 달라 캐시 토큰 사용 시 백그라운드 알림 불가)
    const swReg = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });

    if (token) {
      await sendTokenToServer(token);
    } else {
      console.warn("[FCM] 토큰 발급 실패(빈 토큰)");
    }

    return token ?? null;
  } catch (e) {
    console.error("FCM 토큰 발급 실패", e);
    return null;
  }
}

export { onMessage };
