import usePartySocket from "partysocket/react";
import { useState } from "react";
import { GameState, Action } from "../../game/logic";
import { PARTY_HOST } from "../../party";

export const useGameRoom = (username: string, roomId: string) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  console.log(PARTY_HOST);

  const socket = usePartySocket({
    host: PARTY_HOST,
    room: roomId,
    id: username,
    onMessage(event: MessageEvent<string>) {
      console.log(JSON.parse(event.data));
      setGameState(JSON.parse(event.data));
    },
  });

  const dispatch = (action: Action) => {
    socket.send(JSON.stringify(action));
  };

  return {
    gameState,
    dispatch,
  };
};
