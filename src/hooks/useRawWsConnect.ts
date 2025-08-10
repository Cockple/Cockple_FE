// hooks/useRawWsConnect.ts
import { useEffect, useRef, useState } from "react";
import {
  connectRawWs,
  disconnectRawWs,
  isRawWsOpen,
  type IncomingMessage,
  type WsStatus,
  subscribeWS,
  sendChatWS,
} from "../api/chat/rawWs";

export const useRawWsConnect = (opts: {
  memberId: number;
  origin?: string;
}) => {
  const [status, setStatus] = useState<WsStatus>("idle");
  const [lastMessage, setLastMessage] = useState<IncomingMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    setStatus("connecting");

    connectRawWs(opts, {
      onOpen: () => mounted.current && setStatus("open"),
      onMessage: data => mounted.current && setLastMessage(data),
      onError: () =>
        mounted.current && (setStatus("error"), setError("WS error")),
      onClose: () => mounted.current && setStatus("closed"),
    });

    return () => {
      disconnectRawWs();
      mounted.current = false;
    };
  }, [opts.memberId, opts.origin]);

  return {
    status,
    isOpen: isRawWsOpen(),
    lastMessage,
    error,
    subscribe: (chatRoomId: number) => subscribeWS(chatRoomId),
    send: (chatRoomId: number, content: string) =>
      sendChatWS(chatRoomId, content),
  };
};
