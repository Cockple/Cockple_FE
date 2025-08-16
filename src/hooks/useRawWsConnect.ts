import { useEffect, useRef, useState } from "react";
import {
  connectRawWs,
  sendChatWS,
  type IncomingMessage,
} from "../api/chat/rawWs";
import { useChatWsStore } from "../store/useChatWsStore";

const getToken = () => localStorage.getItem("accessToken") || "";

export const useRawWsConnect = (opts: {
  memberId: number;
  origin?: string;
}) => {
  const [lastMessage, setLastMessage] = useState<IncomingMessage | null>(null);
  const mounted = useRef(false);
  const [isOpen, setOpen] = useState(false);

  // 🌟스토어 디스패처
  const applyInbound = useChatWsStore(s => s.applyInbound);

  useEffect(() => {
    mounted.current = true;

    //토큰이 없으면 연결 시도 안 함
    const token = getToken();
    if (!token) {
      setOpen(false);
      console.log("토큰 없음: ");
      return () => {
        mounted.current = false;
      };
    }

    console.log("토큰 있음: ", token);

    connectRawWs(
      { memberId: opts.memberId, origin: opts.origin },
      {
        onOpen: () => mounted.current && setOpen(true),
        onClose: () => mounted.current && setOpen(false),
        //onMessage: msg => mounted.current && setLastMessage(msg),
        onMessage: msg => {
          if (!mounted.current) return;
          setLastMessage(msg);

          // 🌟 WS → 전역 스토어 반영(목록 실시간 갱신)
          if (msg.type === "SEND") {
            applyInbound(msg);
          }

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
    };
  }, [opts.memberId, opts.origin]);

  return {
    isOpen,
    lastMessage,
    sendText: (chatRoomId: number, content: string) =>
      sendChatWS(chatRoomId, { kind: "text", content }),
    sendImage: (chatRoomId: number, imgKeys: string[]) =>
      sendChatWS(chatRoomId, { kind: "image", imgKeys }),
  };
};
