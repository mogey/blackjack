import axios from "axios";

export const getGame = async () => {
  const resp = await axios.get("/api/game");
  return resp;
};

export const newGame = async () => {
  const resp = await axios.post("/api/newGame");
  return resp;
};

export const hit = async () => {
  const resp = await axios.post("/api/hit");
  return resp;
};

export const stand = async () => {
  const resp = await axios.post("/api/stand");
  return resp;
};

export const bet = async (amount) => {
  const resp = await axios.post("/api/bet/" + amount);
  return resp;
};

export const replenish = async (amount) => {
  const resp = await axios.post("/api/replenish");
  return resp;
};

export const getState = async () => {
  const resp = await axios.get("/api/state");
  return resp;
};
