import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Environment } from "./3d/Environment";

const App = () => {
  return (
    <>
      <Environment></Environment>
    </>
  );
};

export default App;
