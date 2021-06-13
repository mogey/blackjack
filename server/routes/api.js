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

router.post("/replenish", (req, res) => {
  if (game.playerCredits === 0) {
    game.replenish();
  } else {
    game.message = "You have enough money";
  }

  res.json(game);
});

router.post("/bet/:amount", (req, res) => {
  const betAmount = parseInt(req.params.amount);
  if (betAmount) {
    if (game.playerCredits - betAmount >= 0) {
      game.bet(betAmount);
    } else {
      game.message = "Not enough money";
    }
    res.json(game);
  } else {
    game.message = "Not amount specified";
    res.json(game);
  }
});
export default router;
