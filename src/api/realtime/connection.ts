// api/realtime/connection.ts
// CHAT과 GAME 도메인이 함께 쓰는 단일 SockJS 연결.
// 엔드포인트: GET /ws/realtime?token={accessToken} (기존 /ws/chats를 대체, 도메인은 envelope.domain으로 라우팅)
// 두 도메인이 각자 별도 연결을 열면 서버에서 중복 발송될 수 있어(백엔드 공지) 연결은 반드시 하나만 유지한다.
// api/chat/rawWs.ts, api/game/rawWs.ts는 이 모듈을 통해 envelope을 주고받는 얇은 래퍼다.
import useUserStore from "../../store/useUserStore";

let ws: WebSocket | null = null;

export const REALTIME_PROTOCOL_VERSION = 1;
export type RealtimeDomain = "CHAT" | "GAME";

export type RequestEnvelope<TPayload = Record<string, unknown>> = {
  version: number;
  domain: RealtimeDomain;
  action: string;
  requestId: string;
  payload: TPayload;
};

export type ErrorPayload = { code: string; message: string };

export type ResponseEnvelope<TData = unknown> = {
  version: number;
  domain: RealtimeDomain;
  type: string;
  requestId?: string;
  data?: TData;
  // 에러 데이터가 data 대신 별도 error 필드로 올 가능성 대비
  error?: ErrorPayload;
  timestamp: string;
};

type MsgListener = (msg: ResponseEnvelope) => void;
const listeners = new Set<MsgListener>();

