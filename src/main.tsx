import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";

const queryClient = new QueryClient();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        const unregisterTasks = registrations
          .filter((registration) => registration.active?.scriptURL.includes("/sw.js"))
          .map((registration) => registration.unregister());
        return Promise.all(unregisterTasks);
      })
      .catch((err) => {
        console.warn("기존 SW 정리 중 오류:", err);
      })
      .finally(() => {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then(() => {
            console.log("[FCM] firebase-messaging-sw 등록 완료");
          })
          .catch((err) => {
            console.error("Service Worker 등록 실패:", err);
          });
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
