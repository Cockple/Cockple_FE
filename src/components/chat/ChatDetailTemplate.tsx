// 그룹 채팅창과 개인 채팅창에 사용되는 공통 컴포넌트(템플릿)

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import ChattingComponent from "../common/chat/ChattingComponent";
import ImagePreviewModal from "./ImagePreviewModal";
import ChatBtn from "../common/DynamicBtn/ChatBtn";
import ProfileImg from "@/assets/images/Profile_Image.png?url";
import BottomChatInput from "../common/chat/BottomChatInput";
import { PageHeader } from "../common/system/header/PageHeader";
import ChatDateSeparator from "./ChatDataSeperator";
//import { formatTime } from "../../utils/formatDate";

import { useNavigate } from "react-router-dom";
import { useChatInfinite } from "../../hooks/useChatInfinite";
//import { useChatRead } from "../../hooks/useChatRead";

import {
  addWsListener,
  subscribeRoom,
  type IncomingMessage,
} from "../../api/chat/rawWs";
import { useRawWsConnect } from "../../hooks/useRawWsConnect";
import type { ChatMessageResponse } from "../../types/chat";
import { formatDateWithDay, formatEnLowerAmPm } from "../../utils/time";
import { uploadImage } from "../../api/image/imageUpload";

// store
import { useChatWsStore } from "../../store/useChatWsStore";
import { resolveMemberId, resolveNickname } from "../../utils/auth";
import useUserStore from "../../store/useUserStore";
import { LoadingSpinner } from "../common/LoadingSpinner";

// 이모티콘
import EmojiPicker from "../common/chat/EmojiPicker";
import { EMOJIS } from "../common/chat/emojis";
import { useMyProfile } from "../../api/member/my";

// 이미지
import DefaultGroupImg from "@/assets/icons/defaultGroupImg.svg?url";

// ===== 유틸: 키 → 표시 URL =====
const S3_BASE = (import.meta.env.VITE_S3_PUBLIC_BASE ?? "").replace(
  /\/?$/,
  "/",
);
const resolveFromKey = (key?: string | null) =>
  key ? `${S3_BASE}${String(key).replace(/^\/+/, "")}` : null;
const asUrlOrNull = (u?: string | null) => (u && u.trim() ? u : null);

// 이모티콘 업로드 결과 캐시(중복 업로드 방지)
const emojiUploadCache = new Map<string, { imgKey: string; imgUrl: string }>();

// 간단 빈 상태/에러/로딩 UI
const CenterBox: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex-1 flex items-center justify-center py-8 text-gy-700">
    {children}
  </div>
);

interface ChatDetailTemplateProps {
  chatId: number;
  chatName: string;
  chatType: "group" | "personal";
  onBack: () => void;
  showHomeButton?: boolean;
  partyId?: number;
  partyProfileImg?: string;
}

