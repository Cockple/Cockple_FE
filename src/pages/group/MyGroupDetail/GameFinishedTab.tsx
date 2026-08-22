import React, { useState, useMemo, useRef } from "react";
import { useGetCompletedGames } from "../../../api/game/game";

export interface PlayerInfo {
  name: string;
  tag: string;
  team?: "A" | "B";
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
}

export const GameFinishedTab = ({ exerciseId }: GameFinishedTabProps) => {
  const [courtNo, setCourtNo] = useState(1);

  const { data, fetchNextPage, hasNextPage, isLoading } = useGetCompletedGames(
    exerciseId,
    courtNo
  );

  const matches: MatchInfo[] = useMemo(() => {
    if (!data) return [];

    return data.pages.flatMap((page) =>
      page.games.map((game) => {
        const teamA = game.players.filter(p => p.team === "A");
        const teamB = game.players.filter(p => p.team === "B");

        const finalTeamA = teamA.length > 0 ? teamA : game.players.slice(0, Math.ceil(game.players.length / 2));
        const finalTeamB = teamB.length > 0 ? teamB : game.players.slice(Math.ceil(game.players.length / 2));

        return {
          id: game.gameId,
          duration: `${game.durationMin}분`,
          endTime: "완료",
          teamA: finalTeamA.map(p => ({ name: p.name, tag: p.tag })),
          teamB: finalTeamB.map(p => ({ name: p.name, tag: p.tag }))
        };
      })
    );
  }, [data]);

  const handlePrevCourt = () => {
    if (courtNo > 1) setCourtNo((prev) => prev - 1);
  };

  const handleNextCourt = () => {
    setCourtNo((prev) => prev + 1);
  };

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY) * 1.5; // 스크롤 민감도
    scrollRef.current.scrollTop = scrollTop - walk;
  };

  return (
    <div className="flex flex-col items-center mt-2 w-full">
      {/* 코트명 */}
      <div className="mb-4 text-[#121212] header-h5">
        {String(courtNo).padStart(2, '0')} 코트
      </div>

      <div className="flex items-start justify-between w-full px-1">
        {/* 왼쪽 화살표 */}
        <button
          onClick={handlePrevCourt}
          className="w-10 h-10 mt-6 flex shrink-0 items-center justify-center rounded-full bg-white shadow-ds300 z-10 disabled:opacity-50"
          disabled={courtNo <= 1}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* 매치 리스트 */}
        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className={`flex flex-col gap-4 bg-[#F5F6F8] p-3 rounded-t-3xl flex-1 max-w-[16rem] mx-2 z-0 h-[calc(100vh-200px)] overflow-y-auto ${isDragging ? "cursor-grabbing" : "cursor-grab"} select-none scrollbar-hide`}
        >
          {isLoading && <div className="text-center text-sm py-4">로딩 중...</div>}
          {!isLoading && matches.length === 0 && (
            <div className="text-center text-sm py-4 text-gray-500">완료된 게임이 없습니다.</div>
          )}
          {matches.map(match => (
            <div key={match.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 w-full flex flex-col gap-3">
              <div className="flex justify-between items-center w-full">
                <span className="px-2 py-1 rounded-lg bg-[#D8EDDE] text-[#0A7456] body-sm-500">{match.duration}</span>
                <span className="text-[#767B89] body-sm-500">{match.endTime}</span>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="grid grid-cols-2 gap-2 w-full">
                  {match.teamA.map((p, idx) => (
                    <div key={idx} className="bg-[#FEECF4] rounded-lg py-[0.375rem] flex items-center justify-center gap-1">
                      <span className="text-[#121212] body-rg-500">{p.name}</span>
                      <span className="text-[#767B89] body-rg-500 text-[0.625rem]">{p.tag}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {match.teamB.map((p, idx) => (
                    <div key={idx} className="bg-[#E1EEFE] rounded-lg py-[0.375rem] flex items-center justify-center gap-1">
                      <span className="text-[#121212] body-rg-500">{p.name}</span>
                      <span className="text-[#767B89] body-rg-500 text-[0.625rem]">{p.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              className="text-sm text-blue-500 mt-2 hover:underline"
            >
              더보기
            </button>
          )}
        </div>

        {/* 오른쪽 화살표 */}
        <button
          onClick={handleNextCourt}
          className="w-10 h-10 mt-6 flex shrink-0 items-center justify-center rounded-full bg-white shadow-ds300 z-10"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

