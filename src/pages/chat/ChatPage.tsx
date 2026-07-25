// 메인 채팅 페이지
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import { groupChats } from "../../components/chat/groupDummy";
//import { personalChats } from "../../components/chat/personalDummy";
import type { GroupChatRoom, PersonalChatRoom } from "../../types/chat";
import SearchInput from "../../components/chat/SearchInput";
import ChatList from "../../components/chat/ChatList";
//import { disassembleHangul } from "../../utils/disassembleHangul";
import TabSelector from "../../components/common/TabSelector";
import { MainHeader } from "../../components/common/system/header/MainHeader";

//api 연결
import {
  getGroupChatRooms,
  getPersonalChatRooms,
  searchGroupChatRooms,
  searchPersonalChatRooms,
} from "../../api/chat/chatList";
import { useUnreadStatus } from "../../api/chat/unreadStatus";

// ws
import { useRawWsConnect } from "../../hooks/useRawWsConnect";
// import { subscribeRoom, unsubscribeRoom } from "../../api/chat/rawWs";
import { subscribeChatList, unsubscribeChatList } from "../../api/chat/rawWs";
import { useDebounce } from "../../hooks/useDebounce";

// store
import { useChatWsStore } from "../../store/useChatWsStore";
import { resolveMemberId } from "../../utils/auth";
import { ChatListSkeleton } from "../../components/chat/ChatListSkeleton";

