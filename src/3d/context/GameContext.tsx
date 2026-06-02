import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import type { Duplet } from "@react-three/p2";
import { GameContextType, Levels } from "../../../types/game";
import { ShellEntity } from "../../../types/shell";
import { TankEntity } from "../../../types/tank";

export type Screen = "menu" | "game" | "controls" | "settings";

export interface ExtendedGameContextType extends GameContextType {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  returnToMenu: () => void;
}

const GameContext = createContext<ExtendedGameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tanks, setTanks] = useState<TankEntity[]>([
    {
      id: "player-1",
      position: [0, 0],
      color: "#00f7ff",
      isPlayer: true,
    },
    {
      id: "ai-1",
      position: [5, 3],
      color: "#d05bff",
      isPlayer: false,
    },
  ]);

  const [shells, setShells] = useState<ShellEntity[]>([]);
  const level: Levels = "Default";
  const [paused, setPaused] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>("menu");

  const spawnShell = useCallback((origin: Duplet, direction: Duplet) => {
    setShells(prev => [
      ...prev,
      {
        id: nanoid(),
        position: origin,
        direction,
      },
    ]);
  }, []);

  const removeShell = useCallback((id: string) => {
    setShells(prev => prev.filter(shell => shell.id !== id));
  }, []);

  const addTank = useCallback((tank: TankEntity) => {
    setTanks(prev => [...prev, tank]);
  }, []);

  const removeTank = useCallback((id: string) => {
    setTanks(prev => prev.filter(tank => tank.id !== id));
  }, []);

  const startGame = useCallback(() => {
    setPaused(false);
    setActiveScreen("game");
  }, []);

  const pauseGame = useCallback(() => {
    setPaused(true);
  }, []);

  const resumeGame = useCallback(() => {
    setPaused(false);
    setActiveScreen("game");
  }, []);

  const returnToMenu = useCallback(() => {
    setPaused(true);
    setActiveScreen("menu");
  }, []);

  const value = useMemo(
    () => ({
      tanks,
      shells,
      spawnShell,
      removeShell,
      addTank,
      removeTank,
      paused,
      level,
      activeScreen,
      setActiveScreen,
      startGame,
      pauseGame,
      resumeGame,
      returnToMenu,
    }),
    [tanks, shells, spawnShell, removeShell, addTank, removeTank, paused, level, activeScreen, setActiveScreen, startGame, pauseGame, resumeGame, returnToMenu]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