export const ChatDetailTemplate = ({
  chatId,
  chatName,
  onBack,
  showHomeButton = false,
  partyId,
  partyProfileImg,
}: ChatDetailTemplateProps) => {
  const navigate = useNavigate();

  // 로그인 사용자
  const storeUser = useUserStore(s => s.user);
  const currentUserId = storeUser?.memberId ?? resolveMemberId() ?? 0;
  const currentUserName = storeUser?.nickname ?? resolveNickname() ?? "나";

  const { data: myProfile } = useMyProfile();

  // 내 아바타 URL (imgUrl 우선, 없으면 imgKey로 생성, 그래도 없으면 기본 이미지)
  const myAvatarUrl = useMemo(() => {
    const direct = asUrlOrNull(myProfile?.imgUrl);
    if (direct) return direct;
    const fromKey = resolveFromKey(myProfile?.imgKey);
    return fromKey ?? ProfileImg; // 항상 유효한 값 보장
  }, [myProfile]);

  // ==== 초기 히스토리 (오름차순) ====
  const {
    messages, // 오름차순
    initLoading,
    initError,
    initial,
    //isEmpty,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetchInitial,
  } = useChatInfinite(chatId);

  console.log(initial, "이니셜");
  console.log(messages, "채팅메세지");

  //개인채팅방 탈퇴
  const aloneDraw =
    initial?.participants.length == 2 &&
    initial.chatRoomInfo.isCounterPartWithdrawn == true;
  //const aloneDraw = true;

  // ===== 읽음 처리 =====
  // const { markReadNow } = useChatRead({
  //   roomId: Number(chatId),
  //   messages,
  //   mode: "mock", // ← 백엔드 URL 확정되면 "rest"로 교체
  //   // wsSendFn: payload => stompClient.publish({...}) 형태로 주입 가능
  //   //   // TODO(WS): sendReadWS(chatId, payload) 등으로 연결
  //   //   return { lastReadMessageId: payload.lastReadMessageId };
  //   // },
  // });

  // 활성 방/읽음카운트 스토어 연동
  const setActiveRoom = useChatWsStore(s => s.setActiveRoom);
  const clearUnread = useChatWsStore(s => s.clearUnread);

  // 방 입장/퇴장(구독)
  useEffect(() => {
    subscribeRoom(chatId);
    setActiveRoom(chatId); // 상세 입장
    clearUnread(chatId); // 입장 즉시 0으로 (서버 PATCH는 useChatRead에서)

    return () => {
      //unsubscribeRoom(chatId);
      setActiveRoom(null); // 상세 퇴장
    };
  }, [chatId, setActiveRoom, clearUnread]);

  // ===== 로컬 상태 ====
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  //낙관적/실시간 메시지 보관
  const [liveMsgs, setLiveMsgs] = useState<ChatMessageResponse[]>([]);

  // ==== Refs ====
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  // 하단 붙어있음 상태
  const [stickToBottom, setStickToBottom] = useState(true);
  const isNearBottom = (el: HTMLDivElement) =>
    el.scrollHeight - el.scrollTop - el.clientHeight < 80;

  const toggleEmoji = useCallback(() => setShowEmoji(v => !v), []);

  // 초기 로드시 맨 아래로
  useEffect(() => {
    if (!initLoading && messages.length) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [initLoading, messages.length]);

  // 위쪽 센티넬 교차 관찰 → 과거 페이지 로드
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
            // prepend 후 스크롤 점프 방지
            requestAnimationFrame(() => {
              const newHeight = root.scrollHeight;
              const delta = newHeight - prevHeight;
              root.scrollTop = root.scrollTop + delta;
            });
          });
        }
      },
      { root, threshold: 0.1 },
    );

    io.observe(target);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 🌟하단 근처 도달 시 자동 읽음 처리(목업)
  // useEffect(() => {
  //   const root = scrollAreaRef.current;
  //   if (!root) return;

  //   const onScroll = () => {
  //     const nearBottom =
  //       root.scrollHeight - root.scrollTop - root.clientHeight < 60;
  //     if (nearBottom) markReadNow();
  //   };

  //   root.addEventListener("scroll", onScroll);
  //   return () => root.removeEventListener("scroll", onScroll);
  // }, [markReadNow]);
  // 스크롤 시 하단 붙음 상태 추적 (+ 읽음 트리거는 선택)
  useEffect(
    () => {
      const root = scrollAreaRef.current;
      if (!root) return;
      const onScroll = () => {
        setStickToBottom(isNearBottom(root));
        // 읽음 처리 아직 미구현이면 아래는 주석 처리 가능
        // if (isNearBottom(root)) markReadNow();
      };
      root.addEventListener("scroll", onScroll);
      return () => root.removeEventListener("scroll", onScroll);
    },
    [
      /* markReadNow (선택) */
    ],
  );

  // 🌟이미지/이모티콘 로드 시 하단 붙이기(캡처 단계)
  useEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;
    const onMediaLoad = (e: Event) => {
      if (!stickToBottom) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(IMG|VIDEO|CANVAS|IFRAME)$/.test(t.tagName)) {
        requestAnimationFrame(() =>
          bottomRef.current?.scrollIntoView({ behavior: "auto" }),
        );
      }
    };
    root.addEventListener("load", onMediaLoad, true); // 캡처!
    return () => root.removeEventListener("load", onMediaLoad, true);
  }, [stickToBottom]);

  //🌟 레이아웃 변화 방어(이미지 리사이즈, 폰트로드 등)
  useEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;
    const ro = new ResizeObserver(() => {
      if (stickToBottom) {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
      }
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [stickToBottom]);

  //===== WS 연결 및 전송 =====
  //const { sendText, sendImages, lastMessage } = useRawWsConnect({
  const { sendText, sendImages } = useRawWsConnect({
    memberId: currentUserId,
    origin: import.meta.env.VITE_WS_ORIGIN,
  });

  // 리스트에 그릴 최종 배열(초기 + 실시간/낙관적)
  const rendered = useMemo(() => {
    // messages가 오름차순이므로 live는 뒤에 붙인다.
    // 정렬이 필요하면 여기에서 정렬.
    return [...messages, ...liveMsgs];
  }, [messages, liveMsgs]);

  // ==== 전송: 텍스트 ====
  const handleSendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const tempId = -Date.now(); // 임시 음수 id
    const optimisticText: ChatMessageResponse = {
      messageId: tempId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderProfileImageUrl: myAvatarUrl,
      content: text,
      messageType: "TEXT",
      images: [],
      //imageUrls: [],
      timestamp: new Date().toISOString(),
      isMyMessage: true,
    };

    // 1) 즉시 화면 반영
    setLiveMsgs(prev => [...prev, optimisticText]);

    // 2) 서버로 SEND
    const ok = sendText(chatId, text); // 또는 sendChatWS(chatId, text);
    // 실패 시 사용자 안내
    if (!ok) {
      console.warn("WS 미연결로 전송 실패");
      // 전송 실패 시 롤백
      setLiveMsgs(prev => prev.filter(m => m.messageId !== tempId));
      return;
    }

    // 3) 입력 초기화 + 스크롤
    setInput("");
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    );
    console.log("메시지 전송:", text);
  };

  //==== 전송: 이미지(다중) ====
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //
    const files = Array.from(e.target.files ?? []);
    e.currentTarget.value = ""; // 같은 파일 재선택 가능
    if (!files.length) return;

    // 간단 용량 가드
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
          const displayUrl = asUrlOrNull(imgUrl) || resolveFromKey(imgKey);
          if (!displayUrl) throw new Error("업로드 URL 생성 실패");
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
      const ok = sendImages(chatId, payload);
      if (!ok) throw new Error("WS SEND 실패");

      //3) 낙관적 메시지(각 이미지 1장씩 별 메시지로 표시)
      const now = new Date().toISOString();
      const optimistic: ChatMessageResponse[] = uploaded.map(u => ({
        messageId: -Date.now() - Math.floor(Math.random() * 1000),
        senderId: currentUserId,
        senderName: currentUserName,
        senderProfileImageUrl: myAvatarUrl,
        content: "",
        messageType: "TEXT",
        images: [
          {
            imageId: -1, // 임시
            imageUrl: u.imgUrl,
            imgOrder: 1,
            isEmoji: false,
            originalFileName: u.file.name || "uploadImage",
            fileSize: u.file.size,
            fileType: u.file.type || "image/*",
          },
        ],
        timestamp: now,
        isMyMessage: true,
      }));

      setLiveMsgs((prev: ChatMessageResponse[]) => [...prev, ...optimistic]);
      // 🌟requestAnimationFrame(() =>
      //   bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      // );
      if (stickToBottom) {
        requestAnimationFrame(() =>
          bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        );
      }
    } catch (err) {
      console.error(err);
      // 업로드/전송 실패 시 낙관적 메시지 추가 이전이라 롤백 불필요
    }
  };

  // 이모티콘을 '이미지 전송 플로우'로 보내는 유틸
  const sendEmojiAsImage = async (
    chatRoomId: number,
    emojiAssetPath: string,
  ) => {
    try {
      // 0) 캐시 조회(같은 이모티콘 재사용 시 업로드 생략)
      if (!emojiUploadCache.has(emojiAssetPath)) {
        // 1) 번들 자산 → 실제 URL
        const assetUrl = /^https?:\/\//i.test(emojiAssetPath)
          ? emojiAssetPath
          : new URL(emojiAssetPath, import.meta.url).href;

        // 2) Blob → File
        const blob = await fetch(assetUrl).then(r => r.blob());
        const ext = (blob.type.split("/")[1] || "png").toLowerCase();
        const file = new File([blob], `emoji.${ext}`, {
          type: blob.type || "image/png",
        });

        // 3) 업로드(서버가 주는 imgKey/imgUrl 사용)
        const { imgKey, imgUrl } = await uploadImage("CHAT", file);
        emojiUploadCache.set(emojiAssetPath, { imgKey, imgUrl });
      }

      const { imgKey, imgUrl } = emojiUploadCache.get(emojiAssetPath)!;

      // 4) WS로 images[] 전송
      const ok = sendImages(chatRoomId, [
        {
          imgKey,
          imgOrder: 1,
          originalFileName: "emoji.png",
          fileSize: 0,
          fileType: "image/png",
        },
      ]);
      if (!ok) throw new Error("WS SEND 실패");

      // 5) 낙관적 렌더
      const optimistic: ChatMessageResponse = {
        messageId: -Date.now(),
        senderId: currentUserId,
        senderName: currentUserName,
        senderProfileImageUrl: myAvatarUrl,
        content: "",
        messageType: "TEXT",
        images: [
          {
            imageId: -2,
            imageUrl: imgUrl,
            imgOrder: 1,
            isEmoji: true,
            originalFileName: "emoji.png",
            fileSize: 0,
            fileType: "image/png",
          },
        ],
        //imageUrls: [imgUrl],
        timestamp: new Date().toISOString(),
        isMyMessage: true,
      };
      setLiveMsgs(prev => [...prev, optimistic]);

      // requestAnimationFrame(() =>
      //   bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      // );
      if (stickToBottom) {
        requestAnimationFrame(() =>
          bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        );
      }
    } catch (e) {
      console.error("[emoji] 전송 실패:", e);
    }
  };

  //  기존 'TEXT로 URL 전송' → 이미지 전송 호출
  const handleSendEmoji = (emojiAssetPath: string) => {
    void sendEmojiAsImage(chatId, emojiAssetPath);
  };

  //이미지 프리뷰
  const handleImageClick = (p: { url: string; isEmoji: boolean }) => {
    if (!p.isEmoji) setPreviewImage(p.url); // 이모티콘은 모달X
  };

  // ==== 수신 매핑 ====
  function mapBroadcastToUi(
    msg: import("../../api/chat/rawWs").BroadcastMessage,
    meId: number,
  ): ChatMessageResponse {
    // images[] → URL
    const images = (msg.images ?? [])
      .slice()
      .sort((a, b) => a.imgOrder - b.imgOrder)
      .map(im => ({
        imageId: im.imageId,
        imageUrl: im.imageUrl,
        imgOrder: im.imgOrder,
        isEmoji: !!im.isEmoji,
        originalFileName: im.originalFileName,
        fileSize: im.fileSize,
        fileType: im.fileType,
      }));

    return {
      messageId: msg.messageId,
      senderId: msg.senderId,
      senderName: msg.senderName,
      senderProfileImageUrl: msg.senderProfileImageUrl,
      content: images.length ? "" : (msg.content ?? ""),
      messageType: "TEXT",
      images,
      timestamp: msg.timestamp,
      isMyMessage: msg.senderId === meId,
    };
  }

  // ===== WS 수신 반영 =====
  // const lastMessageRef = useRef(lastMessage);
  // useEffect(() => {
  //   lastMessageRef.current = lastMessage;
  // }, [lastMessage]);

  // useEffect(() => {
  //   const msg = lastMessageRef.current;
  //   if (!msg || msg.type !== "SEND") return;
  //   if (msg.chatRoomId !== chatId) return;

  //   const incoming = mapBroadcastToUi(msg, currentUserId);

  //   setLiveMsgs(prev => {
  //     // 낙관적 메시지와 교체(시간 가까우면)
  //     const idx = prev.findIndex(
  //       m =>
  //         m.messageId < 0 &&
  //         m.isMyMessage &&
  //         m.messageType === incoming.messageType &&
  //         (m.content === incoming.content ||
  //           (m.messageType === "TEXT" &&
  //             (m.images?.length ?? 0) > 0 &&
  //             (incoming.images?.length ?? 0) > 0)) &&
  //         Math.abs(+new Date(m.timestamp) - +new Date(incoming.timestamp)) <
  //           5000,
  //     );
  //     if (idx >= 0) {
  //       const copy = [...prev];
  //       copy[idx] = incoming;
  //       return copy;
  //     }
  //     return [...prev, incoming];
  //   });

  //   // 🌟requestAnimationFrame(() =>
  //   //   bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
  //   // );
  //   if (stickToBottom) {
  //     requestAnimationFrame(() =>
  //       bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
  //     );
  //   }
  // }, [lastMessage, chatId, currentUserId, stickToBottom]);
  // 🌟WS 원본 이벤트를 직접 구독 (타이밍/의존성 이슈 제거)
  useEffect(() => {
    const off = addWsListener((msg: IncomingMessage) => {
      if (msg.type !== "SEND") return;
      if (msg.chatRoomId !== chatId) return;
      const incoming = mapBroadcastToUi(msg, currentUserId);
      console.log("[DETAIL] incoming", msg.type, msg.chatRoomId, chatId); //🌟
      setLiveMsgs(prev => {
        // 교체 매칭(낙관치 ↔ 확정치)
        const idx = prev.findIndex(
          m =>
            m.messageId < 0 &&
            m.isMyMessage &&
            m.messageType === incoming.messageType &&
            (m.content === incoming.content ||
              ((m.images?.length ?? 0) > 0 &&
                (incoming.images?.length ?? 0) > 0 &&
                m.images!.some(oi =>
                  incoming.images!.some(
                    ii =>
                      (oi.originalFileName &&
                        oi.originalFileName === ii.originalFileName) ||
                      (oi.fileSize && oi.fileSize === ii.fileSize),
                  ),
                ))) &&
            Math.abs(+new Date(m.timestamp) - +new Date(incoming.timestamp)) <
              5000,
        );
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = incoming;
          return copy;
        }
        return [...prev, incoming]; // 교체 실패해도 반드시 추가
      });
      if (stickToBottom) {
        requestAnimationFrame(() =>
          bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        );
      }
    });
    return off;
  }, [chatId, currentUserId, stickToBottom]);

  // 외부 클릭으로 닫기
  useEffect(() => {
    if (!showEmoji) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const pickerEl = emojiRef.current;
      const target = e.target as Node | null;

      // (1) 픽커 내부면 무시
      if (pickerEl && target && pickerEl.contains(target)) return;

      // (2) 안전 영역(토글 버튼 등) 클릭이면 무시
      //   => 아래 2)에서 버튼에 data-emoji-safe 부여함
      if (target instanceof Element && target.closest?.("[data-emoji-safe]"))
        return;

      // 그 외 아무 곳이나 클릭 → 닫기
      setShowEmoji(false);
    };

    document.addEventListener("mousedown", handlePointerDown, true);
    document.addEventListener("touchstart", handlePointerDown, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown, true);
      document.removeEventListener("touchstart", handlePointerDown, true);
    };
  }, [showEmoji]);

  // ==== 렌더 ====
  if (initError) return <div className="p-6">메시지 불러오기 실패</div>;

  return (
    <div className="relative flex flex-col min-h-[100dvh] -mb-8 -mt-14 pt-14 -mx-4">
      {/* 헤더 */}
      <PageHeader title={chatName} onBackClick={onBack} />

      {/* 스크롤 영역 */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden bg-gr-200"
      >
        {/* 상단 고정 버튼 */}
        {showHomeButton && (
          <div className="fixed top-[4.25rem] left-1/2 -translate-x-1/2 z-10 mt-2">
            <ChatBtn
              imgSrc={partyProfileImg ? partyProfileImg : DefaultGroupImg}
              onClick={() => {
                navigate(`/group/${partyId}`);
                console.log(`/group/${partyId}로 이동`);
              }}
            >
              모임 홈으로
            </ChatBtn>
          </div>
        )}

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
        {/* {isEmpty && <CenterBox>아직 메시지가 없습니다</CenterBox>} */}

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
                      isAlonedraw={aloneDraw}
                      //isAlonedraw={true}
                      // onImageClick={setPreviewImage}
                      onImageClick={handleImageClick}
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
      {aloneDraw ? (
        <p className="header-h4 bg-gr-200 pb-4">대화가 불가능한 멤버입니다.</p>
      ) : (
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
            //🌟onToggleEmoji={() => setShowEmoji(v => !v)} //
            onToggleEmoji={toggleEmoji}
            onFocusInput={() => setShowEmoji(false)} // 입력창 클릭/포커스 → 닫기
          />
          {/* 입력창 아래에 표시 (카톡처럼) */}
          {showEmoji && (
            //🌟<EmojiPicker emojis={EMOJIS} onSelect={handleSendEmoji} />
            <div
              ref={emojiRef}
              // className="absolute left-0 right-0 bottom-[4.25rem] z-50" // 필요시 위치 조정
            >
              <EmojiPicker emojis={EMOJIS} onSelect={handleSendEmoji} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
