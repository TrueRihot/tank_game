import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { ClampedClock } from "./ClampedClock";
import { Leva } from "leva";

export const Environment = () => {
  return (
    <>
      <Leva hidden={false}></Leva>
      <Stats />
      <Canvas shadows camera={{ fov: 70, position: [0, 9, 5] }}>
        <ClampedClock />
        <OrbitControls makeDefault />
        <Scene />
      </Canvas>
    </>
  );
};
