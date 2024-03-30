import React from "react";
import { Grid, KeyboardControls } from "@react-three/drei";
import { Tank } from "./entities/tank";
import { DefaultLevel } from "./level/DefaultLevel";
import { useControls } from "leva";
import { Debug, Physics } from "@react-three/p2";

export const Scene = () => {
  const { pointx, pointy, pointz } = useControls({
    pointx: 1,
    pointy: 3,
    pointz: 1,
  });

  return (
    <>
      <Grid cellSize={1} cellThickness={1} infiniteGrid={true} sectionColor={"grey"} />
      <directionalLight castShadow position={[pointx, pointy, pointz]}></directionalLight>
      <ambientLight />

      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}>
        <Physics normalIndex={1} gravity={[0, 0]}>
          <Debug color="grey" scale={1.1} linewidth={0.0025} normalIndex={1}>
            <DefaultLevel></DefaultLevel>
            <Tank />
          </Debug>
        </Physics>
      </KeyboardControls>
    </>
  );
};
