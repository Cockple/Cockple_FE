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
import api from "../../api/api";

export const GroupChatPage = () => {
  const { groupId } = useParams();
  //const location = useLocation();
  const navigate = useNavigate();
  // const [myParties, setMyParties] = useState<>(); // 나중에 태연이가 PR 올리면 그 파일 사용!!!!
  const [isMember, setIsMember] = useState(false);

  // 나중에 태연이가 PR 올리면 그 파일 사용!!-------------------------------------------------------------------------->
  type MyParties = {
    partyId: number;
    partyName: string;
    addr1: string;
    addr2: string;
    femailLevel: string[];
    maleLevel: string[];
    nextExerciseInfo: string;
    totalExerciseCount: number;
    partyImgUrl: string;
  };

  const getMyParties = async (
    created: false,
    page: 0,
    size: 20,
  ): Promise<MyParties[]> => {
    const res = await api.get(`/api/my/parties`, {
      params: { created, page, size },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log("내 모임 조회: ", res.data.data.content);
    return res.data.data.content;
  };
  //----------------------------------------------------------------------------------------------------------------->

  useEffect(() => {
    const loadMyParties = async () => {
      try {
        const res = await getMyParties(false, 0, 20);
        console.log("내 모임 조회: ", res);
        if (res.some(party => party.partyId === Number(groupId))) {
          setIsMember(true);
        }

        console.log("내 모임인가? : ", isMember);
      } catch (error) {
        console.error("내 모임 조회 실패 : ", error);
      }
    };

    loadMyParties();
  }, [groupId, isMember]);

  if (!groupId) return null;

  //const numericGroupId = parseInt(groupId, 10); // groupId는 string → number로 변환

  // 내가 속한 모임인지 확인 (partyId 목록과 비교)
  //const isMember = myGroups.some(group => group.partyId === numericGroupId);

  // 내가 멤버인 경우
  if (isMember) {
    return (
      <GroupChatDetailTemplate
        chatId={Number(groupId)}
        chatName="" // 추후 수정!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //chatType="group"
        //chatData={groupChatDataMap}
        onBack={() =>
          navigate(`/group/${groupId}`, { state: { tab: "group" } })
        }
      />
    );
  }

  // 내가 멤버가 아닌 경우
  return (
    <GroupChatLockedView
      onJoin={() => {
        navigate(`/group/${groupId}`);
      }}
    />
  );
};
