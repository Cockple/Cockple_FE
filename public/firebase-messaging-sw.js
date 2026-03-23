importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAzRA6foeBSL6-d94jdQ-45xXGNe9086A4",
  authDomain: "cockple-1a83e.firebaseapp.com",
  projectId: "cockple-1a83e",
  storageBucket: "cockple-1a83e.firebasestorage.app",
  messagingSenderId: "901458435316",
  appId: "1:901458435316:web:036e9944ad1772b92d92a1",
});

const messaging = firebase.messaging();

console.log("[FCM-SW] firebase-messaging-sw loaded");

// 백그라운드 알림 수신
messaging.onBackgroundMessage(payload => {
  console.log("[FCM-SW] 백그라운드 알림 수신:", payload);
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? "알림", {
    body,
    icon: "/icons/app_icon.png",
  });
});
