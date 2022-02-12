import { findPlayerByID } from "../models/PlayerModel.js";
import { Player } from "../index.js";
import BlackjackLobby from "../game/BlackjackLobby.js";
import BJPlayer from "../game/player.js";
import { humanId } from "human-id";

const players = new Map();

class PlayerConnection {
  constructor(io, socket, id, name) {
    this.socket = socket;
    this.name = name;
    this.id = id;
    this.io = io;
  }
}

const rooms = new Map();

export function registerLobbyHandlers(io, socket) {
  const login = async (id) => {
    const newPlayer = await findPlayerByID(Player, id);
    players.set(id, new PlayerConnection(io, socket, id, newPlayer.name));
    let playerList = [];
    players.forEach((player) => {
      playerList.push({ name: player.name, id: player.id });
    });
    io.emit("players", playerList);
  };

  const createRoom = async (id, callback) => {
    const host = await findPlayerByID(Player, id);
    const roomID = humanId();
    rooms.set(
      roomID,
      new BlackjackLobby(roomID, new BJPlayer(id, host.name, host.money))
    );
    console.log("room created");
    socket.join(roomID);
    callback(roomID);
  };

  socket.on("login", login);
  socket.on("createRoom", createRoom);
}
