// 그룹채팅창 페이지

import { useParams, useNavigate } from "react-router-dom";
//import { ChatDetailTemplate } from "../../components/chat/ChatDetailTemplate";
//import ProfileImg from "../../assets/images/Profile_Image.png";
//import type { ChatMessageResponse } from "../../types/chat";
//import { groupChatDataMap } from "../../components/chat/groupChatMessageDummy";
import { GroupChatDetailTemplate } from "../../components/chat/GroupChatDetailTemplate";
//import { myGroups } from "../../components/chat/myGroupsDummy";
import GroupChatLockedView from "../../components/common/chat/GroupChatLock";
import { useEffect, useState } from "react";
//import api from "../../api/api";
import { getRoomIdByPartyId } from "../../api/chat/getRoomIdByPartyId";
import { useGetMyPartySimple } from "../../api/party/getMyPartySimple";

export const GroupChatPage = () => {
  const { groupId } = useParams();
  //const location = useLocation();
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);

  // 내 모임 simple 조회
  const { data: myPartiesData, isLoading: loadingParties } =
    useGetMyPartySimple();

  useEffect(() => {
    if (!groupId || !myPartiesData) return;

    const allParties = myPartiesData.pages.flatMap(p => p.content);
    setIsMember(allParties.some(p => p.partyId === Number(groupId)));
  }, [groupId, myPartiesData]);

  // 룸ID 확보
  useEffect(() => {
    if (!groupId) return;

    (async () => {
      try {
        setLoadingRoom(true);
        const id = await getRoomIdByPartyId(Number(groupId));
        setRoomId(id);
        setRoomError(null);
      } catch (e) {
        console.error(e);
        setRoomError("채팅방 정보를 불러오지 못했습니다.");
      } finally {
        setLoadingRoom(false);
      }
    })();
  }, [groupId, roomId]);

  if (!groupId) return null;

  //🌟
  if (loadingParties) {
    return <div className="p-6">내 모임 정보를 불러오는 중…</div>;
  }

  if (!isMember) {
    return <GroupChatLockedView onJoin={() => navigate(`/group/${groupId}`)} />;
  }

  //🌟
  if (!roomId) {
    return (
      <div className="p-6">
        {roomError ??
          (loadingRoom
            ? "채팅방 정보를 불러오는 중…"
            : "채팅방 정보가 없습니다")}
      </div>
    );
  }

  return (
    <GroupChatDetailTemplate
      roomId={roomId} // roomId 전달
    />
  );
};
