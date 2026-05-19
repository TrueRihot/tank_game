import { Box, RoundedBox, useKeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Group, Vector3 } from "three";
import { Duplet, useBox } from "@react-three/p2";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";
import { TankEntity } from "../../../types/tank";

const tankBaseScale: Vector3 = new Vector3(0.47, 0.22, 0.52);

export const Tank = ({
  position,
  color,
  isPlayer,
  pointerPosition,
  reloadCooldown = 1000, // Default reload cooldown
  id,
}: TankEntity) => {
  const { tankScaleX, tankScaleY, tankScaleZ } = useControls("tanks", {
    tankScaleX: tankBaseScale.x,
    tankScaleY: tankBaseScale.y,
    tankScaleZ: tankBaseScale.z,
  });

  const scaleX = tankScaleX ?? tankBaseScale.x;
  const scaleY = tankScaleY ?? tankBaseScale.y;
  const scaleZ = tankScaleZ ?? tankBaseScale.z;

  const [ref, api] = useBox(() => ({
    mass: 10,
    position: [position[0], position[1]],
    args: [tankBaseScale.x, tankBaseScale.z],
    angularDamping: 0.98,
    linearDamping: 0.98,
    name: id,
    material: {
      id: 5000,
    },
  }), null, []);

  const propellantPositions = {
    left: [0, -tankBaseScale.x] as Duplet,
    right: [0, tankBaseScale.x] as Duplet,
  };

  const { force, linearDamping, angularDamping, angularRatio } = useControls("tanks", {
    force: { value: 11, step: 1, min: 1, max: 100 },
    linearDamping: { value: 0.98, step: 0.01, min: 0.1, max: 1 },
    angularDamping: { value: 0.98, step: 0.01, min: 0.1, max: 1 },
    angularRatio: { value: 1, step: 1, min: 1, max: 5 },
  });

  const forceVal = force ?? 11;
  const linearDampingVal = linearDamping ?? 0.98;
  const angularDampingVal = angularDamping ?? 0.98;
  const angularRatioVal = angularRatio ?? 1;

  const turretRef = useRef<Group>(null);
  const barrelTipRef = useRef<Group>(null);
  const [, get] = useKeyboardControls();
  const [lastShotTime, setLastShotTime] = useState<number>(Date.now());

  const { paused, spawnShell } = useGame();

  useEffect(() => {
    if (linearDampingVal !== undefined) api.linearDamping.set(linearDampingVal);
    if (angularDampingVal !== undefined) api.angularDamping.set(angularDampingVal);
  }, [linearDampingVal, angularDampingVal, api]);

  useEffect(() => {
    const unsubscribePos = api.position.subscribe((p) => {
      console.log(`[Physics Position] ${id}:`, p);
    });
    const unsubscribeVel = api.velocity.subscribe((v) => {
      console.log(`[Physics Velocity] ${id}:`, v);
    });
    return () => {
      unsubscribePos();
      unsubscribeVel();
    };
  }, [api, id]);

  const updateViaPlayerControls = () => {
    const { forward, backward, left, right, shoot } = get();

    if (forward) {
      api.applyLocalForce([forceVal, 0], propellantPositions.left);
      api.applyLocalForce([forceVal, 0], propellantPositions.right);
    }
    if (backward) {
      api.applyLocalForce([-forceVal, 0], propellantPositions.left);
      api.applyLocalForce([-forceVal, 0], propellantPositions.right);
    }
    if (left) {
      api.applyLocalForce([-angularRatioVal / forceVal, 0], propellantPositions.left);
      api.applyLocalForce([angularRatioVal / forceVal, 0], propellantPositions.right);
    }
    if (right) {
      api.applyLocalForce([angularRatioVal / forceVal, 0], propellantPositions.left);
      api.applyLocalForce([-angularRatioVal / forceVal, 0], propellantPositions.right);
    }

    if (turretRef.current && pointerPosition) {
      const target = new Vector3(pointerPosition.x, turretRef.current.position.y, pointerPosition.z);
      turretRef.current.lookAt(target);
    }
    if (shoot && lastShotTime + reloadCooldown! < Date.now()) {
      const spawnPos = barrelTipRef.current
        ? barrelTipRef.current.getWorldPosition(new Vector3())
        : (ref.current?.getWorldPosition(new Vector3()) ?? new Vector3());

      const direction = new Vector3(pointerPosition!.x - spawnPos.x, 0, pointerPosition!.z - spawnPos.z).normalize();
      spawnShell([spawnPos.x, spawnPos.z], [direction.x, direction.z]);
      setLastShotTime(Date.now());
    }
  };

  console.log("Tank component mounted/rendered:", id, "prop position:", position);

  useFrame(() => {
    if (paused) return;
    if (isPlayer) updateViaPlayerControls();
    if (ref.current) {
      console.log("Tank position in frame:", id, [ref.current.position.x, ref.current.position.y, ref.current.position.z]);
    }
  });

  return (
    <group position={[position[0], 0, position[1]]} ref={ref} userData={{ id, isPlayer }}>
      <group rotation-y={Math.PI / 2}>
        <RoundedBox castShadow position={[0, scaleY / 2, 0]} scale={[scaleX, scaleY, scaleZ]} bevelSegments={4}>
          <meshStandardMaterial color={color} />
        </RoundedBox>

        <group ref={turretRef}>
          <RoundedBox
            scale={[scaleX / 1.9, scaleY / 1.5, scaleX / 1.9]}
            bevelSegments={4}
            position={[0, scaleY + scaleY / 1.5 / 2, 0]}
          >
            <meshStandardMaterial color='blue' />
          </RoundedBox>
          <Box scale={[scaleX / 7, scaleY / 3.6, scaleZ / 1.5]} position={[0, scaleY + scaleY / 3.5, scaleZ / 2]}>
            <meshStandardMaterial color='red' />
          </Box>
          <group ref={barrelTipRef} position={[0, scaleY + scaleY / 3.5, scaleZ * 0.85]} />
        </group>
      </group>
    </group>
  );
};