export const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"group" | "personal">(() => {
    if (location.state && location.state.tab === "personal") {
      return "personal";
    }
    return "group"; // 기본값
  });
  const tabOptions = [
    { label: "모임채팅", value: "group" },
    { label: "개인채팅", value: "personal" },
  ];

  // 안읽음 뱃지
  const unreadStatus = useUnreadStatus();

  // 검색
  const [searchTerm, setSearchTerm] = useState("");
  const debounced = useDebounce(searchTerm.trim(), 300);

  // api 원본 목록
  const [groupChatRooms, setGroupChatRooms] = useState<GroupChatRoom[]>([]);
  const [personalChatRooms, setPersonalChatRooms] = useState<
    PersonalChatRoom[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // ws 연결
  const memberId = resolveMemberId() ?? 0;
  const { isOpen } = useRawWsConnect({
    memberId,
    origin: import.meta.env.VITE_WS_ORIGIN,
  });

  // 🌟전역 스토어
  const hydrateFromAPI = useChatWsStore(s => s.hydrateFromAPI);
  const meta = useChatWsStore(s => s.meta); // { [roomId]: {lastMessage, timestamp, unread} }

  // 전체 목록(최초 로드)
  useEffect(() => {
    setIsLoading(true); // 🌟 로딩 시작
    const fetchChats = async () => {
      try {
        const [groupRes, personalRes] = await Promise.all([
          getGroupChatRooms(),
          getPersonalChatRooms(),
        ]);
        setGroupChatRooms(groupRes.content);
        setPersonalChatRooms(personalRes.content);

        // 🌟 스토어 초기화(목록 메타 반영)
        const seed = [
          ...groupRes.content.map(r => ({
            chatRoomId: r.chatRoomId,
            lastMessage: r.lastMessage?.content ?? null,
            timestamp: r.lastMessage?.timestamp ?? null,
            unreadCount: r.unreadCount ?? 0,
          })),
          ...personalRes.content.map(r => ({
            chatRoomId: r.chatRoomId,
            lastMessage: r.lastMessage?.content ?? null,
            timestamp: r.lastMessage?.timestamp ?? null,
            unreadCount: r.unreadCount ?? 0,
          })),
        ];
        hydrateFromAPI(seed);
      } catch (err) {
        console.error("전체 채팅방 목록 불러오기 실패", err);
      } finally {
        setIsLoading(false); // 🌟 로딩 종료
      }
    };

    fetchChats();
  }, [hydrateFromAPI]);

  // 검색/복원
  useEffect(() => {
    const run = async () => {
      setIsLoading(true); // 🌟 로딩 시작
      try {
        if (activeTab === "group") {
          // 그룹 탭일 때만 그룹 검색/복원
          if (debounced === "") {
            const res = await getGroupChatRooms();
            setGroupChatRooms(res.content);

            //🌟 스토어 동기화
            hydrateFromAPI(
              res.content.map(r => ({
                chatRoomId: r.chatRoomId,
                lastMessage: r.lastMessage?.content ?? null,
                timestamp: r.lastMessage?.timestamp ?? null,
                unreadCount: r.unreadCount ?? 0,
              })),
            );
          } else {
            const res = await searchGroupChatRooms(debounced);
            setGroupChatRooms(res);
          }
        } else {
          // 개인 탭일 때만 개인 검색/복원
          if (debounced === "") {
            const res = await getPersonalChatRooms();
            setPersonalChatRooms(res.content);

            //🌟
            hydrateFromAPI(
              res.content.map(r => ({
                chatRoomId: r.chatRoomId,
                lastMessage: r.lastMessage?.content ?? null,
                timestamp: r.lastMessage?.timestamp ?? null,
                unreadCount: r.unreadCount ?? 0,
              })),
            );
          } else {
            const res = await searchPersonalChatRooms(debounced);
            setPersonalChatRooms(res);
          }
        }
      } catch (e) {
        console.error("검색 실패:", e);
        if (activeTab === "group") setGroupChatRooms([]);
        else setPersonalChatRooms([]);
      } finally {
        setIsLoading(false); // 🌟 로딩 종료
      }
    };
    run();
  }, [activeTab, debounced, hydrateFromAPI]);

  const prevRoomsRef = useRef<number[]>([]);

  // 탭과 무관하게 두 탭 방 전부 구독 (탭 전환해도 실시간 갱신이 끊기지 않도록)
  const visibleRoomIds = useMemo(
    () => [
      ...groupChatRooms.map(c => c.chatRoomId),
      ...personalChatRooms.map(c => c.chatRoomId),
    ],
    [groupChatRooms, personalChatRooms],
  );

  useEffect(() => {
    if (!isOpen) return;

    const prev = new Set(prevRoomsRef.current);
    const next = new Set(visibleRoomIds);

    const added: number[] = [];
    const removed: number[] = [];

    for (const id of next) if (!prev.has(id)) added.push(id);
    for (const id of prev) if (!next.has(id)) removed.push(id);

    if (added.length) subscribeChatList(added);
    if (removed.length) unsubscribeChatList(removed);

    prevRoomsRef.current = visibleRoomIds;
  }, [isOpen, visibleRoomIds]);

  // 채팅 목록 화면을 완전히 벗어날 때, 지금까지 구독해둔 방 전체를 한 번에 해제
  useEffect(() => {
    return () => {
      if (prevRoomsRef.current.length) {
        unsubscribeChatList(prevRoomsRef.current);
      }
    };
  }, []);

  // 렌더 직전, 스토어 메타를 카드 데이터에 덮어쓰기
  const mergedGroup = useMemo(() => {
    return groupChatRooms.map(r => {
      const m = meta[r.chatRoomId];
      if (!m) return r;
      return {
        ...r,
        lastMessage: {
          ...(r.lastMessage ?? {
            messageId: 0,
            content: "",
            timestamp: null,
            messageType: "TEXT" as const,
          }),
          content: m.lastMessage ?? r.lastMessage?.content ?? "",
          timestamp: m.timestamp ?? r.lastMessage?.timestamp ?? null,
        },
        unreadCount: m.unreadCount ?? r.unreadCount ?? 0,
      };
    });
  }, [groupChatRooms, meta]);

  const mergedPersonal = useMemo(() => {
    return personalChatRooms.map(r => {
      const m = meta[r.chatRoomId];
      if (!m) return r;
      return {
        ...r,
        lastMessage: {
          ...(r.lastMessage ?? {
            messageId: 0,
            content: "",
            timestamp: null,
            messageType: "TEXT" as const,
          }),
          content: m.lastMessage ?? r.lastMessage?.content ?? "",
          timestamp: m.timestamp ?? r.lastMessage?.timestamp ?? null,
        },
        unreadCount: m.unreadCount ?? r.unreadCount ?? 0,
      };
    });
  }, [personalChatRooms, meta]);

  // UNREAD_STATUS_UPDATE 외에, 이미 병합된 방별 unreadCount로도 보강
  const hasPartyUnreadFromMeta = mergedGroup.some(r => (r.unreadCount ?? 0) > 0);
  const hasDirectUnreadFromMeta = mergedPersonal.some(
    r => (r.unreadCount ?? 0) > 0,
  );

  return (
    <div className="flex flex-col w-full pt-14">
      <MainHeader />
      <div>
        {/* 네비게이션 탭 */}
        <TabSelector
          options={tabOptions}
          selected={activeTab}
          onChange={setActiveTab}
          dots={{
            group: unreadStatus.hasPartyUnread || hasPartyUnreadFromMeta,
            personal: unreadStatus.hasDirectUnread || hasDirectUnreadFromMeta,
          }}
        />

        <section className="flex flex-col w-full max-w-[23.4375rem] justify-center items-center gap-y-[1.25rem]">
          {/* 검색창 */}
          <SearchInput
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {/* 채팅 리스트 또는 결과 없음 */}
          <div className="flex w-full min-h-[60dvh] overflow-hidden">
            {isLoading ? (
              <ChatListSkeleton type={activeTab} count={6} />
            ) : (
              <ChatList
                tab={activeTab}
                groupChats={mergedGroup}
                personalChats={mergedPersonal}
                searchTerm={searchTerm}
                navigate={navigate}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
