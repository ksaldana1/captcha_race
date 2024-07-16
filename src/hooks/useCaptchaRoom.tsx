import usePartySocket from "partysocket/react";
import { useState } from "react";
import { GameState, Action } from "../../game/logic";

const PARTY_HOST = "https://test-pk.ksaldana1.partykit.dev";
// const PARTY_HOST = "http://localhost:1999";

export const useGameRoom = (username: string, roomId: string) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const socket = usePartySocket({
    host: PARTY_HOST,
    room: roomId,
    id: username,
    onMessage(event: MessageEvent<string>) {
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
