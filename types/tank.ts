import { Duplet } from "@react-three/p2";
import { Vector3 } from "three";

export interface TankEntity {
  id: string;
  position: Duplet;
  color: string;
  isPlayer: boolean;
  pointerPosition?: Vector3;
  reloadCooldown?: number;
}
