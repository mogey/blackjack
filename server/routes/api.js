import express from "express";
import Blackjack from "../game/blackjack.js";

const router = express.Router();

const game = new Blackjack();

router.get("/state", (req, res) => {
  res.json(game.state);
});

router.get("/game", (req, res) => {
  res.json(game);
});

router.get("/playerHand", (req, res, next) => {
  res.json(game.playerHand);
});

router.post("/newGame", (req, res) => {
  game.initRound();
  res.json(game);
});

router.post("/hit", (req, res) => {
  game.hit();
  res.json(game);
});

router.post("/stand", (req, res) => {
  game.stand();
  res.json(game);
});

router.post("/bet/:amount", (req, res) => {
  if (req.params.amount) {
    game.bet(parseInt(req.params.amount));
    res.json(game);
  } else {
    res.json({ message: "No amount specified." });
  }
});
export default router;
