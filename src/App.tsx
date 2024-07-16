import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";

import { getCaptcha } from "./client";
import { useGameRoom } from "./hooks/useCaptchaRoom";

function App() {
  const { gameState } = useGameRoom("kevin", "test");
  console.log(gameState);
  return (
    <>
      <img src={gameState?.captcha} />
    </>
  );
}

export default App;
