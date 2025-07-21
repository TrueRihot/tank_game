import { Box, RoundedBox, useKeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Group, Vector3 } from "three";
import { Duplet, useBox } from "@react-three/p2";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";
import { TankEntity } from "../../../types/tank";

const tankBaseScale: Vector3 = new Vector3(0.47, 0.22, 0.52);

export const Tank = (props: TankEntity) => {
  const { tankScaleX, tankScaleY, tankScaleZ } = useControls("tanks", {
    tankScaleX: tankBaseScale.x,
    tankScaleY: tankBaseScale.y,
    tankScaleZ: tankBaseScale.z,
  });

  const [ref, api] = useBox(() => ({
    mass: 10,
    position: [0, 0],
    args: [tankScaleX, tankScaleZ],
    angularDamping: 11,
    linearDamping: 11,
    material: {
      id: 1,
    },
  }));

  const propellantPositions = {
    left: [0, -tankScaleX] as Duplet,
    right: [0, tankScaleX] as Duplet,
  };

  const { force, linearDamping, angularDamping, angularRatio } = useControls("tanks", {
    force: { value: 11, step: 1, min: 1, max: 100 },
    linearDamping: { value: 0.98, step: 0.01, min: 0.1, max: 1 },
    angularDamping: { value: 0.98, step: 0.01, min: 0.1, max: 1 },
    angularRatio: { value: 1, step: 1, min: 1, max: 5 },
  });

  const turretRef = useRef<Group>(null);
  const [, get] = useKeyboardControls();

  const { paused } = useGame();

  useEffect(() => {
    api.linearDamping.set(linearDamping);
    api.angularDamping.set(angularDamping);
  }, [linearDamping, angularDamping, api]);

  const updateViaPlayerControls = () => {
    const { forward, backward, left, right } = get();

    if (forward) {
      api.applyLocalForce([force, 0], propellantPositions.left);
      api.applyLocalForce([force, 0], propellantPositions.right);
    }
    if (backward) {
      api.applyLocalForce([-force, 0], propellantPositions.left);
      api.applyLocalForce([-force, 0], propellantPositions.right);
    }
    if (left) {
      api.applyLocalForce([-angularRatio / force, 0], propellantPositions.left);
      api.applyLocalForce([angularRatio / force, 0], propellantPositions.right);
    }
    if (right) {
      api.applyLocalForce([angularRatio / force, 0], propellantPositions.left);
      api.applyLocalForce([-angularRatio / force, 0], propellantPositions.right);
    }

    if (turretRef.current && props.pointerPosition) {
      const target = new Vector3(props.pointerPosition.x, turretRef.current.position.y, props.pointerPosition.z);
      turretRef.current.lookAt(target);
    }
  };

  useFrame(() => {
    if (paused) return;
    if (props.isPlayer) updateViaPlayerControls();
  });

  return (
    <group position={[props.position[0], 0, props.position[1]]} ref={ref}>
      <group rotation-y={Math.PI / 2}>
        <RoundedBox castShadow position={[0, tankScaleY / 2, 0]} scale={[tankScaleX, tankScaleY, tankScaleZ]} bevelSegments={4}>
          <meshStandardMaterial color={props.color} />
        </RoundedBox>

        <group ref={turretRef}>
          <RoundedBox
            scale={[tankScaleX / 1.9, tankScaleY / 1.5, tankScaleX / 1.9]}
            bevelSegments={4}
            position={[0, tankScaleY + tankScaleY / 1.5 / 2, 0]}
          >
            <meshStandardMaterial color='blue' />
          </RoundedBox>
          <Box scale={[tankScaleX / 7, tankScaleY / 3.6, tankScaleZ / 1.5]} position={[0, tankScaleY + tankScaleY / 3.5, tankScaleZ / 2]}>
            <meshStandardMaterial color='red' />
          </Box>
        </group>
      </group>
    </group>
  );
};
