import { Box, RoundedBox, useKeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Vector3 } from "three";
import { Duplet, useBox } from "@react-three/p2";
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

  const propellantPositionLeft: Duplet = [0, -tankScaleX];
  const propellantPositionRight: Duplet = [0, tankScaleX];

  let angle = 0;

  const [, get] = useKeyboardControls();
  const { force, linearDamping, angularDamping, angularRatio } = useControls("tanks", {
    force: {
      value: 5,
      step: 1,
      min: 1,
      max: 100,
    },
    linearDamping: {
      value: 0.9,
      step: 0.01,
      min: 0.1,
      max: 1,
    },
    angularDamping: {
      value: 0.9,
      step: 0.01,
      min: 0.1,
      max: 1,
    },
    angularRatio: {
      value: 1,
      step: 1,
      min: 1,
      max: 5,
    },
  });

  useEffect(() => {
    api.angle.subscribe((res) => {
      angle = res;
    });
  }, []);

  useEffect(() => {
    api.linearDamping.set(linearDamping);
    api.angularDamping.set(angularDamping);
  }, [linearDamping, angularDamping]);

  const [ref, api] = useBox(() => (
    {
      mass: 10,
      position: [0, 0],
      args: [tankScaleX, tankScaleZ],
      angularDamping: 11,
      linearDamping: 11,
      onCollide: (e) => {
        console.log("collide", e);
      },
      material: {
        id: 1,
      },
    }
  ));

  useFrame(() => {
    const { forward, backward, left, right } = get();
    if (forward) {
      //move forward in the direction of the angle
      api.applyLocalForce([force, 0], propellantPositionLeft);
      api.applyLocalForce([force, 0], propellantPositionRight);
    }
    if (backward) {
      //move backward in the opposite direction of the angle
      api.applyLocalForce([-force, 0], propellantPositionLeft);
      api.applyLocalForce([-force, 0], propellantPositionRight);
    }
    if (left) {
      //rotate left
      api.applyLocalForce([-angularRatio / force, 0], propellantPositionLeft);
      api.applyLocalForce([angularRatio / force, 0], propellantPositionRight);
    }
    if (right) {
      //rotate right
      api.applyLocalForce([angularRatio / force, 0], propellantPositionLeft);
      api.applyLocalForce([-angularRatio / force, 0], propellantPositionRight);
    }
  });


  return (
    <>
      <group position={[0, 0, 0]} ref={ref}>
        <group rotation-y={Math.PI / 2}>
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
      </group>
    </>
  );
};
