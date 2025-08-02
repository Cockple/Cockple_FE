// 그룹 채팅 테스트 위한 더미데이터
// 내가 속한 모임 더미 데이터
export interface MyGroup {
  partyId: number;
  partyName: string;
  addr1: string;
  addr2: string;
  partyImg: string;
}

export const myGroups: MyGroup[] = [
  {
    partyId: 1,
    partyName: "민턴클로버",
    addr1: "경기도",
    addr2: "성남시",
    partyImg: "https://example.com/images/party1.jpg",
  },
  {
    partyId: 2,
    partyName: "배드민떤",
    addr1: "경기도",
    addr2: "수원시",
    partyImg: "https://example.com/images/party2.jpg",
  },
];
