import { Vector3 } from "three";

export interface PointerContextType {
  pointer: Vector3;
  setPointer: (v: Vector3) => void;
}
