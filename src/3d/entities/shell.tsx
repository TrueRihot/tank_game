import { RoundedBox } from "@react-three/drei";
import { ShellEntity } from "../../../types/shell";

export const Shell = (props: ShellEntity) => {
  return (
    <group position={[props.position[0], 0.1, props.position[1]]} rotation={[0, Math.PI, 0]}>
      <RoundedBox args={[0.1, 0.1, 0.2]} castShadow>
        <meshStandardMaterial color='red' />
      </RoundedBox>
    </group>
  );
};
