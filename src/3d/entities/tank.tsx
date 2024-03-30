import { Box, RoundedBox, useKeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Vector3 } from "three";
import { useBox } from "@react-three/p2";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";

interface TankProps {
  position: [number, number, number];
  color: string;
}

const tankBaseScale: Vector3 = new Vector3(0.47, 0.22, 0.52);

export const Tank = () => {
  const { tankScaleX, tankScaleY, tankScaleZ } = useControls("tanks", {
    tankScaleX: tankBaseScale.x,
    tankScaleY: tankBaseScale.y,
    tankScaleZ: tankBaseScale.z,
  });

  let angle = 0;

  const [, get] = useKeyboardControls();
  useEffect(() => {
    api.angle.subscribe((res) => {
      angle = res;
    });
  }, []);

  useFrame(() => {
    const { forward, backward, left, right } = get();
    if (forward) {
      //move forward in the direction of the angle
      api.applyImpulse([-(Math.sin(angle)) * 0.1, (Math.cos(angle)) * 0.1], [0, 0]);
      console.log(angle);
    }
    if (backward) {
      //move backward in the opposite direction of the angle
      api.applyImpulse([(Math.sin(angle)) * 0.1, -(Math.cos(angle)) * 0.1], [0, 0]);
    }
    if (left) {
      //rotate left
      api.angle.set(angle - 0.1);
    }
    if (right) {
      //rotate right
      api.angle.set(angle + 0.1);
    }
  });

  const [ref, api] = useBox(() => (
    {
      mass: 10,
      position: [0, 0],
      args: [tankScaleX, tankScaleZ],
      angularDamping: 1,
      linearDamping: 10000,
      onCollide: (e) => {
        console.log("collide", e);
      },
      material: {
        id: 1,
      },
    }
  ));


  return (
    <>
      <group position={[0, 0, 0]} ref={ref}>
        <RoundedBox castShadow position={[0, tankScaleY / 2, 0]}
                    scale={[tankScaleX, tankScaleY, tankScaleZ]}
                    bevelSegments={4}>
          <meshStandardMaterial color="orange" />
        </RoundedBox>
        <RoundedBox
          scale={[tankScaleX / 1.9, tankScaleY / 1.5, tankScaleX / 1.9]}
          bevelSegments={4}
          position={[0, tankScaleY + tankScaleY / 1.5 / 2, 0]}>
          <meshStandardMaterial color="blue" />
        </RoundedBox>
        <Box scale={[tankScaleX / 7, tankScaleY / 3.6, tankScaleZ / 1.5]}
             position={[0, tankScaleY + tankScaleY / 3.5, tankScaleZ / 2]}>
          <meshStandardMaterial color="red" />
        </Box>
      </group>
    </>
  );
};
