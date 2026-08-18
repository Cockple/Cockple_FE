import { useState } from "react";
import AddWhite from "@/assets/icons/add_white.svg";
import Filter from "@/assets/icons/filter.svg";
import Sparkle from "@/assets/icons/sparkle_filled.svg";
import { CourtCard, WaitingCard } from "./CourtCard";
import { GameMemberCard } from "./GameMemberCard";
import {
  mockCourts,
  mockGameMembers,
  mockWaitingGroups,
  type GameMember,
} from "./mockGameBoardData";
import { GameAddPlayerModal } from "./GameAddPlayerModal";

const notReady = () => alert("준비 중인 기능이에요.");

export const GameBoardTab = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [members, setMembers] = useState<GameMember[]>(mockGameMembers);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex min-w-0 flex-col gap-8 pb-28">
      {/* 게임 코트 */}
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="header-h5 text-black">게임 코트</span>
          <button
            type="button"
            className="rounded-lg bg-gy-100 px-4 py-1.5 body-rg-500 text-black"
            onClick={notReady}
          >
            코트 관리
          </button>
        </div>
        <div className="w-full min-w-0 overflow-hidden rounded-[1.5rem] bg-gr-100">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex w-max gap-3 p-2">
              {mockCourts.map(court => (
                <CourtCard
                  key={court.id}
                  label={court.label}
                  timer={court.timer}
                  players={court.players}
                  onComplete={notReady}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 대기 */}
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-center">
          <span className="header-h5 text-black">대기</span>
        </div>
        {mockWaitingGroups.length === 0 ? (
          <div className="flex h-32 w-full items-center justify-center rounded-[1.5rem] bg-[#fff4d2]">
            <span className="body-sm-500 text-gy-700">대기중인 팀이 없어요</span>
          </div>
        ) : (
          <div className="w-full min-w-0 overflow-hidden rounded-[1.5rem] bg-[#fff4d2]">
            <div className="w-full overflow-x-auto scrollbar-hide">
              <div className="flex w-max gap-3 p-2">
                {mockWaitingGroups.map(group => (
                  <WaitingCard
                    key={group.id}
                    label={group.label}
                    players={group.players}
                    onEdit={notReady}
                    onReject={notReady}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 명단 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="header-h5 text-black">명단</span>
          <button
            type="button"
            className="flex size-6 items-center justify-center rounded-lg bg-gr-500"
            onClick={() => setIsAddPlayerOpen(true)}
          >
            <img src={AddWhite} alt="추가" className="size-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="body-rg-500 text-gy-700">전체 {members.length}</span>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-white py-1 pl-1.5 pr-2"
            onClick={notReady}
          >
            <img src={Filter} alt="" className="size-4" />
            <span className="body-rg-500 text-black">필터</span>
          </button>
        </div>
        <div className="flex flex-wrap justify-between gap-y-4">
          {members.map(member => (
            <GameMemberCard
              key={member.id}
              member={member}
              selected={selectedIds.includes(member.id)}
              onToggleSelect={() => toggleSelect(member.id)}
            />
          ))}
        </div>
      </div>

      {/* 하단 선택 바 */}
      <div className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[444px] -translate-x-1/2 items-end gap-[0.5625rem] bg-gradient-to-b from-white/0 via-white/80 to-white px-4 pb-9 pt-2">
        <div className="flex size-[3.25rem] shrink-0 flex-col items-center justify-between">
          <span className="header-h2 text-black">{selectedIds.length}</span>
          <span className="body-sm-500 text-gy-700">선택됨</span>
        </div>
        <button
          type="button"
          className="flex shrink-0 items-center rounded-2xl bg-gr-100 p-2.5 shadow-ds100"
          onClick={notReady}
        >
          <img src={Sparkle} alt="추천" className="size-8" />
        </button>
        <button
          type="button"
          disabled
          className="h-[3.25rem] flex-1 rounded-2xl bg-gy-400 header-h4 text-white shadow-ds100"
        >
          선수를 선택해주세요
        </button>
      </div>

      {isAddPlayerOpen && (
        <GameAddPlayerModal
          onClose={() => setIsAddPlayerOpen(false)}
          onSubmit={player => {
            setMembers(prev => [
              ...prev,
              {
                id: Math.max(0, ...prev.map(m => m.id)) + 1,
                name: player.name,
                gender: player.gender,
                ageGroup: player.ageGroup,
                group: player.level,
                playCount: 0,
                tags: ["미참여"],
                selectable: true,
              },
            ]);
            setIsAddPlayerOpen(false);
          }}
        />
      )}
    </div>
  );
};
