// api/game/rawWs.ts
// GAME 도메인 실시간 소켓 (Raw WebSocket, SockJS/STOMP 미사용).
// 엔드포인트: GET /ws/realtime?token={accessToken}
// 요청/응답이 requestId로 매칭되는 envelope 구조라, 액션 전송은 Promise 기반 request()로 처리한다.

import useUserStore from "../../store/useUserStore";

let ws: WebSocket | null = null;

export type WsStatus = "idle" | "connecting" | "open" | "closed" | "error";

export const GAME_PROTOCOL_VERSION = 1;
export const GAME_DOMAIN = "GAME" as const;

// ---------- 요청 envelope ----------
export type GameAction =
  | "SUBSCRIBE"
  | "UNSUBSCRIBE"
  | "CREATE_GAME"
  | "START_GAME"
  | "COMPLETE_GAME"
  | "DELETE_GAME"
  | "MOVE_COURT"
  | "MOVE_TO_WAITING";

export type GameRequestEnvelope<TPayload = Record<string, unknown>> = {
  version: number;
  domain: typeof GAME_DOMAIN;
  action: GameAction;
  requestId: string;
  payload: TPayload;
};

// ---------- 응답 envelope ----------
export type GameResponseType =
  | "SUBSCRIBED"
  | "UNSUBSCRIBED"
  | "BOARD_UPDATED"
  | "MEMBERS_UPDATED"
  | "GAME_CREATED"
  | "GAME_DELETED"
  | "ERROR";

export type GameErrorPayload = { code: string; message: string };

// GameBoardDTO.Response (게임 코트 보드 조회 Response와 동일한 스냅샷).
// 아직 해당 명세를 받지 못해 임시로 unknown 처리 — 필드 확정되면 교체.
export type GameBoardSnapshot = unknown;

export type GameResponseEnvelope<TData = unknown> = {
  version: number;
  domain: typeof GAME_DOMAIN;
  type: GameResponseType;
  requestId?: string;
  data?: TData;
  // 명세상 ERROR의 데이터는 "error: { code, message }"로 표기되어 있어
  // 서버가 data 대신 error 필드로 내려줄 가능성을 함께 대비한다.
  error?: GameErrorPayload;
  timestamp: string;
};

//전역 리스너(Event Bus) — SUBSCRIBED 이후의 브로드캐스트(BOARD_UPDATED/MEMBERS_UPDATED 등) 수신용
type MsgListener = (msg: GameResponseEnvelope) => void;
const listeners = new Set<MsgListener>();

export const addGameWsListener = (fn: MsgListener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

type OpenListener = () => void;
type CloseListener = (ev?: CloseEvent) => void;
const openListeners = new Set<OpenListener>();
const closeListeners = new Set<CloseListener>();

export const addGameWsOpenListener = (fn: OpenListener) => {
  openListeners.add(fn);
  return () => {
    openListeners.delete(fn);
  };
};

export const addGameWsCloseListener = (fn: CloseListener) => {
  closeListeners.add(fn);
  return () => {
    closeListeners.delete(fn);
  };
};

// requestId → pending Promise 매칭
type PendingEntry = {
  resolve: (msg: GameResponseEnvelope) => void;
  reject: (err: Error) => void;
  timer: number;
};
const pending = new Map<string, PendingEntry>();
const REQUEST_TIMEOUT_MS = 10000;

// 재연결 백오프
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

const toWsUrl = (origin: string) =>
  origin.replace(/^https:/, "wss:").replace(/^http:/, "ws:");

const buildWsUrl = (origin?: string) => toWsUrl(origin ?? WS_ORIGIN) + WS_REALTIME_PATH;

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

// --------- 공개 API ----------
export const connectGameWs = async ({
  origin,
}: { origin?: string } = {}) => {
  if (!hasToken()) {
    console.info("[GAME WS] skipped: no accessToken");
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

    const sock = new WebSocket(url.toString());
    ws = sock;

    sock.onopen = () => {
      reconnectAttempt = 0;
      isManualClose = false;
      openListeners.forEach(fn => {
        try {
          fn();
        } catch (err) {
          console.warn("game ws open listener err", err);
        }
      });
    };

    sock.onmessage = (e: MessageEvent) => {
      try {
        const parsed: GameResponseEnvelope = JSON.parse(e.data);
        console.log("[GAME WS←]", parsed.type, parsed);

        if (parsed.requestId && pending.has(parsed.requestId)) {
          const entry = pending.get(parsed.requestId)!;
          window.clearTimeout(entry.timer);
          pending.delete(parsed.requestId);
          if (parsed.type === "ERROR") {
            const err = parsed.error ?? (parsed.data as GameErrorPayload | undefined);
            entry.reject(
              new Error(err?.message ?? "GAME_WS_ERROR")
            );
          } else {
            entry.resolve(parsed);
          }
        }

        // 요청자 응답 여부와 무관하게 구독자 브로드캐스트로도 전달
        listeners.forEach(fn => {
          try {
            fn(parsed);
          } catch (err) {
            console.warn("game ws listener err", err);
          }
        });
      } catch {
        console.warn("[GAME WS] Non-JSON message:", e.data);
      }
    };

    sock.onerror = (ev: Event) => {
      console.warn("[GAME WS error]", ev);
    };

    sock.onclose = (ev: CloseEvent) => {
      console.warn("[GAME WS close]", ev.code, ev.reason);
      rejectAllPending("GAME_WS_CLOSED");
      closeListeners.forEach(fn => {
        try {
          fn(ev);
        } catch (err) {
          console.warn("game ws close listener err", err);
        }
      });
      ws = null;
      connectPromise = null;

      if (isManualClose) {
        console.log("[GAME WS] Manual disconnect. No reconnect.");
        return;
      }

      if (!hasToken()) return;

      if (!reconnectTimer) {
        const delay = Math.min(500 * 2 ** reconnectAttempt, 8000);
        reconnectTimer = window.setTimeout(() => {
          reconnectTimer = null;
          reconnectAttempt++;
          connectGameWs({ origin });
        }, delay);
      }
    };

    return ws!;
  })();

  const result = await connectPromise;
  connectPromise = null;
  return result;
};

