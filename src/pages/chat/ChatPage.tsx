// 메인 채팅 페이지
import { useEffect, useState } from "react";
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

  // 전체 목록
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

  // 전체 사용 문자
  // const allChatNames = [
  //   ...groupChatRooms.map((c: GroupChatRoom) => c.partyName),
  //   ...personalChatRooms.map((p: PersonalChatRoom) => p.displayName),
  // ];
  // const allUsedCharacters = useMemo(() => {
  //   return new Set(allChatNames.flatMap(name => [...disassembleHangul(name)]));
  // }, [allChatNames]);

  // // 검색어 유효성
  // const isValidSearch = [...disassembleHangul(searchTerm)].every(char =>
  //   allUsedCharacters.has(char),
  // );

  // 자모 기반 검색
  // const filteredGroupChats = groupChatRooms.filter(chat =>
  //   disassembleHangul(chat.partyName).includes(disassembleHangul(searchTerm)),
  // );
  // const filteredPersonalChats = personalChatRooms.filter(chat =>
  //   disassembleHangul(chat.displayName).includes(disassembleHangul(searchTerm)),
  // );

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
