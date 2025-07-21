import { Vector3 } from "three";
import { LevelWall } from "./components/LevelWall";
import { Box } from "@react-three/drei";

export const DefaultLevel = () => {
  const scale: Vector3 = new Vector3(20, 0.25, 10);

  return (
    <group position={[0, -scale.y / 2 - 0.01, 0]}>
      <Box scale={scale} receiveShadow>
        <meshStandardMaterial color='grey' />
      </Box>
      <LevelWall scale={new Vector3(scale.x, 0.5, scale.y)} position={new Vector3(0, scale.y + 0.1, scale.z / 2)}></LevelWall>
      <LevelWall scale={new Vector3(scale.x, 0.5, scale.y)} position={new Vector3(0, scale.y + 0.1, scale.z / -2)}></LevelWall>
      <LevelWall scale={new Vector3(scale.y / 2, 0.5, scale.z)} position={new Vector3(scale.x / 2, scale.y + 0.1, 0)}></LevelWall>
      <LevelWall scale={new Vector3(scale.y / 2, 0.5, scale.z)} position={new Vector3(scale.x / -2, scale.y + 0.1, 0)}></LevelWall>
    </group>
  );
};
