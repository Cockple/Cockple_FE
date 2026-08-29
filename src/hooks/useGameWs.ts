import { useEffect, useRef, useState } from "react";
import {
  connectGameWs,
  disconnectGameWs,
  subscribeGameBoard,
  unsubscribeGameBoard,
  createGameWS,
  startGameWS,
  completeGameWS,
  deleteGameWS,
  moveCourtWS,
  moveToWaitingWS,
  addGameWsListener,
  addGameWsOpenListener,
  addGameWsCloseListener,
  isGameWsOpen,
  type GameResponseEnvelope,
} from "../api/game/rawWs";
import useUserStore from "../store/useUserStore";

// 게임판 화면 진입 시 연결하고, 이탈 시 해당 보드를 구독 해제한다.
// (소켓 연결 자체는 다른 게임판 화면과 공유될 수 있어 연결 종료는 하지 않음)
export const useGameWs = (opts: { gameBoardId?: number; origin?: string } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState<GameResponseEnvelope | null>(
    null,
  );
  const mounted = useRef(false);

  const token =
    useUserStore(s => s.user?.accessToken) ??
    localStorage.getItem("accessToken") ??
    "";

  useEffect(() => {
    mounted.current = true;

    if (!token) {
      setIsOpen(false);
      disconnectGameWs();
      return () => {
        mounted.current = false;
      };
    }

    connectGameWs({ origin: opts.origin });

    if (isGameWsOpen()) setIsOpen(true);
    const offOpen = addGameWsOpenListener(() => mounted.current && setIsOpen(true));
    const offClose = addGameWsCloseListener(
      () => mounted.current && setIsOpen(false),
    );
    const offMsg = addGameWsListener(msg => {
      if (!mounted.current) return;
      setLastMessage(msg);
    });

    return () => {
      mounted.current = false;
      offOpen();
      offClose();
      offMsg();
    };
  }, [token, opts.origin]);

  // 보드 구독/해제: 소켓 open 이후에 시도, 언마운트 시 자동 해제
  useEffect(() => {
    if (!isOpen || !opts.gameBoardId) return;

    subscribeGameBoard(opts.gameBoardId).catch(() => {});

    return () => {
      unsubscribeGameBoard(opts.gameBoardId!).catch(() => {});
    };
  }, [isOpen, opts.gameBoardId]);

  return {
    isOpen,
    lastMessage,
    createGame: createGameWS,
    startGame: startGameWS,
    completeGame: completeGameWS,
    deleteGame: deleteGameWS,
    moveCourt: moveCourtWS,
    moveToWaiting: moveToWaitingWS,
  };
};
