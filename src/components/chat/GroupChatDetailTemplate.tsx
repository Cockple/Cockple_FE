// 그룹 채팅창 템플릿: ChatDetailTemplate와 동일한 구조/흐름으로 정리

import React, { useEffect, useMemo, useRef, useState } from "react";
//import { useNavigate } from "react-router-dom";

import ChattingComponent from "../common/chat/ChattingComponent";
import ImagePreviewModal from "./ImagePreviewModal";
//import ChatBtn from "../common/DynamicBtn/ChatBtn";
//import ProfileImg from "../../assets/images/Profile_Image.png";
import BottomChatInput from "../common/chat/BottomChatInput";
//import { PageHeader } from "../common/system/header/PageHeader";
import ChatDateSeparator from "./ChatDataSeperator";

// 데이터 훅
import { useChatInfinite } from "../../hooks/useChatInfinite";
import { useChatRead } from "../../hooks/useChatRead";

// WS 연결(원시 WebSocket 전용 훅)
import { useRawWsConnect } from "../../hooks/useRawWsConnect";
import { subscribeRoom, unsubscribeRoom } from "../../api/chat/rawWs";
import type { ChatMessageResponse } from "../../types/chat";
import { formatDateWithDay, formatEnLowerAmPm } from "../../utils/time";
import { uploadImage } from "../../api/image/imageUpload";

// 유저 정보
import useUserStore from "../../store/useUserStore";
import { resolveMemberId, resolveNickname } from "../../utils/auth";
import { LoadingSpinner } from "../common/LoadingSpinner";

// 이모티콘
import EmojiPicker from "../common/chat/EmojiPicker";
import { EMOJIS } from "../common/chat/emojis";

// ===== 유틸: 키 → 표시 URL =====
const S3_BASE = (import.meta.env.VITE_S3_PUBLIC_BASE ?? "").replace(
  /\/?$/,
  "/",
);
const resolveFromKey = (key?: string | null) =>
  key ? `${S3_BASE}${String(key).replace(/^\/+/, "")}` : "";

// URL이 이미지처럼 보이는지(방어적으로) 판별
const looksLikeImageUrl = (u?: string | null) =>
  !!u && /^https?:\/\/.+\.(png|jpe?g|gif|webp|jfif|svg)$/i.test(u);

// 이모티콘 업로드 결과 캐시(중복 업로드 방지)
const emojiUploadCache = new Map<string, { imgKey: string; imgUrl: string }>();

const CenterBox: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex-1 flex items-center justify-center py-8 text-gy-700">
    {children}
  </div>
);

interface GroupChatDetailTemplateProps {
  roomId: number; // 채팅방 ID
}

export const GroupChatDetailTemplate: React.FC<
  GroupChatDetailTemplateProps
