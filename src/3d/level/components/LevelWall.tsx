import { Box } from "@react-three/drei";
import React from "react";
import { Vector3 } from "three";
import { useBox } from "@react-three/p2";

interface LevelWallProps {
  scale: Vector3;
  position: Vector3;
  children?: React.ReactNode;
}

export const LevelWall = ({ scale, position }: LevelWallProps) => {
  const [wallRef, api] = useBox(() => (
    { mass: 100, type: "Static", position: [position.x, position.z], args: [scale.x, scale.z] }
  ));
  return (
    <Box scale={scale}
         position={position}>
      <meshStandardMaterial color="grey" />
    </Box>
  );
};
