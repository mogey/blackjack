import axios from "axios";
import { id } from "./userHeader";

export const getGame = async () => {
  try {
    const resp = await axios.get("/api/game", {
      headers: {
        id: id,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const newGame = async () => {
  try {
    const resp = await axios.post("/api/newGame", {
      headers: {
        id: id,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const hit = async () => {
  try {
    const resp = await axios.post("/api/hit", {
      headers: {
        id: id,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const stand = async () => {
  try {
    const resp = await axios.post("/api/stand", {
      headers: {
        id: id,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const deal = async () => {
  try {
    const resp = await axios.post("/api/deal", {
      headers: {
        id: id,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const bet = async (amount) => {
  try {
    const resp = await axios.post("/api/bet/" + amount, {
      headers: {
        id: id,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const replenish = async (amount) => {
  try {
    const resp = await axios.post("/api/replenish", {
      headers: {
        id: id,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const getState = async () => {
  try {
    const resp = await axios.get("/api/state", {
      headers: {
        id: id,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};
