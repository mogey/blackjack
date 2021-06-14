import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || null,
});

/**
 * Gets game state from backend
 * @param {string} user userID
 * @returns Axios response containing game state

 */
export const getGame = async (user) => {
  try {
    const resp = await axiosInstance.get("/api/game", {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

/**
 * Validates userID from localStorage
 * @returns Axios reponse
 */
export const getUser = async () => {
  try {
    const resp = await axiosInstance.get("/api/user", {
      headers: {
        id: window.localStorage.getItem("userID"),
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

/**
 * Sends newGame input to backend, initializing a new round
 * @param {string} user userID
 * @returns Axios response containing game state

 */
export const newGame = async (user) => {
  try {
    const resp = await axiosInstance.post("/api/newGame", null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

/**
 * Sends hit input to draw an additional card for player
 * @param {user} user userID
 * @returns Axios response containing game state
 containing game state
 */
export const hit = async (user) => {
  try {
    const resp = await axiosInstance.post("/api/hit", null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

/**
 * Sends stand input to game session
 * @param {user} user userID
 * @returns Axios response containing game state
 containing game state
 */
export const stand = async (user) => {
  try {
    const resp = await axiosInstance.post("/api/stand", null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

/**
 * Sends deal input to deal cards to player
 * @param {user} user userID
 * @returns Axios response containing game state
 containing game state

 */
export const deal = async (user) => {
  try {
    const resp = await axiosInstance.post("/api/deal", null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

/**
 * Sends bet input to bet player's credits
 * @param {int} amount amount to bet
 * @param {string} user userID
 * @returns Axios reponse
 */
export const bet = async (amount, user) => {
  try {
    const resp = await axiosInstance.post("/api/bet/" + amount, null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};

/**
 * Sends input to replenish user's credits
 * @param {user} user userID
 * @returns Axios response containing game state
 containing game state

 */
export const replenish = async (user) => {
  try {
    const resp = await axiosInstance.post("/api/replenish", null, {
      headers: {
        id: user,
      },
    });
    return resp;
  } catch (err) {
    return err;
  }
};
