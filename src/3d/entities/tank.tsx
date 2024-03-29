import { Box } from "@react-three/drei";
import { useControls } from "leva";
import React from "react";
import { Vector3 } from "three";

interface TankProps {
  position: [number, number, number];
  color: string;
}

const tankBaseScale: Vector3 = new Vector3(0.47, 0.22, 0.7);

export const Tank = () => {
  const { tankScaleX, tankScaleY, tankScaleZ } = useControls("tanks", {
    tankScaleX: tankBaseScale.x,
    tankScaleY: tankBaseScale.y,
    tankScaleZ: tankBaseScale.z,
  });

  return (
    <group position={[0, tankScaleY / 2, 0]}>
      <Box scale={[tankScaleX, tankScaleY, tankScaleZ]}>
        <meshStandardMaterial color='orange' />
      </Box>
      <Box scale={[tankScaleX / 2, tankScaleY / 1.5, tankScaleZ / 3]} position={[0, tankScaleY - tankScaleY / 3, 0]}>
        <meshStandardMaterial color='blue' />
      </Box>
      <Box scale={[tankScaleX / 7, tankScaleY / 3.6, tankScaleZ / 1.5]} position={[0, tankScaleY - tankScaleY / 4, tankScaleZ / 2]}>
        <meshStandardMaterial color='red' />
      </Box>
    </group>
  );
};
