import React from "react";
import { useFrame } from "@react-three/fiber";
import { Box, GizmoHelper, Grid, PivotControls } from "@react-three/drei";
import * as THREE from "three";
import { Tank } from "./entities/tank";
import { DefaultLevel } from "./level/DefaultLevel";
import { useControls } from "leva";

export const Scene = () => {
  const { pointx, pointy, pointz } = useControls({
    pointx: 1,
    pointy: 3,
    pointz: 1,
  });

  return (
    <>
      <Tank />
      <Grid cellSize={1} cellThickness={1} infiniteGrid={true} sectionColor={"grey"} />

      <pointLight position={[pointx, pointy, pointz]}></pointLight>

      <DefaultLevel></DefaultLevel>
      <ambientLight />
    </>
  );
};
