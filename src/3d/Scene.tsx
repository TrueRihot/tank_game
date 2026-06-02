import React from "react";
import { Grid, KeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Debug, Physics } from "@react-three/p2";
import { PointerProvider } from "./context/PointerContext";
import { useControls_ } from "./context/ControlsContext";
import { Game } from "./Game";

export const Scene = () => {
  const { pointx, pointy, pointz } = useControls({
    pointx: 1,
    pointy: 3,
    pointz: 1,
  });

  const { bindings } = useControls_();

  const dynamicMap = React.useMemo(() => {
    const parseKeys = (keyStr: string): string[] => {
      if (keyStr === " " || keyStr.toLowerCase() === "space") {
        return ["Space"];
      }
      const trimmed = keyStr.trim();
      if (!trimmed) return [];
      if (trimmed.length === 1 && /[a-zA-Z]/.test(trimmed)) {
        return [trimmed.toLowerCase(), trimmed.toUpperCase()];
      }
      return [trimmed];
    };

    return [
      { name: "forward", keys: parseKeys(bindings.forward) },
      { name: "backward", keys: parseKeys(bindings.backward) },
      { name: "left", keys: parseKeys(bindings.left) },
      { name: "right", keys: parseKeys(bindings.right) },
      { name: "shoot", keys: parseKeys(bindings.shoot), up: true },
    ];
  }, [bindings]);

  return (
    <>
      <PointerProvider>
        <Grid cellSize={1} cellThickness={1} infiniteGrid={true} sectionColor={"grey"} />
        <directionalLight castShadow position={[pointx, pointy, pointz]}></directionalLight>
        <ambientLight />

        <Physics normalIndex={1} gravity={[0, 0]}>
          <KeyboardControls key={JSON.stringify(dynamicMap)} map={dynamicMap}>
            <Debug color='red' scale={1.1} linewidth={1} normalIndex={1} />
            <Game />
          </KeyboardControls>
        </Physics>
      </PointerProvider>
    </>
  );
};
