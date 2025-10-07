import { useEffect, useRef, useState } from "react";
import {
  connectRawWs,
  sendFilesWS,
  sendImagesWS,
  sendMixedWS,
  sendTextWS,
  type IncomingMessage,
  type WsSendFile,
  type WsSendImage,
  addWsListener,
  type ChatRoomListUpdate,
} from "../api/chat/rawWs";
import { useChatWsStore } from "../store/useChatWsStore";
import useUserStore from "../store/useUserStore";

//const getToken = () => localStorage.getItem("accessToken") || "";

// - 재연결 시 서버가 Redis에 저장된 구독을 복원하므로, 여기서 별도 재구독 처리 불필요
export const useRawWsConnect = (opts: {
  memberId: number;
  origin?: string;
}) => {
  const [lastMessage, setLastMessage] = useState<IncomingMessage | null>(null);
  const mounted = useRef(false);
  const [isOpen, setOpen] = useState(false);

  const token =
    useUserStore(s => s.user?.accessToken) ??
    localStorage.getItem("accessToken") ??
    "";

  // 스토어 디스패처
  const applyInbound = useChatWsStore(s => s.applyInbound);
  const applyListUpdate = useChatWsStore(s => s.applyListUpdate); // 🌟새로 사용할 메서드 (아래 설명)

  useEffect(() => {
    mounted.current = true;

    //토큰이 없으면 연결 시도 안 함
    // 토큰 없거나 memberId 무효면 연결 시도하지 않음
    if (!token || !opts.memberId) {
      setOpen(false);
      // console.log("토큰 없음: ");
      return () => {
        mounted.current = false;
      };
    }

    // console.log("토큰 있음: ", token);

    connectRawWs(
      { memberId: opts.memberId, origin: opts.origin },
      {
        onOpen: () => mounted.current && setOpen(true),
        onClose: () => mounted.current && setOpen(false),
        //onMessage: msg => mounted.current && setLastMessage(msg),
        onMessage: msg => {
          if (!mounted.current) return;
          setLastMessage(msg);

          // WS → 전역 스토어 반영(목록 실시간 갱신)
          if (msg.type === "SEND") {
            applyInbound(msg); // 채팅방을 구독한 상대방에게 가는 브로드캐스트
          }

          // 🌟채팅방 목록을 구독한 상대방에게 가는 브로드캐스트
          if (msg.type === "CHAT_ROOM_LIST_UPDATE") {
            const m = msg as ChatRoomListUpdate;
            applyListUpdate({
              chatRoomId: m.chatRoomId,
              lastMessage: m.lastMessage?.content ?? null,
              timestamp: m.lastMessage?.timestamp ?? null,
              unreadCount: m.newUnreadCount ?? 0,
            });
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

    // 🌟전역 리스너 구독 → 이미 열린 소켓이라도 무조건 수신 가능
    const off = addWsListener(msg => {
      if (!mounted.current) return;
      setLastMessage(msg);
      if (msg.type === "SEND") applyInbound(msg);
      //🌟
      if (msg.type === "CHAT_ROOM_LIST_UPDATE") {
        const m = msg as ChatRoomListUpdate;
        applyListUpdate({
          chatRoomId: m.chatRoomId,
          lastMessage: m.lastMessage?.content ?? null,
          timestamp: m.lastMessage?.timestamp ?? null,
          unreadCount: m.newUnreadCount ?? 0,
        });
      }
    });

    return () => {
      mounted.current = false;
      off(); // 🌟전역 리스너 해제
    };
  }, [opts.memberId, opts.origin, token, applyInbound]);

  return {
    isOpen,
    lastMessage,
    //🌟
    // sendText: (chatRoomId: number, content: string) =>
    //   sendChatWS(chatRoomId, { kind: "text", content }),
    // sendImage: (chatRoomId: number, imgKeys: string[]) =>
    //   sendChatWS(chatRoomId, { kind: "image", imgKeys }),
    sendText: (chatRoomId: number, content: string) =>
      sendTextWS(chatRoomId, content),
    sendImages: (chatRoomId: number, items: WsSendImage[]) =>
      sendImagesWS(chatRoomId, items),
    sendFiles: (chatRoomId: number, items: WsSendFile[]) =>
      sendFilesWS(chatRoomId, items),
    sendMixed: (args: {
      chatRoomId: number;
      content?: string | null;
      files?: WsSendFile[] | null;
      images?: WsSendImage[] | null;
    }) => sendMixedWS(args),
  };
};
