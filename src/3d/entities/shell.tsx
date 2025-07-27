import { RoundedBox } from "@react-three/drei";
import { ShellEntity } from "../../../types/shell";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { CollideEvent, useBox } from "@react-three/p2";

export const Shell = ({ position, direction, id, baseSpeed = 1 }: ShellEntity) => {
  const ref = useRef<Group>(null);

  const [phsyicsRef, api] = useBox(() => ({
    mass: 0,
    position: [position[0], position[1]],
    args: [0.1, 0.1],
    allowSleep: false,
    onCollide(e) {
      console.log("Shell collided with:", e);
    },

    material: {
      id: 4000,
      friction: 0,
      restitution: 0,
      collisionGroup: 1,
      collisionMask: 1,
      name: "shell",
    },
  }));

  useFrame((_, delta) => {
    if (phsyicsRef.current) {
      const pos = phsyicsRef.current.position;
      pos.x += direction[0] * delta;
      pos.z += direction[1] * delta;
      api.position.set(pos.x, pos.y);
    }
  });

  return (
    <group ref={phsyicsRef} position={[position[0], 0.1, position[1]]} rotation={[0, Math.PI, 0]}>
      <group ref={ref}>
        <RoundedBox args={[0.1, 0.1, 0.2]} castShadow>
          <meshStandardMaterial color='red' />
        </RoundedBox>
      </group>
    </group>
  );
};