> = ({ roomId }) => {
  //const navigate = useNavigate();

  // 실제 로그인 사용자 정보
  const storeUser = useUserStore(s => s.user);
  const currentUserId = storeUser?.memberId ?? resolveMemberId() ?? 0;
  const currentUserName = storeUser?.nickname ?? resolveNickname() ?? "나";

  const {
    messages, // 오름차순
    initLoading,
    initError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetchInitial,
  } = useChatInfinite(roomId);

  // ===== 읽음 처리: 진입/스크롤 하단 도달 시 =====
  const { markReadNow } = useChatRead({
    roomId,
    messages,
    mode: "mock", // TODO: 백엔드 REST/WS 경로 확정 시 "rest" 또는 wsSendFn 적용
  });

  // 방 입장/퇴장: 단일 구독 유지
  useEffect(() => {
    subscribeRoom(roomId);
    return () => {
      unsubscribeRoom(roomId);
    };
  }, [roomId]);

  // ===== 로컬 상태 ====
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false); // ⭐ 이모티콘

  // 낙관적/실시간 메시지 보관
  const [liveMsgs, setLiveMsgs] = useState<ChatMessageResponse[]>([]);

  //  ==== Refs ====
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  // 초기 로드시 맨 아래로 이동
  useEffect(() => {
    if (!initLoading && messages.length) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [initLoading, messages.length]);

  // 상단 센티넬 → 과거 로드
  useEffect(() => {
    const root = scrollAreaRef.current;
    const target = topSentinelRef.current;
    if (!root || !target || !hasNextPage) return;

    const io = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          const prevHeight = root.scrollHeight;
          fetchNextPage().then(() => {
            requestAnimationFrame(() => {
              const newHeight = root.scrollHeight;
              const delta = newHeight - prevHeight;
              root.scrollTop = root.scrollTop + delta; // 점프 방지
            });
          });
        }
      },
      { root, threshold: 0.1 },
    );

    io.observe(target);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 하단 근처 도달 시 읽음 처리
  useEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;

    const onScroll = () => {
      const nearBottom =
        root.scrollHeight - root.scrollTop - root.clientHeight < 60;
      if (nearBottom) markReadNow();
    };

    root.addEventListener("scroll", onScroll);
    return () => root.removeEventListener("scroll", onScroll);
  }, [markReadNow]);

  //===== WS 연결 및 전송 =====
  // ChatDetailTemplate와 동일 인터페이스 사용(sendImages)
  const { sendText, sendImages, lastMessage } = useRawWsConnect({
    memberId: currentUserId,
    origin: "https://cockple.store",
  });

  // 리스트에 그릴 최종 배열(초기 + 실시간/낙관적)
  const rendered = useMemo(
    () => [...messages, ...liveMsgs],
    [messages, liveMsgs],
  );

  // ==== 전송: 텍스트 ====
  const handleSendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const tempId = -Date.now(); // 임시 음수 id
    const optimistic: ChatMessageResponse = {
      messageId: tempId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderProfileImage: "",
      content: text,
      messageType: "TEXT",
      imageUrls: [],
      timestamp: new Date().toISOString(),
      isMyMessage: true,
    };

    setLiveMsgs(prev => [...prev, optimistic]);

    const ok = sendText(roomId, text);
    if (!ok) {
      console.warn("WS 미연결로 전송 실패");
      setLiveMsgs(prev => prev.filter(m => m.messageId !== tempId));
      return;
    }

    setInput("");
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    );
  };

  // ==== 전송: 이미지(다중) ====
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.currentTarget.value = ""; // 같은 파일 재선택 가능
    if (!files.length) return;

    const MAX_MB = 10;
    for (const f of files) {
      if (f.size > MAX_MB * 1024 * 1024) {
        console.warn("파일이 너무 큽니다:", f.name);
        return;
      }
    }

    try {
      // 1) 업로드 (imgKey, imgUrl 수신)
      const uploaded = await Promise.all(
        files.map(async file => {
          const { imgKey, imgUrl } = await uploadImage("CHAT", file);
          const displayUrl = imgUrl || resolveFromKey(imgKey);
          return { imgKey, imgUrl: displayUrl, file };
        }),
      );

      // 2) WS: images[] 전송 (order 1..n)
      const payload = uploaded.map((u, idx) => ({
        imgKey: u.imgKey,
        imgOrder: idx + 1,
        originalFileName: u.file.name,
        fileSize: u.file.size,
        fileType: u.file.type,
      }));
      const ok = sendImages(roomId, payload);
      if (!ok) throw new Error("WS SEND 실패");

      // 3) 낙관적 메시지(각 이미지 1장씩 별 메시지로 표시)
      const now = new Date().toISOString();
      const optimistic: ChatMessageResponse[] = uploaded.map(u => ({
        messageId: -Date.now() - Math.floor(Math.random() * 1000),
        senderId: currentUserId,
        senderName: currentUserName,
        senderProfileImage: "",
        content: "",
        messageType: "TEXT",
        imageUrls: [u.imgUrl],
        timestamp: now,
        isMyMessage: true,
      }));

      setLiveMsgs(prev => [...prev, ...optimistic]);
      requestAnimationFrame(() =>
        bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      );
    } catch (err) {
      console.error(err);
      // 업로드/전송 실패 시 낙관적 추가 이전이라 롤백 불필요
    }
  };

  // ==== 전송: 이모티콘(이미지 플로우로 전송) ====
  const sendEmojiAsImage = async (emojiAssetPath: string) => {
    try {
      if (!emojiUploadCache.has(emojiAssetPath)) {
        const assetUrl = /^https?:\/\//i.test(emojiAssetPath)
          ? emojiAssetPath
          : new URL(emojiAssetPath, import.meta.url).href;

        const blob = await fetch(assetUrl).then(r => r.blob());
        const ext = (blob.type.split("/")[1] || "png").toLowerCase();
        const file = new File([blob], `emoji.${ext}`, {
          type: blob.type || "image/png",
        });

        const { imgKey, imgUrl } = await uploadImage("CHAT", file);
        emojiUploadCache.set(emojiAssetPath, { imgKey, imgUrl });
      }

      const { imgKey, imgUrl } = emojiUploadCache.get(emojiAssetPath)!;

      const ok = sendImages(roomId, [
        {
          imgKey,
          imgOrder: 1,
          originalFileName: "emoji.png",
          fileSize: 0,
          fileType: "image/png",
        },
      ]);
      if (!ok) throw new Error("WS SEND 실패");

      const optimistic: ChatMessageResponse = {
        messageId: -Date.now(),
        senderId: currentUserId,
        senderName: currentUserName,
        senderProfileImage: "",
        content: "",
        messageType: "TEXT",
        imageUrls: [imgUrl],
        timestamp: new Date().toISOString(),
        isMyMessage: true,
      };
      setLiveMsgs(prev => [...prev, optimistic]);

      requestAnimationFrame(() =>
        bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      );
    } catch (e) {
      console.error("[emoji] 전송 실패:", e);
    }
  };

  const handleSendEmoji = (emojiAssetPath: string) => {
    void sendEmojiAsImage(emojiAssetPath);
  };

  // ==== 수신 매핑 ====
  function mapBroadcastToUi(
    msg: import("../../api/chat/rawWs").BroadcastMessage,
    meId: number,
  ): ChatMessageResponse {
    // images[] → URL
    const imgFromArray =
      (msg.images ?? [])
        .slice()
        .sort((a, b) => a.imgOrder - b.imgOrder)
        .map(im => resolveFromKey(im.imgKey)) ?? [];

    // content가 이미지 URL이면(이모티콘 TEXT 케이스 예방)
    const contentIsImg = looksLikeImageUrl(msg.content);
    const finalImgUrls =
      imgFromArray.length > 0
        ? imgFromArray
        : contentIsImg
          ? [msg.content!]
          : [];

    //const isImage = finalImgUrls.length > 0;

    return {
      messageId: msg.messageId,
      senderId: msg.senderId,
      senderName: msg.senderName,
      senderProfileImage: msg.senderProfileImageUrl ?? "",
      // content: isImage ? "" : (msg.content ?? ""),
      // messageType: isImage ? "IMAGE" : "TEXT",
      content: finalImgUrls.length ? "" : (msg.content ?? ""),
      messageType: "TEXT", // ★ WS는 항상 사용자 메시지이므로 TEXT로 고정

      imageUrls: finalImgUrls,
      timestamp: msg.timestamp,
      isMyMessage: msg.senderId === meId,
    };
  }

  // ===== WS 수신 반영 =====
  const lastMessageRef = useRef(lastMessage);
  useEffect(() => {
    lastMessageRef.current = lastMessage;
  }, [lastMessage]);

  useEffect(() => {
    const msg = lastMessageRef.current;
    if (!msg || msg.type !== "SEND") return;
    if (msg.chatRoomId !== roomId) return;

    const incoming = mapBroadcastToUi(msg, currentUserId);

    setLiveMsgs(prev => {
      // 낙관적 메시지와 교체(시간/내용 근접 시)
      const idx = prev.findIndex(
        m =>
          m.messageId < 0 &&
          m.isMyMessage &&
          m.messageType === incoming.messageType &&
          (m.content === incoming.content ||
            (m.messageType === "TEXT" &&
              (m.imageUrls?.length ?? 0) > 0 &&
              (incoming.imageUrls?.length ?? 0) > 0)) &&
          Math.abs(+new Date(m.timestamp) - +new Date(incoming.timestamp)) <
            5000,
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = incoming;
        return copy;
      }
      return [...prev, incoming];
    });

    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    );
  }, [lastMessage, roomId, currentUserId]);

  if (initError) return <div className="p-6">메시지 불러오기 실패</div>;

  return (
    <div className="relative flex flex-col min-h-[87dvh] -mb-8 -mt-4 -mx-4">
      {/* 스크롤 영역 */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden bg-gr-200"
      >
        {/* 상태 UI */}
        {initLoading && <LoadingSpinner />}
        {initError && (
          <CenterBox>
            <div className="flex flex-col items-center gap-3">
              <div>메시지 불러오기 실패</div>
              <button
                className="px-3 py-1 rounded-lg border border-gy-300"
                onClick={() => refetchInitial()}
              >
                다시 시도
              </button>
            </div>
          </CenterBox>
        )}

        {/* 메시지 리스트 */}
        {!initLoading &&
          !initError &&
          (rendered.length === 0 ? (
            <CenterBox>아직 메시지가 없습니다</CenterBox>
          ) : (
            <div className="flex flex-col gap-5 shrink-0 p-4">
              {/* 위쪽 센티넬: 과거 불러오기 트리거 */}
              <div ref={topSentinelRef} />

              {rendered.map((chat, idx) => {
                const prev = idx > 0 ? rendered[idx - 1] : undefined;
                const showDate =
                  !prev ||
                  formatDateWithDay(chat.timestamp) !==
                    formatDateWithDay(prev.timestamp);
                return (
                  <React.Fragment key={chat.messageId}>
                    {showDate && (
                      <ChatDateSeparator
                        date={formatDateWithDay(chat.timestamp)}
                      />
                    )}
                    <ChattingComponent
                      message={chat}
                      isMe={chat.senderId === currentUserId}
                      onImageClick={setPreviewImage}
                      time={formatEnLowerAmPm(chat.timestamp)}
                    />
                  </React.Fragment>
                );
              })}

              {isFetchingNextPage && (
                <div className="text-center text-gy-600 text-sm">
                  이전 메시지 불러오는 중…
                </div>
              )}

              {/* 하단 앵커 */}
              <div className="h-5" ref={bottomRef} />
            </div>
          ))}

        {previewImage && (
          <ImagePreviewModal
            imageUrl={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}
      </div>

      {/* 입력창 */}
      <div className="sticky bottom-0">
        <BottomChatInput
          input={input}
          isComposing={isComposing}
          onInputChange={setInput}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={e => {
            setIsComposing(false);
            setInput(e.currentTarget.value);
          }}
          onSendMessage={handleSendMessage}
          onImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          onToggleEmoji={() => setShowEmoji(v => !v)} // ⭐ 이모티콘 토글
          onFocusInput={() => setShowEmoji(false)} // 입력창 포커스 → 닫기
        />
        {showEmoji && (
          <EmojiPicker emojis={EMOJIS} onSelect={handleSendEmoji} />
        )}
      </div>
    </div>
  );
};