export const disconnectGameWs = () => {
  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    isManualClose = true;
    ws.close();
  }
  ws = null;
  rejectAllPending("GAME_WS_DISCONNECTED");
};

export const gameWsState = () => ws?.readyState; // 0/1/2/3
export const isGameWsOpen = () => ws?.readyState === WebSocket.OPEN;

// requestId 기반 요청 → 매칭되는 응답(or ERROR)을 Promise로 반환
export const gameWsRequest = <TData = unknown, TPayload = Record<string, unknown>>(
  action: GameAction,
  payload: TPayload,
): Promise<GameResponseEnvelope<TData>> => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return Promise.reject(new Error("GAME_WS_NOT_OPEN"));
  }

  const requestId = genRequestId();
  const envelope: GameRequestEnvelope<TPayload> = {
    version: GAME_PROTOCOL_VERSION,
    domain: GAME_DOMAIN,
    action,
    requestId,
    payload,
  };

  return new Promise<GameResponseEnvelope<TData>>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      pending.delete(requestId);
      reject(new Error("GAME_WS_TIMEOUT"));
    }, REQUEST_TIMEOUT_MS);

    pending.set(requestId, {
      resolve: resolve as (msg: GameResponseEnvelope) => void,
      reject,
      timer,
    });

    console.log("[GAME WS→]", action, envelope);
    ws!.send(JSON.stringify(envelope));
  });
};

// ---------- 액션별 헬퍼 ----------
// 각 액션의 payload/data 필드는 액션별 API 명세가 확정되면 구체 타입으로 교체한다.
export const subscribeGameBoard = (gameBoardId: number) =>
  gameWsRequest<{ gameBoardId: number }>("SUBSCRIBE", { gameBoardId });

export const unsubscribeGameBoard = (gameBoardId: number) =>
  gameWsRequest<{ gameBoardId: number }>("UNSUBSCRIBE", { gameBoardId });

export const createGameWS = (payload: Record<string, unknown>) =>
  gameWsRequest("CREATE_GAME", payload);

export const startGameWS = (payload: Record<string, unknown>) =>
  gameWsRequest("START_GAME", payload);

export const completeGameWS = (payload: Record<string, unknown>) =>
  gameWsRequest("COMPLETE_GAME", payload);

export const deleteGameWS = (payload: Record<string, unknown>) =>
  gameWsRequest("DELETE_GAME", payload);

// 이미 코트에 배정된 경기를 다른 코트로 옮길 때 사용 (피그마상 불필요해 보이나 추후 대비)
export type MoveCourtPayload = {
  gameBoardId: number;
  courtId: number;
  targetCourtNo: number;
};

export const moveCourtWS = (payload: MoveCourtPayload) =>
  gameWsRequest<GameBoardSnapshot>("MOVE_COURT", payload);

export const moveToWaitingWS = (payload: Record<string, unknown>) =>
  gameWsRequest("MOVE_TO_WAITING", payload);
