import express from "express";
const PlayerRouter = express.Router();
import { Player } from "../index.js";
import { loginPlayer, registerPlayer } from "../Services/PlayerService.js";

PlayerRouter.post("/login", async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      ...req.body,
      status: "error",
      pin: "",
      message: "Username is required",
    });
  }
  if (!req.body.pin) {
    return res.status(400).json({
      ...req.body,
      status: "error",
      pin: "",
      message: "Pin is required",
    });
  }
  if (req.body.pin.length > 4) {
    return res.status(400).json({
      ...req.body,
      status: "error",
      pin: "",
      message: "Pin is too long",
    });
  }

  const response = await registerPlayer(Player, req.body.name, req.body.pin);
  if (!response.token) {
    return res.status(401).json({ ...req.body, pin: "", ...response });
  } else {
    // res.cookie("id", response.token);
    res.status(200).json({
      ...req.body,
      pin: "",
      ...response,
    });
  }
});
/*
PlayerRouter.post("/register", async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      ...req.body,
      status: "error",
      pin: "",
      message: "Username is required",
    });
  }
  if (!req.body.pin) {
    return res.status(400).json({
      ...req.body,
      status: "error",
      pin: "",
      message: "Pin is required",
    });
  }
  if (req.body.pin.length > 4) {
    return res.status(400).json({
      ...req.body,
      status: "error",
      pin: "",
      message: "Pin is too long",
    });
  }

  const response = await registerPlayer(Player, req.body.name, req.body.pin);
  if (!response.token) {
    return res.status(401).json({ ...req.body, pin: "", ...response });
  } else {
    res.cookie("id", response.token);
    res.status(200).json({
      ...req.body,
      pin: "",
      ...response,
    });
  }
});
*/
export { PlayerRouter };
