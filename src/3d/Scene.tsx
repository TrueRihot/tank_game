import React from "react";
import { Grid, KeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Debug, Physics } from "@react-three/p2";
import { Vector3 } from "three";
import { GameProvider } from "./context/GameContext";
import { PointerProvider } from "./context/PointerContext";
import { Game } from "./Game";

const LOCAL_STORAGE_KEY = "tank_game_controls";

const getStoredControls = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading stored controls", e);
  }
  return {
    forward: "w",
    backward: "s",
    left: "a",
    right: "d",
    shoot: "Space",
  };
};

export const Scene = () => {
  const { pointx, pointy, pointz } = useControls({
    pointx: 1,
    pointy: 3,
    pointz: 1,
  });

  const stored = React.useMemo(() => getStoredControls(), []);

  const [{ forward, backward, left, right, shoot }] = useControls("Player Controls", () => ({
    forward: { value: stored.forward, label: "Forward" },
    backward: { value: stored.backward, label: "Backward" },
    left: { value: stored.left, label: "Left" },
    right: { value: stored.right, label: "Right" },
    shoot: { value: stored.shoot, label: "Shoot" },
  }));

  React.useEffect(() => {
    const bindings = { forward, backward, left, right, shoot };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bindings));
  }, [forward, backward, left, right, shoot]);

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
      { name: "forward", keys: parseKeys(forward) },
      { name: "backward", keys: parseKeys(backward) },
      { name: "left", keys: parseKeys(left) },
      { name: "right", keys: parseKeys(right) },
      { name: "shoot", keys: parseKeys(shoot), up: true },
    ];
  }, [forward, backward, left, right, shoot]);

  return (
    <>
      <PointerProvider>
        <GameProvider>
          <Grid cellSize={1} cellThickness={1} infiniteGrid={true} sectionColor={"grey"} />
          <directionalLight castShadow position={[pointx, pointy, pointz]}></directionalLight>
          <ambientLight />

          <Physics normalIndex={1} gravity={[0, 0]}>
            <KeyboardControls key={JSON.stringify(dynamicMap)} map={dynamicMap}>
              <Debug color='red' scale={1.1} linewidth={1} normalIndex={1} />
              <Game />
            </KeyboardControls>
          </Physics>
        </GameProvider>
      </PointerProvider>
    </>
  );
};
