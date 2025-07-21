import { ThreeEvent } from "@react-three/fiber";
import { useGame } from "./context/GameContext";
import { usePointer } from "./context/PointerContext";
import { Tank } from "./entities/tank";
import { DefaultLevel } from "./level/DefaultLevel";
import { Shell } from "./entities/shell";

export const Game = () => {
  const { tanks, addTank, removeTank, shells } = useGame();
  const { pointer, setPointer } = usePointer();

  function updatePointerPos(e: ThreeEvent<PointerEvent>): void {
    setPointer(e.point);
  }

  return (
    <>
      <group onPointerMove={e => updatePointerPos(e)}>
        <DefaultLevel></DefaultLevel>
      </group>
      {tanks.map(tank => (
        <Tank key={tank.id} color={tank.color} id={tank.id} position={tank.position} isPlayer={tank.isPlayer} pointerPosition={pointer} />
      ))}
      {shells.map(shell => (
        <Shell key={shell.id} direction={shell.direction} id={shell.id} position={shell.position} />
      ))}
    </>
  );
};
