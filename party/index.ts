import type * as Party from "partykit/server";

import {
  Action,
  GameState,
  ServerAction,
  gameUpdater,
  initialGame,
} from "../game/logic";

export const CONNECTION_PARTY_NAME = "rooms";
export const CONNECTIONS_ROOM_ID = "active-connections";
export const PARTY_HOST = "http://localhost:1999";

const CAPTCHA_GENERATOR_HOST = "https://captcha-server.fly.dev";

export default class Server implements Party.Server {
  // @ts-ignore
  private gameState: GameState;
  // current Captcha secret as plain text value
  private secret: string = "";
  // base64 string to send to user
  // @ts-ignore
  private base64Captcha: string = "";

  constructor(readonly room: Party.Room) {
    this.create();
  }

  async create() {
    const response = await fetch(CAPTCHA_GENERATOR_HOST);
    const { base64, value } = (await response.json()) as {
      value: string;
      base64: string;
    };
    this.secret = value;
    this.base64Captcha = base64;

    this.gameState = initialGame(base64);
    this.room.broadcast(JSON.stringify(this.gameState));
  }

  async onConnect(connection: Party.Connection, _ctx: Party.ConnectionContext) {
    this.gameState = gameUpdater(
      {
        type: "USER_ENTERED",
        user: { id: connection.id },
        secret: this.secret,
      },
      this.gameState
    );
    this.room.broadcast(JSON.stringify(this.gameState));
  }

  async onClose(connection: Party.Connection) {
    this.gameState = gameUpdater(
      {
        type: "USER_EXIT",
        user: { id: connection.id },
        secret: this.secret,
      },
      this.gameState
    );
    this.room.broadcast(JSON.stringify(this.gameState));
  }

  onMessage(message: string, sender: Party.Connection) {
    const action: ServerAction = {
      ...(JSON.parse(message) as Action),
      user: { id: sender.id },
      secret: this.secret,
    };
    console.log(
      `Received action ${action.type} from user ${sender.id}: ${JSON.stringify(
        action
      )}`
    );
    this.gameState = gameUpdater(action, this.gameState);
    this.room.broadcast(JSON.stringify(this.gameState));
  }
}

Server satisfies Party.Worker;
