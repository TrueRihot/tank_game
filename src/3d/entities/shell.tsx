import { RoundedBox } from "@react-three/drei";
import { ShellEntity } from "../../../types/shell";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group } from "three";
import { CollideEvent, useBox } from "@react-three/p2";

export const Shell = ({ position, direction, id, baseSpeed = 1 }: ShellEntity) => {
  const ref = useRef<Group>(null);

  const [phsyicsRef, api] = useBox(() => ({
    type: "Kinematic",
    position: [position[0], position[1]],
    args: [0.1, 0.1],
    allowSleep: false,
    isTrigger: true,
    material: {
      id: 4000,
      friction: 0,
      restitution: 0,
      collisionGroup: 1,
      collisionMask: 1,
      name: "shell",
    },
  }), null, []);

  useEffect(() => {
    const speed = baseSpeed * 15;
    api.velocity.set(direction[0] * speed, direction[1] * speed);
  }, [api, direction, baseSpeed]);

  const angle = Math.atan2(direction[0], direction[1]);

  return (
    <group ref={phsyicsRef} position={[position[0], 0.1, position[1]]} rotation={[0, angle, 0]}>
      <group ref={ref}>
        <RoundedBox args={[0.1, 0.1, 0.2]} castShadow>
          <meshStandardMaterial color='red' />
        </RoundedBox>
      </group>
    </group>
  );
};
