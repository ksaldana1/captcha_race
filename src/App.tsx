import { useState } from "react";
import "./App.css";

import { useGameRoom } from "./hooks/useCaptchaRoom";

function App() {
  const url = new URL(window.location.href);
  const [username, room] = [
    url.searchParams.get("username") ?? "",
    url.searchParams.get("room") ?? "",
  ];

  if (!username && !room) {
    return null;
  }

  const { gameState, dispatch } = useGameRoom(username, room);
  const [guess, setGuess] = useState("");

  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setGuess("");
          dispatch({
            type: "GUESS",
            payload: {
              captcha: {
                value: guess,
              },
            },
          });
        }}
      >
        <img src={gameState?.captcha} />
        <div className="flex flex-col items-center">
          <input
            className="border border-black my-2 w-96"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button
            type="submit"
            className="border border-green-500 bg-green-500 text-white rounded w-28"
          >
            Guess
          </button>
        </div>
      </form>
      {gameState?.winner && <h2>{gameState.winner} has won</h2>}
      <ol>
        {Object.entries(gameState?.scoreboard ?? {}).map(([username, wins]) => {
          return (
            <li>
              {username}: {wins}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default App;
