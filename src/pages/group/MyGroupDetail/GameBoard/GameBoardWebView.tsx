import { useState } from "react";
import clsx from "clsx";
import { DndContext } from "@dnd-kit/core";
import AddWhite from "@/assets/icons/add_white.svg";
import Sparkle from "@/assets/icons/sparkle_filled.svg";
import Dismiss from "@/assets/icons/dismiss.svg";
import ArrowLeft from "@/assets/icons/arrow_left.svg";
import Filter from "@/assets/icons/filter.svg";
import { CourtCard, WaitingCard } from "./CourtCard";
import { GameMemberCard } from "./GameMemberCard";
import { GameEndModal } from "./GameEndModal";
import {
  type CourtGroup,
  type GameMember,
  type WaitingGroup,
} from "./mockGameBoardData";

interface GameBoardWebViewProps {
  courts: CourtGroup[];
  onCompleteCourt: (courtId: number) => void;
  waitingGroups: WaitingGroup[];
  onRemoveWaitingGroup: (id: number) => void;
  onMoveToCourt: (waitingGroupId: number, courtId: number) => void;
  onChangeWaitingGroup: (group: WaitingGroup) => void;
  onAddToWaitingQueue: () => void;
  onAutoMatch: () => void;
  members: GameMember[];
  selectedIds: number[];
  toggleSelect: (id: number) => void;
  onToggleParticipation: (id: number) => void;
  onEditMember: (id: number) => void;
  onAddPlayer: () => void;
  onManageCourts: () => void;
  onOpenFilter: () => void;
  onClose: () => void;
}

export const GameBoardWebView = ({
  courts,
  onCompleteCourt,
  waitingGroups,
  onRemoveWaitingGroup,
  onMoveToCourt,
  onChangeWaitingGroup,
  onAddToWaitingQueue,
  onAutoMatch,
  members,
  selectedIds,
  toggleSelect,
  onToggleParticipation,
  onEditMember,
  onAddPlayer,
  onManageCourts,
  onOpenFilter,
  onClose,
}: GameBoardWebViewProps) => {
  const selectedMembers = members.filter(m => selectedIds.includes(m.id));
  const [completingCourtId, setCompletingCourtId] = useState<number | null>(
    null,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-gy-100 bg-white px-6">
        <button
          type="button"
          className="flex items-center rounded-lg p-1"
          onClick={onClose}
        >
          <img src={ArrowLeft} className="w-6" alt="닫기" />
        </button>
        <span className="header-h4 text-black">게임판</span>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-10 py-8">
        <DndContext sensors={[]}>
          {/* 게임 코트 */}
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="header-h5 text-black">게임 코트</span>
              <button
                type="button"
                className="rounded-lg bg-gy-100 px-4 py-1.5 body-rg-500 text-black"
                onClick={onManageCourts}
              >
                코트 관리
              </button>
            </div>
            <div className="w-full min-w-0 overflow-hidden rounded-[1.5rem] bg-gr-100">
              <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="flex w-max gap-3 p-2">
                  {courts.map(court => (
                    <CourtCard
                      key={court.id}
                      courtId={court.id}
                      label={court.label}
                      timer={court.timer}
                      players={court.players}
                      onComplete={() => setCompletingCourtId(court.id)}
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
            {waitingGroups.length === 0 ? (
              <div className="flex h-32 w-full items-center justify-center rounded-[1.5rem] bg-[#fff4d2]">
                <span className="body-sm-500 text-gy-700">
                  대기중인 팀이 없어요
                </span>
              </div>
            ) : (
              <div className="w-full min-w-0 overflow-hidden rounded-[1.5rem] bg-[#fff4d2]">
                <div className="w-full overflow-x-auto scrollbar-hide">
                  <div className="flex w-max gap-3 p-2">
                    {waitingGroups.map(group => (
                      <WaitingCard
                        key={group.id}
                        waitingGroupId={group.id}
                        label={group.label}
                        players={group.players}
                        courts={courts}
                        onMoveToCourt={courtId =>
                          onMoveToCourt(group.id, courtId)
                        }
                        onChange={() => onChangeWaitingGroup(group)}
                        onReject={() => onRemoveWaitingGroup(group.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DndContext>

        {/* 명단 */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="header-h5 text-black">명단</span>
              <button
                type="button"
                className="flex size-6 items-center justify-center rounded-lg bg-gr-500"
                onClick={onAddPlayer}
              >
                <img src={AddWhite} alt="추가" className="size-4" />
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-gy-100 py-1 pl-1.5 pr-2"
                onClick={onOpenFilter}
              >
                <img src={Filter} alt="" className="size-4" />
                <span className="body-rg-500 text-black">필터</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedMembers.map((m, i) => (
                    <button
                      key={m.id}
                      type="button"
                      className={clsx(
                        "flex items-center gap-1 rounded-xl py-1 pl-2 pr-1.5 body-sm-500 text-black",
                        i % 2 === 0 ? "bg-[#feecf4]" : "bg-[#e1eefe]",
                      )}
                      onClick={() => toggleSelect(m.id)}
                    >
                      {m.name}({m.group})
                      <img src={Dismiss} alt="선택 해제" className="size-4" />
                    </button>
                  ))}
                </div>
              )}
              <div className="flex shrink-0 items-center gap-1">
                <span className="header-h3 text-black">
                  {selectedIds.length}
                </span>
                <span className="body-sm-500 text-gy-700">선택됨</span>
              </div>
              <button
                type="button"
                className="flex shrink-0 items-center rounded-lg bg-gr-100 p-1.5 shadow-ds100"
                onClick={onAutoMatch}
              >
                <img src={Sparkle} alt="추천" className="size-5" />
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                className="flex w-[10.3125rem] shrink-0 items-center justify-center rounded-lg bg-gr-600 px-4 py-2 body-sm-500 text-white disabled:bg-gy-400"
                onClick={onAddToWaitingQueue}
              >
                대기열 추가
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-4">
            {members.map(member => (
              <GameMemberCard
                key={member.id}
                member={member}
                selected={selectedIds.includes(member.id)}
                onToggleSelect={() => toggleSelect(member.id)}
                onEditInfo={() => onEditMember(member.id)}
                onToggleParticipation={() => onToggleParticipation(member.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {completingCourtId !== null && (
        <GameEndModal
          onClose={() => setCompletingCourtId(null)}
          onConfirm={() => {
            onCompleteCourt(completingCourtId);
            setCompletingCourtId(null);
          }}
        />
      )}
    </div>
  );
};
