import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
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
export const messaging = getMessaging(app);
const FCM_TOKEN_STORAGE_KEY = "fcmToken";

async function sendTokenToServer(token: string) {
  try {
    await api.patch("/api/notifications/fcm-token", { fcmToken: token });
  } catch (error) {
    console.error("FCM 토큰 서버 전송 실패", error);
  }
}

export async function requestFcmToken(): Promise<string | null> {
  try {
    if (Notification.permission === "denied") {
      return null;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;
    }

    const existingToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    if (existingToken) {
      await sendTokenToServer(existingToken);
      return existingToken;
    }

    const swReg = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });

    if (token) {
      localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
      await sendTokenToServer(token);
    }

    return token ?? null;
  } catch (e) {
    console.error("FCM 토큰 발급 실패", e);
    return null;
  }
}

export { onMessage };
