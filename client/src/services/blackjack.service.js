import axios from "axios";

export const getGame = async () => {
  try {
    const resp = await axios.get("/api/game");
    return resp;
  } catch (err) {
    return err;
  }
};

export const newGame = async () => {
  try {
    const resp = await axios.post("/api/newGame");
    return resp;
  } catch (err) {
    return err;
  }
};

export const hit = async () => {
  try {
    const resp = await axios.post("/api/hit");
    return resp;
  } catch (err) {
    return err;
  }
};

export const stand = async () => {
  try {
    const resp = await axios.post("/api/stand");
    return resp;
  } catch (err) {
    return err;
  }
};

export const deal = async () => {
  try {
    const resp = await axios.post("/api/deal");
    return resp;
  } catch (err) {
    return err;
  }
};

export const bet = async (amount) => {
  try {
    const resp = await axios.post("/api/bet/" + amount);
    return resp;
  } catch (err) {
    return err;
  }
};

export const replenish = async (amount) => {
  try {
    const resp = await axios.post("/api/replenish");
    return resp;
  } catch (err) {
    return err;
  }
};

export const getState = async () => {
  try {
    const resp = await axios.get("/api/state");
    return resp;
  } catch (err) {
    return err;
  }
};
