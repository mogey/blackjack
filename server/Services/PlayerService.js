import { createPlayer, findPlayerByLogin } from "../models/PlayerModel.js";

async function registerPlayer(model, name, pin) {
  const exists = await findPlayerByLogin(model, name, pin);
  if (exists) {
    return { status: "success", token: exists.id };
  }
  const newPlayer = await createPlayer(model, name, pin);
  if (!newPlayer) {
    return { status: "error", message: "Service failiure" };
  }
  return { status: "success", token: newPlayer.id };
}

async function loginPlayer(model, name, pin) {
  const player = await findPlayerByLogin(model, name, pin);
  if (player) {
    return { status: "success", token: player.id };
  } else {
    return { status: "error", message: "Username or pin do not match" };
  }
}
export { registerPlayer, loginPlayer };
