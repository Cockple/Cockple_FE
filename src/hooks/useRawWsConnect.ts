// hooks/useRawWsConnect.ts
import { useEffect, useRef, useState } from "react";
import {
  connectRawWs,
  sendChatWS,
  //disconnectRawWs,
  //isRawWsOpen,
  type IncomingMessage,
  //type WsStatus,
  //subscribeWS,
  //sendChatWS,
} from "../api/chat/rawWs";

export const useRawWsConnect = (opts: {
  memberId: number;
  origin?: string;
  //chatRommId?: number;
}) => {
  //const [status, setStatus] = useState<WsStatus>("idle");
  const [lastMessage, setLastMessage] = useState<IncomingMessage | null>(null);
  //const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);

  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    mounted.current = true;
    //setStatus("connecting");

    connectRawWs(
      { memberId: opts.memberId, origin: opts.origin },
      {
        onOpen: () => mounted.current && setOpen(true),
        onClose: () => mounted.current && setOpen(false),
        //onMessage: msg => mounted.current && setLastMessage(msg),
        //🌟
        onMessage: msg => {
          if (!mounted.current) return;
          setLastMessage(msg);
          // 해제 ACK 로깅
          if (
            (msg.type === "UNSUBSCRIBE" || msg.type === "SUBSCRIBE") &&
            "message" in msg &&
            "chatRoomId" in msg
          ) {
            console.log(
              `[WS] ${msg.type} ACK #${msg.chatRoomId}: ${msg.message}`,
            );
          }
        },
        onError: () => mounted.current && setOpen(false),
      },
    );

    return () => {
      mounted.current = false;
      // 전역 소켓을 앱 루트에서만 끊고 싶다면 여기서는 끊지 마세요.
      // 페이지 단위라면 끊어도 됨.
      // disconnectRawWs();
    };
  }, [opts.memberId, opts.origin]);

  return {
    //status,
    //isOpen: isRawWsOpen(),
    //isOpen: status === "open",
    isOpen,
    lastMessage,
    send: (chatRoomId: number, content: string) =>
      sendChatWS(chatRoomId, content),
  };
};
