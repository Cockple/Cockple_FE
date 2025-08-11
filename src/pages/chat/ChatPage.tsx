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
import { useRawWsConnect } from "../../hooks/useRawWsConnect";
import { subscribeRoom, unsubscribeRoom } from "../../api/chat/rawWs";

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

  //채팅방 api 연결
  const [searchTerm, setSearchTerm] = useState("");

  const [groupChatRooms, setGroupChatRooms] = useState<GroupChatRoom[]>([]);
  const [personalChatRooms, setPersonalChatRooms] = useState<
    PersonalChatRoom[]
  >([]);

  // 🌟전역 소켓 상태(열림 여부·수신 메시지)
  const memberId = Number(localStorage.getItem("memberId") || 1);
  // const { isOpen, lastMessage } = useRawWsConnect({
  const { isOpen } = useRawWsConnect({
    memberId,
    origin: "https://cockple.store",
  });

  // 전체 목록(최초 로드)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const [groupRes, personalRes] = await Promise.all([
          getGroupChatRooms(),
          getPersonalChatRooms(),
        ]);
        setGroupChatRooms(groupRes.content);
        setPersonalChatRooms(personalRes.content);
      } catch (err) {
        console.error("전체 채팅방 목록 불러오기 실패", err);
      }
    };

    fetchChats();
  }, []);

  //모임 채팅방 검색
  useEffect(() => {
    const fetchSearchedGroupChats = async () => {
      try {
        const res = await searchGroupChatRooms(searchTerm);
        setGroupChatRooms(res);
      } catch (error) {
        console.error("검색어 입력 실패: ", error);
        setGroupChatRooms([]);
      }
    };

    fetchSearchedGroupChats();
  }, [searchTerm]);

  //개인 채팅방 검색
  useEffect(() => {
    const fetchSearchedPeronalChats = async () => {
      try {
        const res = await searchPersonalChatRooms(searchTerm);
        setPersonalChatRooms(res);
      } catch (error) {
        console.error("검색어 입력 실패: ", error);
        setPersonalChatRooms([]);
      }
    };

    fetchSearchedPeronalChats();
  }, [searchTerm]);

  //🌟
  const prevRoomsRef = useRef<number[]>([]);

  // 🌟현재 리스트에 보이는 방 id들
  const visibleRoomIds = useMemo(
    () =>
      (activeTab === "group" ? groupChatRooms : personalChatRooms).map(
        c => c.chatRoomId,
      ),
    [activeTab, groupChatRooms, personalChatRooms],
  );

  // 🌟
  useEffect(() => {
    if (!isOpen) return;

    const prev = new Set(prevRoomsRef.current);
    const next = new Set(visibleRoomIds);

    // 새로 보이게 된 방만 구독
    for (const id of next) if (!prev.has(id)) subscribeRoom(id);
    // 더 이상 보이지 않는 방만 해제
    for (const id of prev) if (!next.has(id)) unsubscribeRoom(id);

    prevRoomsRef.current = visibleRoomIds;

    // 페이지 완전히 떠날 때만 모두 해제(상세 페이지에서 단일 구독 예정)
    return () => {
      prevRoomsRef.current.forEach(id => unsubscribeRoom(id));
      prevRoomsRef.current = [];
    };
  }, [isOpen, visibleRoomIds]);

  // 🌟실시간 수신 → 마지막 메시지/미읽음 카운트 갱신
  // useEffect(() => {
  //   if (!lastMessage || lastMessage.type !== "SEND") return;
  //   const { chatRoomId, content, createdAt } = lastMessage;

  //   const patch = <T extends { chatRoomId:number; unreadCount:number; lastMessage }>(list: T[]) =>
  //     list.map(item =>
  //       item.chatRoomId === chatRoomId
  //         ? {
  //             ...item,
  //             lastMessage: {
  //               ...(item).lastMessage,
  //               content,
  //               timestamp: createdAt,
  //             },
  //             unreadCount: item.unreadCount + 1,
  //           }
  //         : item
  //     );

  //   setGroupChatRooms(prev => patch(prev));
  //   setPersonalChatRooms(prev => patch(prev));
  // }, [lastMessage]);

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
            <ChatList
              tab={activeTab}
              groupChats={groupChatRooms}
              personalChats={personalChatRooms}
              isValidSearch={true}
              searchTerm={searchTerm}
              navigate={navigate}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
