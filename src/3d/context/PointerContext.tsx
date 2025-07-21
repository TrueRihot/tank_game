import { createContext, useContext, useState, ReactNode } from "react";
import { Vector3 } from "three";
import { PointerContextType } from "../../../types/pointer";

const PointerContext = createContext<PointerContextType | null>(null);

export const usePointer = () => {
  const ctx = useContext(PointerContext);
  if (!ctx) throw new Error("usePointer must be used within a PointerProvider");
  return ctx;
};

export const PointerProvider = ({ children }: { children: ReactNode }) => {
  const [pointer, setPointer] = useState(new Vector3());

  return <PointerContext.Provider value={{ pointer, setPointer }}>{children}</PointerContext.Provider>;
};
