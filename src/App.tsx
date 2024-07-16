import { useState } from "react";
import React from "react";
import "./App.css";

import { useGameRoom } from "./hooks/useCaptchaRoom";

function App() {
  const { gameState, dispatch } = useGameRoom("kevin", "test");
  const [guess, setGuess] = useState("");
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <img src={gameState?.captcha} />
      <input
        className="border border-black my-2"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
      <button
        className="border border-green-500 bg-green-500 text-white rounded w-28"
        onClick={() =>
          dispatch({
            type: "GUESS",
            payload: {
              captcha: {
                value: guess,
              },
            },
          })
        }
      >
        Guess
      </button>
    </div>
  );
}

export default App;
