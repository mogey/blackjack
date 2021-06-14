import express from "express";
import Blackjack from "../game/blackjack.js";
import { Player } from "../index.js";

const router = express.Router();

const games = new Map();

router.get("/user", async (req, res) => {
  const id = req.headers.id;
  //Search for the ID in the database
  const searchedPlayer = await Player.findOne({ where: { id: id } });
  //check to see if we found anything
  if (searchedPlayer) {
    //check to see if its in our session map, if it is then return it
    if (games.has(searchedPlayer.id)) {
      res.json(games.get(searchedPlayer.id));
      return;
    } else {
      //if its not, make a new game and insert it
      const newGame = new Blackjack(searchedPlayer.money, searchedPlayer.id);
      games.set(searchedPlayer.id, newGame);
      res.json(games.get(searchedPlayer.id));
      return;
    }
  }
  if (!searchedPlayer) {
    const newPlayer = Player.build({ money: 1000 });
    const newGame = new Blackjack(newPlayer.money, newPlayer.id);
    games.set(newPlayer.id, newGame);
    res.json(games.get(newPlayer.id));
    await newPlayer.save();
    return;
  }
});

router.get("/game", async (req, res) => {
  const id = req.headers.id;

  if (games.has(id)) {
    res.json(games.get(id));
    //save the game
    const searchedPlayer = await Player.findOne({ where: { id: id } });
    if (searchedPlayer) {
      searchedPlayer.money = games.get(searchedPlayer.id).playerCredits;
      searchedPlayer.save();
    }
    return;
  } else {
    const searchedPlayer = await Player.findOne({ where: { id: id } });
    if (searchedPlayer instanceof Player && searchedPlayer) {
      const newGame = new Blackjack(searchedPlayer.money, searchedPlayer.id);
      games.set(searchedPlayer.id, newGame);
      res.json(games.get(searchedPlayer.id));
      return;
    }
  }
  res.json(games.get(id));
});

router.post("/newGame", async (req, res) => {
  const id = req.headers.id;
  const game = games.get(id);
  game.initRound();
  res.json(game);
});

router.post("/deal", (req, res) => {
  const id = req.headers.id;
  const game = games.get(id);
  game.deal();
  res.json(game);
});

router.post("/hit", (req, res) => {
  const id = req.headers.id;
  const game = games.get(id);
  game.hit();
  res.json(game);
});

router.post("/stand", (req, res) => {
  const id = req.headers.id;
  const game = games.get(id);
  game.stand();
  res.json(game);
});

router.post("/replenish", (req, res) => {
  const id = req.headers.id;
  const game = games.get(id);
  if (game.playerCredits === 0) {
    game.replenish();
  }

  res.json(game);
});

router.post("/bet/:amount", (req, res) => {
  const id = req.headers.id;
  const game = games.get(id);
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
