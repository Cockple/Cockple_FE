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

// ws
import { useRawWsConnect } from "../../hooks/useRawWsConnect";
// import { subscribeRoom, unsubscribeRoom } from "../../api/chat/rawWs";
import { subscribeChatList, unsubscribeChatList } from "../../api/chat/rawWs";
import { useDebounce } from "../../hooks/useDebounce";

// store
import { useChatWsStore } from "../../store/useChatWsStore";
import { resolveMemberId } from "../../utils/auth";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

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

  // 현재 리스트에 보이는 방 id들
  const visibleRoomIds = useMemo(
    () =>
      (activeTab === "group" ? groupChatRooms : personalChatRooms).map(
        c => c.chatRoomId,
      ),
    [activeTab, groupChatRooms, personalChatRooms],
  );

  useEffect(() => {
    if (!isOpen) return;

    const prev = new Set(prevRoomsRef.current);
    const next = new Set(visibleRoomIds);

    //🌟 // 새로 보이게 된 방만 구독
    // for (const id of next) if (!prev.has(id)) subscribeRoom(id);
    // // 더 이상 보이지 않는 방만 해제
    // for (const id of prev) if (!next.has(id)) unsubscribeRoom(id);
    const added: number[] = [];
    const removed: number[] = [];

    for (const id of next) if (!prev.has(id)) added.push(id);
    for (const id of prev) if (!next.has(id)) removed.push(id);

    if (added.length) subscribeChatList(added);
    if (removed.length) unsubscribeChatList(removed);

    prevRoomsRef.current = visibleRoomIds;

    return () => {
      // 서버가 Redis에 구독을 보관하므로, 명시적 해제를 원하지 않는 한 유지합니다.
      //prevRoomsRef.current.forEach(id => unsubscribeRoom(id));
      prevRoomsRef.current = [];
    };
  }, [isOpen, visibleRoomIds]);

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

  return (
    <div className="flex flex-col w-full pt-14">
      <MainHeader />
      <div>
        {/* 네비게이션 탭 */}
        <TabSelector
          options={tabOptions}
          selected={activeTab}
          onChange={setActiveTab}
        />

        <section className="flex flex-col w-full max-w-[23.4375rem] justify-center items-center gap-y-[1.25rem]">
          {/* 검색창 */}
          <SearchInput
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {/* 채팅 리스트 또는 결과 없음 */}
          <div className="flex min-h-[60dvh] overflow-hidden">
            {isLoading ? ( // 로딩 중일 때
              <LoadingSpinner />
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
