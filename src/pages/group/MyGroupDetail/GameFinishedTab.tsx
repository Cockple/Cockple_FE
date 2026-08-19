export interface PlayerInfo {
  name: string;
  tag: string;
}

export interface MatchInfo {
  id: number;
  duration: string;
  endTime: string;
  teamA: PlayerInfo[];
  teamB: PlayerInfo[];
}

interface GameFinishedTabProps {
  exerciseId: number;
  // 추후 API 데이터 통신 시 props로 넘겨주거나, 내부에서 useQuery 등으로 호출할 수 있습니다.
  // matches?: MatchInfo[];
}

export const GameFinishedTab = ({ exerciseId }: GameFinishedTabProps) => {
  // TODO: 실제 API 연동 시 아래 더미 배열 대신 서버 상태(useQuery)를 사용하세요.
  // 예: const { data: mockMatches } = useGameFinishedQuery(exerciseId);
  const mockMatches: MatchInfo[] = [
    {
      id: 1,
      duration: "15분",
      endTime: "22:30 완료",
      teamA: [
        { name: "김셰익", tag: "A" },
        { name: "김셰익", tag: "B" }
      ],
      teamB: [
        { name: "김셰익", tag: "C" },
        { name: "김셰익", tag: "준자강" }
      ]
    },
    {
      id: 2,
      duration: "15분",
      endTime: "22:30 완료",
      teamA: [
        { name: "김셰익", tag: "A" },
        { name: "김셰익", tag: "B" }
      ],
      teamB: [
        { name: "김셰익", tag: "C" },
        { name: "김셰익", tag: "준자강" }
      ]
    },
    {
      id: 3,
      duration: "15분",
      endTime: "22:30 완료",
      teamA: [
        { name: "김셰익", tag: "A" },
        { name: "김셰익", tag: "B" }
      ],
      teamB: [
        { name: "김셰익", tag: "C" },
        { name: "김셰익", tag: "준자강" }
      ]
    },
    {
      id: 4,
      duration: "15분",
      endTime: "22:30 완료",
      teamA: [
        { name: "김셰익", tag: "A" },
        { name: "김셰익", tag: "B" }
      ],
      teamB: [
        { name: "김셰익", tag: "C" },
        { name: "김셰익", tag: "준자강" }
      ]
    }
  ];

  return (
    <div className="flex flex-col items-center mt-2 w-full">
      {/* 코트명 (배경색 없음) */}
      <div className="mb-4 text-[#161616] body-md-700">
        01 코트
      </div>

      <div className="flex items-center justify-between w-full px-1">
        {/* 왼쪽 화살표 */}
        <button className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full bg-white shadow-ds300 z-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* 매치 리스트를 담는 회색 배경 컴포넌트 */}
        <div className="flex flex-col gap-4 bg-[#F5F6F8] p-3 rounded-3xl flex-1 max-w-[16rem] mx-2 z-0">
          {mockMatches.map(match => (
            <div key={match.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 w-full flex flex-col gap-3">
              <div className="flex justify-between items-center w-full">
                <span className="px-2 py-1 rounded-lg bg-[#E9F8F0] text-[#1ABB65] body-sm-500">{match.duration}</span>
                <span className="text-[#767B89] body-sm-500">{match.endTime}</span>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="grid grid-cols-2 gap-2 w-full">
                  {match.teamA.map((p, idx) => (
                    <div key={idx} className="bg-[#FFEBEF] rounded-lg py-[0.375rem] flex items-center justify-center gap-1">
                      <span className="text-[#161616] body-rg-500">{p.name}</span>
                      <span className="text-[#767B89] body-rg-500 text-[0.625rem]">{p.tag}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {match.teamB.map((p, idx) => (
                    <div key={idx} className="bg-[#E5EFFF] rounded-lg py-[0.375rem] flex items-center justify-center gap-1">
                      <span className="text-[#161616] body-rg-500">{p.name}</span>
                      <span className="text-[#767B89] body-rg-500 text-[0.625rem]">{p.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 오른쪽 화살표 */}
        <button className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full bg-white shadow-ds300 z-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};
