import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Leva, useControls } from "leva";

export const Environment = () => {
  return (
    <>
      <Leva hidden={false}></Leva>
      <Canvas shadows camera={{ fov: 70, position: [0, 0, 3] }}>
        <OrbitControls makeDefault />
        <Scene />
      </Canvas>
    </>
  );
};
