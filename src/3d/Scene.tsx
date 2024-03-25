import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import * as THREE from "three";

export const Scene = () => {
  const boxRef = useRef<THREE.Mesh | null>(null);
  useFrame((state, delta) => {
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.02;
    }
  });

  return (
    <>
      <Box ref={boxRef} args={[1, 1, 1]} rotation={[0.5, 0, 0]}>
        <meshNormalMaterial />
      </Box>
      <ambientLight />
    </>
  );
};
