import { Box } from "@react-three/drei";
import React from "react";
import { Vector3 } from "three";
import { usePlane } from "@react-three/p2";
import { LevelWall } from "./components/LevelWall";

export const DefaultLevel = () => {

  const scale: Vector3 = new Vector3(20, 0.25, 10);
  const [floorRef] = usePlane(() => (
    {
      mass: 10000,
      type: "Static",
      position: [0, 0],
      fixedRotation: true,
      material: {
        id: 2,
      },
    }
  ));

  return (
    <group position={[0, -scale.y / 2 - 0.01, 0]}>
      <Box ref={floorRef} scale={scale} receiveShadow>
        <meshStandardMaterial color="grey" />
      </Box>
      <LevelWall scale={new Vector3(scale.x, .5, scale.y)}
                 position={new Vector3(0, scale.y + .1, scale.z / 2)}>
      </LevelWall>
      <LevelWall scale={new Vector3(scale.x, .5, scale.y)}
                 position={new Vector3(0, scale.y + .1, scale.z / -2)}>
      </LevelWall>
      <LevelWall scale={new Vector3(scale.y / 2, .5, scale.z)}
                 position={new Vector3(scale.x / 2, scale.y + .1, 0)}>
      </LevelWall>
      <LevelWall scale={new Vector3(scale.y / 2, .5, scale.z)}
                 position={new Vector3(scale.x / -2, scale.y + .1, 0)}>
      </LevelWall>
    </group>
  );
};
