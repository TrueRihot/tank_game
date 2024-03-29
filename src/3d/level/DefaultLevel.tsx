import { Box } from "@react-three/drei";
import React from "react";

export const DefaultLevel = () => {
  return (
    <group position={[0, -0.25 / 2 - 0.01, 0]}>
      <Box scale={[20, 0.25, 10]}>
        <meshStandardMaterial color='grey' />
      </Box>
    </group>
  );
};
