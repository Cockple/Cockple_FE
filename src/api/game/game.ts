import api from "../api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export interface CompletedGamePlayer {
  name: string;
  tag: string;
  team?: "A" | "B";
}

export interface CompletedGame {
  gameId: number;
  courtNo: number;
  durationMin: number;
  players: CompletedGamePlayer[];
}

export interface CompletedGamesResponse {
  games: CompletedGame[];
  nextCursor: string | null;
  hasNext: boolean;
}

export const getCompletedGames = async (
  gameBoardId: number,
  params?: {
    courtNo?: number;
    cursor?: string;
    size?: number;
  }
): Promise<CompletedGamesResponse> => {
  const { data } = await api.get(`/api/game-boards/${gameBoardId}/games/completed`, {
    params,
  });
  return data.data;
};

// 게임 진행자 수정
export const changeGameHost = async (
  exerciseId: number,
  participantId: number
) => {
  const { data } = await api.patch(`/api/exercises/${exerciseId}/game-host`, {
    participantId,
  });
  return data;
};

export interface GameHostParticipant {
  participantId: number;
  profileImageUrl: string | null;
  partyPosition: string;
  isGameHost: boolean;
  name: string;
  gender: string;
  level: string;
  lastExerciseDate: string;
}

export interface GameHostCandidatesResponse {
  totalCount: number;
  participants: GameHostParticipant[];
}

export const getGameHostCandidates = async (
  exerciseId: number
): Promise<GameHostCandidatesResponse> => {
  const { data } = await api.get(`/api/exercises/${exerciseId}/game-host`);
  return data.data;
};

export const useGetGameHostCandidates = (exerciseId: number) => {
  return useQuery({
    queryKey: ["gameHostCandidates", exerciseId],
    queryFn: () => getGameHostCandidates(exerciseId),
    enabled: !!exerciseId,
  });
};

export const useGetCompletedGames = (
  gameBoardId: number,
  courtNo?: number,
  size: number = 20
) => {
  return useInfiniteQuery({
    queryKey: ["completedGames", gameBoardId, courtNo],
    queryFn: ({ pageParam }) =>
      getCompletedGames(gameBoardId, {
        courtNo,
        cursor: pageParam,
        size,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
  });
};

