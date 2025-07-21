import { ShellEntity } from "../../../types/shell";

export const Shell = (props: ShellEntity) => {
  return (
    <mesh>
      <cylinderBufferGeometry args={[0.1, 0.1, 1, 16]} />
      <meshStandardMaterial color='yellow' />
    </mesh>
  );
};
