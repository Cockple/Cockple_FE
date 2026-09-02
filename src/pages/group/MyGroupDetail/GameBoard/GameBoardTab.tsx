import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import AddWhite from "@/assets/icons/add_white.svg";
import Sparkle from "@/assets/icons/sparkle_filled.svg";
import Dismiss from "@/assets/icons/dismiss.svg";
import Expand from "@/assets/icons/expand.svg";
import FilterBtn from "@/components/common/DynamicBtn/FilterBtn";
import { getGameBoard, type GameBoardResponse } from "@/api/game/board";
import {
  createGameBoardMember,
  getGameBoardMembers,
  updateGameBoardMember,
  updateGameBoardMemberParticipation,
  type GameBoardMember,
} from "@/api/game/members";
import { updateCourts } from "@/api/game/courts";
import { postRandomMatch } from "@/api/game/randomMatch";
import { useGameWs } from "@/hooks/useGameWs";
import {
  CourtCard,
  WaitingCard,
  PlayerBadge,
  courtDroppableId,
  waitingDraggableId,
} from "./CourtCard";
import { GameMemberCard } from "./GameMemberCard";
import {
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
import { GameBoardTabSkeleton } from "./GameBoardTabSkeleton";
import { GameRandomMatchFailModal } from "./GameRandomMatchFailModal";
import {
  CourtManageBottomSheet,
  type CourtManageItem,
} from "./CourtManageBottomSheet";
import { GameFilterPage } from "./GameFilterPage";
import { GameEndModal } from "./GameEndModal";
import { GameDuplicateCheckModal } from "./GameDuplicateCheckModal";
import {
  formatElapsed,
  toBoardViewModel,
  toGameBoardMemberPayload,
  toGameBoardMembersParams,
  toGameMember,
  type GameBoardMemberFilters,
} from "./gameBoardAdapter";

const MAX_SELECTED_MEMBERS = 4;

interface GameBoardTabProps {
  gameBoardId: number;
  isManager: boolean;
  /** 헤더 새로고침 버튼을 누를 때마다 증가. 값이 바뀌면 보드/명단을 다시 불러온다. */
  refreshSignal?: number;
  /** 새로고침 요청이 진행 중인지 상위(헤더)로 알린다. */
  onRefreshingChange?: (refreshing: boolean) => void;
}

export const GameBoardTab = ({
  gameBoardId,
  isManager,
  refreshSignal = 0,
  onRefreshingChange,
}: GameBoardTabProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [members, setMembers] = useState<GameMember[]>([]);
  const [courts, setCourts] = useState<CourtGroup[]>([]);
  const [waitingGroups, setWaitingGroups] = useState<WaitingGroup[]>([]);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [isWebViewOpen, setIsWebViewOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDuplicateCheckOpen, setIsDuplicateCheckOpen] = useState(false);
  const [completingCourtId, setCompletingCourtId] = useState<number | null>(
    null,
  );
  const [isRandomMatchFailOpen, setIsRandomMatchFailOpen] = useState(false);
  const [courtManageVariant, setCourtManageVariant] = useState<
    "sheet" | "overlay" | null
  >(null);
  const [filters, setFilters] = useState<GameBoardMemberFilters>({
    levels: [],
    gender: "전체",
    shuttle: null,
  });
  const [activeDragGroup, setActiveDragGroup] = useState<WaitingGroup | null>(
    null,
  );

  const dndSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const gameWs = useGameWs({ gameBoardId });

  const isFilterActive =
    filters.levels.length > 0 ||
    (filters.gender !== null && filters.gender !== "전체") ||
    filters.shuttle !== null;

  const applyBoard = (board: GameBoardResponse) => {
    const { courts: nextCourts, waitingGroups: nextWaitingGroups } =
      toBoardViewModel(board);
    setCourts(nextCourts);
    setWaitingGroups(nextWaitingGroups);
    if (board.courtCount === 0) {
      setCourtManageVariant(prev => prev ?? "sheet");
    }
  };

  const applyMembersResponse = (res: {
    gameBoardMembers: GameBoardMember[];
  }) => {
    setMembers(res.gameBoardMembers.map(toGameMember));
  };

  const refreshMembers = () => {
    getGameBoardMembers(gameBoardId, toGameBoardMembersParams(filters)).then(
      applyMembersResponse,
    );
  };

  const handleApplyFilters = (next: GameBoardMemberFilters) => {
    setFilters(next);
    getGameBoardMembers(gameBoardId, toGameBoardMembersParams(next)).then(
      applyMembersResponse,
    );
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getGameBoard(gameBoardId),
      getGameBoardMembers(gameBoardId, toGameBoardMembersParams(filters)),
    ])
      .then(([board, memberRes]) => {
        applyBoard(board);
        setMembers(memberRes.gameBoardMembers.map(toGameMember));
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameBoardId]);

  // 진행중인 코트의 경과 시간 스톱워치 (startedAt 기준 1초마다 재계산)
  useEffect(() => {
    const id = setInterval(() => {
      setCourts(prev =>
        prev.map(c =>
          c.startedAt ? { ...c, timer: formatElapsed(c.startedAt) } : c,
        ),
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // 소켓이 (재)연결되면 그동안 놓친 변경을 REST로 백필한다.
  // 최초 연결분은 위 마운트 effect가 이미 처리하므로 건너뛴다.
  const hasConnectedRef = useRef(false);
  useEffect(() => {
    if (!gameWs.isOpen) return;
    if (!hasConnectedRef.current) {
      hasConnectedRef.current = true;
      return;
    }
    getGameBoard(gameBoardId)
      .then(applyBoard)
      .catch(() => {});
    refreshMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameWs.isOpen, gameBoardId]);

  // 헤더 새로고침 버튼: 보드/명단을 REST로 다시 불러온다. (초기값 0은 무시)
  useEffect(() => {
    if (!refreshSignal) return;
    let cancelled = false;
    onRefreshingChange?.(true);
    Promise.all([
      getGameBoard(gameBoardId).then(board => {
        if (!cancelled) applyBoard(board);
      }),
      getGameBoardMembers(gameBoardId, toGameBoardMembersParams(filters)).then(
        res => {
          if (!cancelled) applyMembersResponse(res);
        },
      ),
      // 응답이 즉시 와도 회전이 눈에 보이도록 최소 시간 확보
      new Promise(resolve => setTimeout(resolve, 600)),
    ])
      .catch(() => {})
      .finally(() => {
        if (!cancelled) onRefreshingChange?.(false);
      });
    return () => {
      cancelled = true;
      onRefreshingChange?.(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  // 다른 클라이언트의 변경사항 브로드캐스트 반영
  useEffect(() => {
    const msg = gameWs.lastMessage;
    if (!msg) return;

    if (msg.type === "BOARD_UPDATED" && msg.data) {
      applyBoard(msg.data as GameBoardResponse);
      refreshMembers();
    } else if (
      (msg.type === "GAME_CREATED" || msg.type === "GAME_DELETED") &&
      msg.data &&
      typeof msg.data === "object" &&
      "board" in msg.data
    ) {
      applyBoard((msg.data as { board: GameBoardResponse }).board);
      refreshMembers();
    } else if (msg.type === "MEMBERS_UPDATED") {
      refreshMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameWs.lastMessage]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(v => v !== id);
      if (prev.length >= MAX_SELECTED_MEMBERS) return prev;
      return [...prev, id];
    });
  };

  const selectedMembers = members.filter(m => selectedIds.includes(m.id));
  const editingMember = members.find(m => m.id === editingMemberId) ?? null;

  const handleSaveMemberEdit = async (updated: EditedGamePlayer) => {
    if (editingMemberId === null) return;
    const memberId = editingMemberId;
    try {
      await updateGameBoardMember(
        gameBoardId,
        memberId,
        toGameBoardMemberPayload(updated),
      );
      setMembers(prev =>
        prev.map(m =>
          m.id === memberId
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
    } catch (err) {
      console.error("[GAME] 플레이어 정보 수정 실패", err);
      alert("정보 수정에 실패했어요.");
    }
  };

  const handleAddPlayer = async (player: {
    name: string;
    gender: "MALE" | "FEMALE";
    level: string;
    ageGroup: string;
  }) => {
    try {
      await createGameBoardMember(gameBoardId, toGameBoardMemberPayload(player));
      refreshMembers();
      setIsAddPlayerOpen(false);
    } catch (err) {
      console.error("[GAME] 명단 추가 실패", err);
      alert("명단 추가에 실패했어요.");
    }
  };

  const handleToggleParticipation = async (id: number) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    const nextParticipating = member.tags.includes("미참");
    try {
      await updateGameBoardMemberParticipation(
        gameBoardId,
        id,
        nextParticipating,
      );
      setMembers(prev =>
        prev.map(m => {
          if (m.id !== id) return m;
          return nextParticipating
            ? {
                ...m,
                tags: m.tags.filter(t => t !== "미참"),
                selectable: true,
              }
            : { ...m, tags: ["미참"], selectable: false };
        }),
      );
      setSelectedIds(prev => prev.filter(v => v !== id));
    } catch (err) {
      console.error("[GAME] 참여 상태 변경 실패", err);
      alert("참여 상태 변경에 실패했어요.");
    }
  };

  const handleAddToWaitingQueue = async () => {
    if (selectedMembers.length === 0) return;
    try {
      const res = await gameWs.createGame({
        gameBoardId,
        gameBoardMemberIds: selectedMembers.map(m => m.id),
      });
      if (res.data?.board) applyBoard(res.data.board);
      refreshMembers();
      setSelectedIds([]);
    } catch (err) {
      console.error("[GAME] CREATE_GAME 실패", err);
      alert("대기열 추가에 실패했어요.");
    }
  };

  const handleChangeWaitingGroup = async (group: WaitingGroup) => {
    try {
      const res = await gameWs.deleteGame({
        gameBoardId,
        gameId: group.gameId,
        restore: true,
      });
      const restoredIds = res.data?.players.map(p => p.gameBoardMemberId);
      setSelectedIds(restoredIds?.length ? restoredIds : group.memberIds);
      if (res.data?.board) applyBoard(res.data.board);
      refreshMembers();
    } catch (err) {
      console.error("[GAME] DELETE_GAME(restore) 실패", err);
      alert("대기열 변경에 실패했어요.");
    }
  };

  const handleRemoveWaitingGroup = async (id: number) => {
    const group = waitingGroups.find(g => g.id === id);
    if (!group) return;
    try {
      const res = await gameWs.deleteGame({
        gameBoardId,
        gameId: group.gameId,
        restore: false,
      });
      if (res.data?.board) applyBoard(res.data.board);
      refreshMembers();
    } catch (err) {
      console.error("[GAME] DELETE_GAME 실패", err);
      alert("대기열 삭제에 실패했어요.");
    }
  };

  const handleMoveToCourt = async (waitingGroupId: number, courtId: number) => {
    const group = waitingGroups.find(g => g.id === waitingGroupId);
    if (!group) return;
    try {
      const res = await gameWs.startGame({
        gameBoardId,
        gameId: group.gameId,
        courtId,
      });
      if (res.data) applyBoard(res.data);
      refreshMembers();
    } catch (err) {
      console.error("[GAME] START_GAME 실패", err);
      alert("게임 시작에 실패했어요.");
    }
  };

  // 경기중인 코트에 대기열 매치를 드래그해 놓았을 때: 기존 매치를 대기로 보내고 그 자리를 새 매치가 차지한다.
  const handleSwapCourtMatch = async (
    waitingGroupId: number,
    courtId: number,
  ) => {
    const group = waitingGroups.find(g => g.id === waitingGroupId);
    const court = courts.find(c => c.id === courtId);
    if (!group || !court?.gameId) return;
    try {
      await gameWs.moveToWaiting({ gameBoardId, gameId: court.gameId });
      const res = await gameWs.startGame({
        gameBoardId,
        gameId: group.gameId,
        courtId,
      });
      if (res.data) applyBoard(res.data);
      refreshMembers();
    } catch (err) {
      console.error("[GAME] 코트 교체 실패", err);
      alert("코트 교체에 실패했어요.");
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const group = waitingGroups.find(
      g => waitingDraggableId(g.id) === event.active.id,
    );
    setActiveDragGroup(group ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragGroup(null);
    const { active, over } = event;
    if (!over) return;
    const group = waitingGroups.find(
      g => waitingDraggableId(g.id) === active.id,
    );
    const court = courts.find(c => courtDroppableId(c.id) === over.id);
    if (!group || !court) return;
    if (court.players) {
      handleSwapCourtMatch(group.id, court.id);
    } else {
      handleMoveToCourt(group.id, court.id);
    }
  };

  const handleCompleteCourt = async (courtId: number) => {
    const court = courts.find(c => c.id === courtId);
    if (!court?.gameId) return;
    try {
      const res = await gameWs.completeGame({
        gameBoardId,
        gameId: court.gameId,
      });
      if (res.data) applyBoard(res.data);
      refreshMembers();
    } catch (err) {
      console.error("[GAME] COMPLETE_GAME 실패", err);
      alert("게임 완료에 실패했어요.");
    } finally {
      setCompletingCourtId(null);
    }
  };

  const handleReturnToWaiting = async (courtId: number) => {
    const court = courts.find(c => c.id === courtId);
    if (!court?.gameId) return;
    try {
      const res = await gameWs.moveToWaiting({
        gameBoardId,
        gameId: court.gameId,
      });
      if (res.data) applyBoard(res.data);
      refreshMembers();
    } catch (err) {
      console.error("[GAME] MOVE_TO_WAITING 실패", err);
      alert("대기로 되돌리기에 실패했어요.");
    }
  };

  const handleCancelCourtGame = async (courtId: number) => {
    const court = courts.find(c => c.id === courtId);
    if (!court?.gameId) return;
    try {
      const res = await gameWs.deleteGame({
        gameBoardId,
        gameId: court.gameId,
        restore: true,
      });
      const restoredIds = res.data?.players.map(p => p.gameBoardMemberId);
      setSelectedIds(restoredIds?.length ? restoredIds : []);
      if (res.data?.board) applyBoard(res.data.board);
      refreshMembers();
    } catch (err) {
      console.error("[GAME] 경기 취소 실패", err);
      alert("경기 취소에 실패했어요.");
    }
  };

  const handleAutoMatch = async () => {
    try {
      const { gameBoardMemberIds } = await postRandomMatch(gameBoardId);
      setSelectedIds(gameBoardMemberIds);
    } catch (err) {
      console.error("[GAME] RANDOM_MATCH 실패", err);
      setIsRandomMatchFailOpen(true);
    }
  };

  const handleSaveCourts = async (items: CourtManageItem[]) => {
    try {
      const res = await updateCourts(gameBoardId, {
        courts: items.map(item => ({
          courtId: item.courtId,
          courtName: item.courtName,
        })),
      });
      setCourts(prev =>
        res.courts.map(updatedCourt => {
          const existing = prev.find(c => c.id === updatedCourt.courtId);
          return {
            id: updatedCourt.courtId,
            label: updatedCourt.courtName,
            gameId: existing?.gameId,
            startedAt: existing?.startedAt,
            timer: existing?.timer,
            players: existing?.players ?? null,
          };
        }),
      );
      setCourtManageVariant(null);
    } catch (err) {
      console.error("[GAME] 코트 저장 실패", err);
      alert("코트 저장에 실패했어요.");
    }
  };

  if (isLoading) {
    return <GameBoardTabSkeleton />;
  }

  return (
    <DndContext
      sensors={dndSensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex min-w-0 flex-col gap-8 pb-28">
        {/* 게임 코트 */}
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="header-h5 text-black">게임 코트</span>
            {isManager && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="웹으로 보기"
                  className="hidden items-center justify-center rounded-lg bg-gy-100 p-1.5 text-black md:flex"
                  onClick={() => setIsWebViewOpen(true)}
                >
                  <img src={Expand} alt="" className="size-5" />
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-gy-100 px-4 py-1.5 body-rg-500 text-black"
                  onClick={() => setCourtManageVariant("sheet")}
                >
                  코트 관리
                </button>
              </div>
            )}
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
                    onReturnToWaiting={() => handleReturnToWaiting(court.id)}
                    onCancelGame={() => handleCancelCourtGame(court.id)}
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
            {isManager && (
              <button
                type="button"
                className="flex size-6 items-center justify-center rounded-lg bg-gr-500"
                onClick={() => setIsAddPlayerOpen(true)}
              >
                <img src={AddWhite} alt="추가" className="size-4" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="body-rg-500 text-gy-700">
              전체 {members.length}
            </span>
            <FilterBtn
              forceStatus={isFilterActive ? "clicked" : "default"}
              onClick={() => setIsFilterOpen(true)}
            >
              필터
            </FilterBtn>
          </div>
          <div className="flex flex-wrap justify-between gap-y-4">
            {members.map(member => (
              <GameMemberCard
                key={member.id}
                member={isManager ? member : { ...member, selectable: false }}
                selected={selectedIds.includes(member.id)}
                onToggleSelect={() => toggleSelect(member.id)}
                onEditInfo={() => setEditingMemberId(member.id)}
                onToggleParticipation={() =>
                  handleToggleParticipation(member.id)
                }
              />
            ))}
          </div>
        </div>

        {/* 하단 선택 바 */}
        {isManager && (
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
                <span className="header-h2 text-black">
                  {selectedIds.length}
                </span>
                <span className="body-sm-500 text-gy-700">선택됨</span>
              </div>
              <button
                type="button"
                className="flex shrink-0 items-center rounded-2xl bg-gr-100 p-2.5 shadow-ds100"
                onClick={handleAutoMatch}
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
        )}

        {isWebViewOpen && (
          <GameBoardWebView
            courts={courts}
            onCompleteCourt={handleCompleteCourt}
            waitingGroups={waitingGroups}
            onRemoveWaitingGroup={handleRemoveWaitingGroup}
            onMoveToCourt={handleMoveToCourt}
            onChangeWaitingGroup={handleChangeWaitingGroup}
            onAddToWaitingQueue={() => setIsDuplicateCheckOpen(true)}
            onAutoMatch={handleAutoMatch}
            members={members}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            onToggleParticipation={handleToggleParticipation}
            onEditMember={setEditingMemberId}
            onAddPlayer={() => setIsAddPlayerOpen(true)}
            onManageCourts={() => setCourtManageVariant("overlay")}
            filters={filters}
            onChangeFilters={handleApplyFilters}
            onClose={() => setIsWebViewOpen(false)}
          />
        )}

        {isAddPlayerOpen && (
          <GameAddPlayerModal
            variant={isWebViewOpen ? "overlay" : "sheet"}
            onClose={() => setIsAddPlayerOpen(false)}
            onSubmit={handleAddPlayer}
          />
        )}

        {editingMember && (
          <GameEditPlayerModal
            variant={isWebViewOpen ? "overlay" : "sheet"}
            member={editingMember}
            onClose={() => setEditingMemberId(null)}
            onSubmit={handleSaveMemberEdit}
          />
        )}

        {courtManageVariant && (
          <CourtManageBottomSheet
            variant={courtManageVariant}
            courts={courts.map(c => ({ courtId: c.id, courtName: c.label }))}
            onClose={() => setCourtManageVariant(null)}
            onSave={handleSaveCourts}
          />
        )}

        {isFilterOpen && (
          <GameFilterPage
            variant={isWebViewOpen ? "overlay" : "sheet"}
            initialFilters={filters}
            onApply={handleApplyFilters}
            onClose={() => setIsFilterOpen(false)}
          />
        )}

        {completingCourtId !== null && (
          <GameEndModal
            onClose={() => setCompletingCourtId(null)}
            onConfirm={() => handleCompleteCourt(completingCourtId)}
          />
        )}

        {isRandomMatchFailOpen && (
          <GameRandomMatchFailModal
            onClose={() => setIsRandomMatchFailOpen(false)}
          />
        )}

        {isDuplicateCheckOpen && (
          <GameDuplicateCheckModal
            variant={isWebViewOpen ? "overlay" : "sheet"}
            gameBoardId={gameBoardId}
            members={selectedMembers}
            onClose={() => setIsDuplicateCheckOpen(false)}
            onConfirm={() => {
              handleAddToWaitingQueue();
              setIsDuplicateCheckOpen(false);
            }}
          />
        )}
      </div>
      <DragOverlay>
        {activeDragGroup ? (
          <div className="flex w-[12.5rem] flex-col gap-2 rounded-2xl bg-white p-2 shadow-ds300">
            <span className="body-sm-500 px-1 text-black">
              {activeDragGroup.label}
            </span>
            <div className="flex flex-wrap justify-between gap-y-2">
              {activeDragGroup.players.map(p => (
                <PlayerBadge key={p.id} {...p} />
              ))}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
