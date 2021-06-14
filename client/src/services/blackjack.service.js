import axios from "axios";

export const getGame = async (user) => {
  try {
    const resp = await axios.get("/api/game", {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const getUser = async () => {
  try {
    const resp = await axios.get("/api/user", {
      headers: {
        id: window.localStorage.getItem("userID"),
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const newGame = async (user) => {
  try {
    const resp = await axios.post("/api/newGame", null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const hit = async (user) => {
  try {
    const resp = await axios.post("/api/hit", null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const stand = async (user) => {
  try {
    const resp = await axios.post("/api/stand", null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const deal = async (user) => {
  try {
    const resp = await axios.post("/api/deal", null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const bet = async (amount, user) => {
  try {
    const resp = await axios.post("/api/bet/" + amount, null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

export const replenish = async (user) => {
  try {
    const resp = await axios.post("/api/replenish", null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};
