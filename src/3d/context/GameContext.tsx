import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import type { Duplet } from "@react-three/p2";
import { GameContextType, Levels } from "../../../types/game";
import { ShellEntity } from "../../../types/shell";
import { TankEntity } from "../../../types/tank";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tanks, setTanks] = useState<TankEntity[]>([
    {
      id: "player-1",
      position: [0, 0],
      color: "red",
      isPlayer: true,
    },
    {
      id: "ai-1",
      position: [5, 5],
      color: "green",
      isPlayer: false,
    },
  ]);

  const [shells, setShells] = useState<ShellEntity[]>([]);
  const level: Levels = "Default"; // Hardcoded for now, can be extended later
  const [paused, setPaused] = useState(false);

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
    }),
    [tanks, shells, spawnShell, removeShell, addTank, removeTank, paused, level]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
