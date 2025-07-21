import { Box, RoundedBox, useKeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Group, Mesh, Vector3 } from "three";
import { Duplet, useBox } from "@react-three/p2";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";

interface TankProps {
  position: [number, number, number];
  color: string;
  pointerPosition: Vector3;
}

const tankBaseScale: Vector3 = new Vector3(0.47, 0.22, 0.52);

export const Tank = (props: TankProps) => {
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
    onCollide: e => {
      console.log("collide", e);
    },
    material: {
      id: 1,
    },
  }));

  const propellantPositions = useMemo(() => {
    return {
      left: [0, -tankScaleX] as Duplet,
      right: [0, tankScaleX] as Duplet,
    };
  }, [tankScaleX]);

  const { force, linearDamping, angularDamping, angularRatio } = useControls("tanks", {
    force: { value: 11, step: 1, min: 1, max: 100 },
    linearDamping: { value: 0.98, step: 0.01, min: 0.1, max: 1 },
    angularDamping: { value: 0.98, step: 0.01, min: 0.1, max: 1 },
    angularRatio: { value: 1, step: 1, min: 1, max: 5 },
  });

  const [, get] = useKeyboardControls();
  const turretRef = useRef<Group>(null);
  const lookTarget = useRef(new Vector3());

  const baseRef = useRef<Mesh>(null);
  const turretMeshRef = useRef<Mesh>(null);
  const barrelRef = useRef<Mesh>(null);

  useEffect(() => {
    let angle = 0;
    const unsubscribe = api.angle.subscribe(res => {
      angle = res;
    });
    return () => unsubscribe();
  }, [api]);

  useEffect(() => {
    api.linearDamping.set(linearDamping);
    api.angularDamping.set(angularDamping);
  }, [linearDamping, angularDamping, api]);

  useFrame(() => {
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
      lookTarget.current.set(props.pointerPosition.x, turretRef.current.position.y, props.pointerPosition.z);
      turretRef.current.lookAt(lookTarget.current);
    }
  });

  useEffect(() => {
    return () => {
      // Remove from scene
      if (ref.current?.parent) {
        ref.current.parent.remove(ref.current);
      }

      // Dispose geometry and material
      [baseRef.current, turretMeshRef.current, barrelRef.current].forEach(mesh => {
        if (!mesh) return;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => mat?.dispose());
        } else {
          mesh.material?.dispose();
        }
      });
    };
  }, []);

  return (
    <group ref={ref}>
      <group rotation-y={Math.PI / 2}>
        <RoundedBox
          castShadow
          position={[0, tankScaleY / 2, 0]}
          scale={[tankScaleX, tankScaleY, tankScaleZ]}
          bevelSegments={4}
          ref={baseRef}
        >
          <meshStandardMaterial color='orange' />
        </RoundedBox>

        <group ref={turretRef}>
          <RoundedBox
            scale={[tankScaleX / 1.9, tankScaleY / 1.5, tankScaleX / 1.9]}
            bevelSegments={4}
            position={[0, tankScaleY + tankScaleY / 1.5 / 2, 0]}
            ref={turretMeshRef}
          >
            <meshStandardMaterial color='blue' />
          </RoundedBox>

          <Box
            scale={[tankScaleX / 7, tankScaleY / 3.6, tankScaleZ / 1.5]}
            position={[0, tankScaleY + tankScaleY / 3.5, tankScaleZ / 2]}
            ref={barrelRef}
          >
            <meshStandardMaterial color='red' />
          </Box>
        </group>
      </group>
    </group>
  );
};
