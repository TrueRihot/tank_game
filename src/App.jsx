import React from "react";
import { Environment } from "./3d/Environment";
import { ControlsProvider } from "./3d/context/ControlsContext";
import { GameProvider } from "./3d/context/GameContext";
import GameUI from "./3d/components/GameUI";

const App = () => {
  return (
    <ControlsProvider>
      <GameProvider>
        <div className="relative w-full h-full bg-[#10141a]">
          {/* 3D Canvas fills the entire screen */}
          <Environment />
          {/* 2D UI overlay on top */}
          <GameUI />
        </div>
      </GameProvider>
    </ControlsProvider>
  );
};

export default App;
