import express from "express";
import Blackjack from "../game/blackjack.js";

const router = express.Router();

const games = new Map();

const game = new Blackjack(1000, 1);

router.get("/game", (req, res) => {
  res.json(game);
});

router.post("/init", (req, res) => {
  res.json(game);
});

router.post("/newGame", (req, res) => {
  game.initRound();
  res.json(game);
});

router.post("/deal", (req, res) => {
  game.deal();
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

router.post("/replenish", (req, res) => {
  if (game.playerCredits === 0) {
    game.replenish();
  }

  res.json(game);
});

router.post("/bet/:amount", (req, res) => {
  const betAmount = parseInt(req.params.amount) || undefined;
  if (betAmount) {
    if (game.playerCredits - betAmount >= 0) {
      game.bet(betAmount);
    }
    res.json(game);
  } else {
    res.json(game);
  }
});
export default router;