export const addRealtimeListener = (fn: MsgListener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

type OpenListener = () => void;
type CloseListener = (ev?: CloseEvent) => void;
const openListeners = new Set<OpenListener>();
const closeListeners = new Set<CloseListener>();

export const addRealtimeOpenListener = (fn: OpenListener) => {
  openListeners.add(fn);
  return () => {
    openListeners.delete(fn);
  };
};

export const addRealtimeCloseListener = (fn: CloseListener) => {
  closeListeners.add(fn);
  return () => {
    closeListeners.delete(fn);
  };
};

type PendingEntry = {
  resolve: (msg: ResponseEnvelope) => void;
  reject: (err: Error) => void;
  timer: number;
};
const pending = new Map<string, PendingEntry>();
const REQUEST_TIMEOUT_MS = 10000;

let reconnectTimer: number | null = null;
let reconnectAttempt = 0;
let isManualClose = false;
let connectPromise: Promise<WebSocket | null> | null = null;

const WS_ORIGIN = (
  import.meta.env.VITE_WS_ORIGIN ?? window.location.origin
).replace(/\/$/, "");
const WS_REALTIME_PATH = (
  import.meta.env.VITE_WS_REALTIME_PATH ?? "/ws/realtime"
).replace(/\/$/, "");

const buildWsUrl = (origin?: string) => (origin ?? WS_ORIGIN) + WS_REALTIME_PATH; // SockJS는 http/https 사용

const getToken = () => {
  const { user } = useUserStore.getState();
  return user?.accessToken ?? localStorage.getItem("accessToken") ?? "";
};
const hasToken = () => !!getToken();

const genRequestId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `req-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const rejectAllPending = (reason: string) => {
  pending.forEach(({ reject, timer }) => {
    window.clearTimeout(timer);
    reject(new Error(reason));
  });
  pending.clear();
};

export const connectRealtimeWs = async ({
  origin,
}: { origin?: string } = {}) => {
  if (!hasToken()) {
    console.info("[Realtime WS] skipped: no accessToken");
    return null;
  }

  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    return ws;
  }

  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    const url = new URL(buildWsUrl(origin));
    url.searchParams.set("token", getToken());

    // SockJS dynamic import (초기 번들에서 제외)
    const { default: SockJS } = await import("sockjs-client");
    const sock = new SockJS(url.toString());
    ws = sock as WebSocket;

    sock.onopen = () => {
      reconnectAttempt = 0;
      isManualClose = false;
      openListeners.forEach(fn => {
        try {
          fn();
        } catch (err) {
          console.warn("realtime ws open listener err", err);
        }
      });
    };

    sock.onmessage = (e: MessageEvent) => {
      try {
        const parsed: ResponseEnvelope = JSON.parse(e.data);
        console.log("[Realtime WS←]", parsed.domain, parsed.type, parsed);

        if (parsed.requestId && pending.has(parsed.requestId)) {
          const entry = pending.get(parsed.requestId)!;
          window.clearTimeout(entry.timer);
          pending.delete(parsed.requestId);
          if (parsed.type === "ERROR") {
            const err = parsed.error ?? (parsed.data as ErrorPayload | undefined);
            entry.reject(new Error(err?.message ?? "REALTIME_WS_ERROR"));
          } else {
            entry.resolve(parsed);
          }
        }

        // 요청자 응답 여부와 무관하게 도메인별 구독자에게도 전달
        listeners.forEach(fn => {
          try {
            fn(parsed);
          } catch (err) {
            console.warn("realtime ws listener err", err);
          }
        });
      } catch {
        console.warn("[Realtime WS] Non-JSON message:", e.data);
      }
    };

    sock.onerror = (ev: Event) => {
      console.warn("[Realtime WS error]", ev);
    };

    sock.onclose = (ev: CloseEvent) => {
      console.warn("[Realtime WS close]", ev.code, ev.reason);
      rejectAllPending("REALTIME_WS_CLOSED");
      closeListeners.forEach(fn => {
        try {
          fn(ev);
        } catch (err) {
          console.warn("realtime ws close listener err", err);
        }
      });
      ws = null;
      connectPromise = null;

      if (isManualClose) {
        console.log("[Realtime WS] Manual disconnect. No reconnect.");
        return;
      }

      if (!hasToken()) return;

      if (!reconnectTimer) {
        const delay = Math.min(500 * 2 ** reconnectAttempt, 8000);
        reconnectTimer = window.setTimeout(() => {
          reconnectTimer = null;
          reconnectAttempt++;
          connectRealtimeWs({ origin });
        }, delay);
      }
    };

    return ws!;
  })();

  const result = await connectPromise;
  connectPromise = null;
  return result;
};

export const disconnectRealtimeWs = () => {
  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    isManualClose = true;
    ws.close();
  }
  ws = null;
  rejectAllPending("REALTIME_WS_DISCONNECTED");
};

export const realtimeWsState = () => ws?.readyState; // 0/1/2/3
export const isRealtimeWsOpen = () => ws?.readyState === WebSocket.OPEN;

// requestId 기반 요청 → 매칭되는 응답(or ERROR)을 Promise로 반환
export const sendRealtimeRequest = <
  TData = unknown,
  TPayload = Record<string, unknown>,
>(
  domain: RealtimeDomain,
  action: string,
  payload: TPayload,
): Promise<ResponseEnvelope<TData>> => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return Promise.reject(new Error("REALTIME_WS_NOT_OPEN"));
  }

  const requestId = genRequestId();
  const envelope: RequestEnvelope<TPayload> = {
    version: REALTIME_PROTOCOL_VERSION,
    domain,
    action,
    requestId,
    payload,
  };

  return new Promise<ResponseEnvelope<TData>>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      pending.delete(requestId);
      reject(new Error("REALTIME_WS_TIMEOUT"));
    }, REQUEST_TIMEOUT_MS);

    pending.set(requestId, {
      resolve: resolve as (msg: ResponseEnvelope) => void,
      reject,
      timer,
    });

    console.log("[Realtime WS→]", domain, action, envelope);
    ws!.send(JSON.stringify(envelope));
  });
};

// 응답(ack)을 기다리지 않는 전송. ack/브로드캐스트는 addRealtimeListener로 별도 수신한다.
export const sendRealtimeFireAndForget = (
  domain: RealtimeDomain,
  action: string,
  payload: Record<string, unknown>,
) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.warn("[Realtime WS] not open. drop:", domain, action, payload);
    return false;
  }
  const envelope: RequestEnvelope = {
    version: REALTIME_PROTOCOL_VERSION,
    domain,
    action,
    requestId: genRequestId(),
    payload,
  };
  console.log("[Realtime WS→]", domain, action, envelope);
  ws.send(JSON.stringify(envelope));
  return true;
};
