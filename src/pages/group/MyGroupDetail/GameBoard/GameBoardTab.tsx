import { useState } from "react";
import clsx from "clsx";
import AddWhite from "@/assets/icons/add_white.svg";
import Filter from "@/assets/icons/filter.svg";
import Sparkle from "@/assets/icons/sparkle_filled.svg";
import Dismiss from "@/assets/icons/dismiss.svg";
import { CourtCard, WaitingCard } from "./CourtCard";
import { GameMemberCard } from "./GameMemberCard";
import {
  mockCourts,
  mockGameMembers,
  mockWaitingGroups,
  type CourtGroup,
  type GameMember,
  type WaitingGroup,
} from "./mockGameBoardData";
import { GameAddPlayerModal } from "./GameAddPlayerModal";
import {
  GameEditPlayerModal,
  type EditedGamePlayer,
} from "./GameEditPlayerModal";
import { GameBoardWebView } from "./GameBoardWebView";
import { CourtManageBottomSheet } from "./CourtManageBottomSheet";
import { GameFilterPage } from "./GameFilterPage";
import { GameEndModal } from "./GameEndModal";
import { GameDuplicateCheckModal } from "./GameDuplicateCheckModal";
import { notReady } from "./gameBoardShared";

export const GameBoardTab = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [members, setMembers] = useState<GameMember[]>(mockGameMembers);
  const [courts, setCourts] = useState<CourtGroup[]>(mockCourts);
  const [waitingGroups, setWaitingGroups] =
    useState<WaitingGroup[]>(mockWaitingGroups);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [isWebViewOpen, setIsWebViewOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDuplicateCheckOpen, setIsDuplicateCheckOpen] = useState(false);
  const [completingCourtId, setCompletingCourtId] = useState<number | null>(
    null,
  );
  const [courtManageVariant, setCourtManageVariant] = useState<
    "sheet" | "overlay" | null
  >(() => (mockCourts.length === 0 ? "sheet" : null));

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id],
    );
  };

  const selectedMembers = members.filter(m => selectedIds.includes(m.id));
  const editingMember =
    members.find(m => m.id === editingMemberId) ?? null;

  const handleSaveMemberEdit = (updated: EditedGamePlayer) => {
    if (editingMemberId === null) return;
    setMembers(prev =>
      prev.map(m =>
        m.id === editingMemberId
          ? {
              ...m,
              name: updated.name,
              gender: updated.gender,
              group: updated.level,
              ageGroup: updated.ageGroup,
            }
          : m,
      ),
    );
    setEditingMemberId(null);
  };

  const handleAddPlayer = (player: {
    name: string;
    gender: "MALE" | "FEMALE";
    level: string;
    ageGroup: string;
  }) => {
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
  };

  const handleToggleParticipation = (id: number) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id !== id) return m;
        const isWithdrawn = m.tags.includes("미참여");
        return isWithdrawn
          ? { ...m, tags: m.tags.filter(t => t !== "미참여"), selectable: true }
          : { ...m, tags: ["미참여"], selectable: false };
      }),
    );
    setSelectedIds(prev => prev.filter(v => v !== id));
  };

  const handleRemoveWaitingGroup = (id: number) => {
    setWaitingGroups(prev => prev.filter(group => group.id !== id));
  };

  const handleAddToWaitingQueue = () => {
    if (selectedMembers.length === 0) return;
    const newGroup: WaitingGroup = {
      id: Date.now(),
      label: `대기 ${waitingGroups.length + 1}번`,
      memberIds: selectedMembers.map(m => m.id),
      players: selectedMembers.map((m, i) => ({
        id: m.id,
        name: m.name,
        group: m.group,
        color: i % 2 === 0 ? "pink" : "blue",
      })),
    };
    setWaitingGroups(prev => [...prev, newGroup]);
    setSelectedIds([]);
  };

  const handleChangeWaitingGroup = (group: WaitingGroup) => {
    handleRemoveWaitingGroup(group.id);
    setSelectedIds(group.memberIds);
  };

  const handleMoveToCourt = (waitingGroupId: number, courtId: number) => {
    const group = waitingGroups.find(g => g.id === waitingGroupId);
    if (!group) return;
    setCourts(prev =>
      prev.map(c => (c.id === courtId ? { ...c, players: group.players } : c)),
    );
    handleRemoveWaitingGroup(waitingGroupId);
  };

  const handleCompleteCourt = (courtId: number) => {
    setCourts(prev =>
      prev.map(c =>
        c.id === courtId ? { ...c, players: null, timer: undefined } : c,
      ),
    );
    setCompletingCourtId(null);
  };

  const handleSaveCourts = (labels: string[]) => {
    setCourts(prev =>
      labels.map((label, index) => {
        const existing = prev[index];
        return existing
          ? { ...existing, label }
          : { id: Date.now() + index, label, players: null };
      }),
    );
    setCourtManageVariant(null);
  };

  return (
    <div className="flex min-w-0 flex-col gap-8 pb-28">
      {/* 게임 코트 */}
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="header-h5 text-black">게임 코트</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="웹으로 보기"
              className="flex items-center justify-center rounded-lg bg-gy-100 p-1.5 text-black"
              onClick={() => setIsWebViewOpen(true)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 9V4H9M20 9V4H15M4 15V20H9M20 15V20H15" />
              </svg>
            </button>
            <button
              type="button"
              className="rounded-lg bg-gy-100 px-4 py-1.5 body-rg-500 text-black"
              onClick={() => setCourtManageVariant("sheet")}
            >
              코트 관리
            </button>
          </div>
        </div>
        <div className="w-full min-w-0 overflow-hidden rounded-[1.5rem] bg-gr-100">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex w-max gap-3 p-2">
              {courts.map(court => (
                <CourtCard
                  key={court.id}
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
            <span className="body-sm-500 text-gy-700">대기중인 팀이 없어요</span>
          </div>
        ) : (
          <div className="w-full min-w-0 overflow-hidden rounded-[1.5rem] bg-[#fff4d2]">
            <div className="w-full overflow-x-auto scrollbar-hide">
              <div className="flex w-max gap-3 p-2">
                {waitingGroups.map(group => (
                  <WaitingCard
                    key={group.id}
                    label={group.label}
                    players={group.players}
                    courts={courts}
                    onMoveToCourt={courtId =>
                      handleMoveToCourt(group.id, courtId)
                    }
                    onChange={() => handleChangeWaitingGroup(group)}
                    onReject={() => handleRemoveWaitingGroup(group.id)}
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
            onClick={() => setIsFilterOpen(true)}
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
              onEditInfo={() => setEditingMemberId(member.id)}
              onToggleParticipation={() => handleToggleParticipation(member.id)}
            />
          ))}
        </div>
      </div>

      {/* 하단 선택 바 */}
      <div className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[444px] -translate-x-1/2 flex-col gap-2 bg-gradient-to-b from-white/0 via-white/80 to-white px-4 pb-9 pt-2">
        {selectedMembers.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {selectedMembers.map((m, i) => (
              <button
                key={m.id}
                type="button"
                className={clsx(
                  "flex shrink-0 items-center gap-1 rounded-xl py-1 pl-2 pr-1.5 body-sm-500 text-black shadow-ds50",
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
        <div className="flex items-end gap-[0.5625rem]">
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
          {selectedIds.length > 0 ? (
            <button
              type="button"
              className="h-[3.25rem] flex-1 rounded-2xl bg-gr-600 header-h4 text-white shadow-ds100"
              onClick={() => setIsDuplicateCheckOpen(true)}
            >
              대기열 추가
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="h-[3.25rem] flex-1 rounded-2xl bg-gy-400 header-h4 text-white shadow-ds100"
            >
              선수를 선택해주세요
            </button>
          )}
        </div>
      </div>

      {isWebViewOpen && (
        <GameBoardWebView
          courts={courts}
          onCompleteCourt={handleCompleteCourt}
          waitingGroups={waitingGroups}
          onRemoveWaitingGroup={handleRemoveWaitingGroup}
          onMoveToCourt={handleMoveToCourt}
          onChangeWaitingGroup={handleChangeWaitingGroup}
          onAddToWaitingQueue={() => setIsDuplicateCheckOpen(true)}
          members={members}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          onToggleParticipation={handleToggleParticipation}
          onEditMember={setEditingMemberId}
          onAddPlayer={() => setIsAddPlayerOpen(true)}
          onManageCourts={() => setCourtManageVariant("overlay")}
          onClose={() => setIsWebViewOpen(false)}
        />
      )}

      {isAddPlayerOpen && (
        <GameAddPlayerModal
          onClose={() => setIsAddPlayerOpen(false)}
          onSubmit={handleAddPlayer}
        />
      )}

      {editingMember && (
        <GameEditPlayerModal
          member={editingMember}
          onClose={() => setEditingMemberId(null)}
          onSubmit={handleSaveMemberEdit}
        />
      )}

      {courtManageVariant && (
        <CourtManageBottomSheet
          variant={courtManageVariant}
          courtLabels={courts.map(c => c.label)}
          onClose={() => setCourtManageVariant(null)}
          onSave={handleSaveCourts}
        />
      )}

      {isFilterOpen && (
        <GameFilterPage onClose={() => setIsFilterOpen(false)} />
      )}

      {completingCourtId !== null && (
        <GameEndModal
          onClose={() => setCompletingCourtId(null)}
          onConfirm={() => handleCompleteCourt(completingCourtId)}
        />
      )}

      {isDuplicateCheckOpen && (
        <GameDuplicateCheckModal
          variant={isWebViewOpen ? "overlay" : "sheet"}
          members={selectedMembers}
          onClose={() => setIsDuplicateCheckOpen(false)}
          onConfirm={() => {
            handleAddToWaitingQueue();
            setIsDuplicateCheckOpen(false);
          }}
        />
      )}
    </div>
  );
};
