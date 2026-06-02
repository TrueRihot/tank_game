import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

const LOCAL_STORAGE_KEY = "tank_game_controls";

const DEFAULT_CONTROLS = {
  forward: "w",
  backward: "s",
  left: "a",
  right: "d",
  shoot: "Space",
};

const getStoredControls = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_CONTROLS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Error reading stored controls", e);
  }
  return { ...DEFAULT_CONTROLS };
};

interface ControlBindings {
  forward: string;
  backward: string;
  left: string;
  right: string;
  shoot: string;
}

interface ControlsContextType {
  bindings: ControlBindings;
  setBinding: (action: keyof ControlBindings, key: string) => void;
  resetDefaults: () => void;
}

const ControlsContext = createContext<ControlsContextType | undefined>(undefined);

export const ControlsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bindings, setBindings] = useState<ControlBindings>(getStoredControls);

  // Persist to localStorage whenever bindings change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bindings));
  }, [bindings]);

  const setBinding = useCallback((action: keyof ControlBindings, key: string) => {
    setBindings(prev => ({ ...prev, [action]: key }));
  }, []);

  const resetDefaults = useCallback(() => {
    setBindings({ ...DEFAULT_CONTROLS });
  }, []);

  const value = useMemo(
    () => ({ bindings, setBinding, resetDefaults }),
    [bindings, setBinding, resetDefaults]
  );

  return <ControlsContext.Provider value={value}>{children}</ControlsContext.Provider>;
};

export const useControls_ = () => {
  const context = useContext(ControlsContext);
  if (!context) throw new Error("useControls_ must be used within a ControlsProvider");
  return context;
};
