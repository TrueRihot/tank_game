import React from "react";
import { Grid, KeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Debug, Physics } from "@react-three/p2";
import { Vector3 } from "three";
import { GameProvider } from "./context/GameContext";
import { PointerProvider } from "./context/PointerContext";
import { Game } from "./Game";

export const Scene = () => {
  const { pointx, pointy, pointz } = useControls({
    pointx: 1,
    pointy: 3,
    pointz: 1,
  });

  const pointerPosition: Vector3 = new Vector3(0, 0, 0);

  return (
    <>
      <PointerProvider>
        <GameProvider>
          <Grid cellSize={1} cellThickness={1} infiniteGrid={true} sectionColor={"grey"} />
          <directionalLight castShadow position={[pointx, pointy, pointz]}></directionalLight>
          <ambientLight />

          <Physics normalIndex={1} gravity={[0, 0]}>
            <KeyboardControls
              map={[
                { name: "forward", keys: ["ArrowUp", "w", "W"] },
                { name: "backward", keys: ["ArrowDown", "s", "S"] },
                { name: "left", keys: ["ArrowLeft", "a", "A"] },
                { name: "right", keys: ["ArrowRight", "d", "D"] },
                { name: "shoot", keys: ["Space"], up: true },
              ]}
            >
              <Debug color='red' scale={1.1} linewidth={1} normalIndex={1} />
              <Game />
            </KeyboardControls>
          </Physics>
        </GameProvider>
      </PointerProvider>
    </>
  );
};
