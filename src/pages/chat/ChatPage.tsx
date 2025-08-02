// 메인 채팅 페이지
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { groupChats } from "../../components/chat/groupDummy";
import { personalChats } from "../../components/chat/personalDummy";
import type { GroupChatRoom, PersonalChatRoom } from "../../types/chat";
import SearchInput from "../../components/chat/SearchInput";
import ChatList from "../../components/chat/ChatList";
import { disassembleHangul } from "../../utils/disassembleHangul";
import TabSelector from "../../components/common/TabSelector";
import { MainHeader } from "../../components/common/system/header/MainHeader";

export const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"group" | "personal">(() => {
    if (location.state && location.state.tab === "personal") {
      return "personal";
    }
    return "group"; // 기본값
  });

  const [searchTerm, setSearchTerm] = useState("");

  const tabOptions = [
    { label: "모임채팅", value: "group" },
    { label: "개인채팅", value: "personal" },
  ];

  // 전체 사용 문자
  const allChatNames = [
    ...groupChats.map((c: GroupChatRoom) => c.partyName),
    ...personalChats.map((p: PersonalChatRoom) => p.otherMember.memberName),
  ];
  const allUsedCharacters = useMemo(() => {
    return new Set(allChatNames.flatMap(name => [...disassembleHangul(name)]));
  }, [allChatNames]);

  // 검색어 유효성
  const isValidSearch = [...disassembleHangul(searchTerm)].every(char =>
    allUsedCharacters.has(char),
  );

  // 자모 기반 검색
  const filteredGroupChats = groupChats.filter(chat =>
    disassembleHangul(chat.partyName).includes(disassembleHangul(searchTerm)),
  );
  const filteredPersonalChats = personalChats.filter(chat =>
    disassembleHangul(chat.otherMember.memberName).includes(
      disassembleHangul(searchTerm),
    ),
  );

  return (
    <div className="flex flex-col w-full h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden pt-14">
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
          <ChatList
            tab={activeTab}
            groupChats={filteredGroupChats}
            personalChats={filteredPersonalChats}
            isValidSearch={isValidSearch}
            searchTerm={searchTerm}
            navigate={navigate}
          />
        </section>
      </div>
    </div>
  );
};
