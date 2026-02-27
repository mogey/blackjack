import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "",
});

export const register = async (username, pin) => {
  try {
    const resp = await axiosInstance.post("/api/register", { username, pin });
    return resp;
  } catch (err) {
    return err.response || { status: 500, data: { error: "Network error" } };
  }
};

export const login = async (username, pin) => {
  try {
    const resp = await axiosInstance.post("/api/login", { username, pin });
    return resp;
  } catch (err) {
    return err.response || { status: 500, data: { error: "Network error" } };
  }
};

export const getBalance = async (userId) => {
  try {
    const resp = await axiosInstance.get("/api/balance", {
      headers: { Authorization: userId },
    });
    return resp;
  } catch (err) {
    return err.response || { status: 500, data: { error: "Network error" } };
  }
};
