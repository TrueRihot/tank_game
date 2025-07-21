import { Duplet } from "@react-three/p2";
import { ShellEntity } from "./shell";
import { TankEntity } from "./tank";

export type Levels = "Default";

export interface GameContextType {
  tanks: TankEntity[];
  shells: ShellEntity[];
  spawnShell: (origin: Duplet, direction: Duplet) => void;
  removeShell: (id: string) => void;
  addTank: (tank: TankEntity) => void;
  removeTank: (id: string) => void;
  paused?: boolean;
  level: Levels;
}
