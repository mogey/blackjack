import Deck from "./deck.js";
import Player from "./player.js";

export default class Blackjack {
  constructor() {
    //Instantiate the decks
    this.gameDeck = new Deck();
    this.playerHand = new Deck();
    this.dealerHand = new Deck();

    this.playerCredits = 1000;
    this.betAmount = 0;
    this.state = "init"; //win, lose, tie, active, init
  }

  initRound() {
    this.gameDeck.generateDeck();
    this.gameDeck.shuffle();

    this.playerHand.reset();
    this.betAmount = 0;
    this.dealerHand.reset();

    this.playerHand.addCard(this.gameDeck.drawCard());
    this.playerHand.addCard(this.gameDeck.drawCard());

    this.dealerHand.addCard(this.gameDeck.drawCard());
    this.dealerHand.addCard(this.gameDeck.drawCard());

    this.state = "active";
    this.checkHands();
  }

  bet(bet) {
    if (this.state === "active") {
      this.betAmount = bet;
      this.playerCredits -= this.betAmount;
      console.log(
        "Player bet: " +
          this.betAmount +
          ", remaining balance: " +
          this.playerCredits
      );
    }
  }

  hit() {
    if (this.state === "active") {
      this.playerHand.addCard(this.gameDeck.drawCard());
      this.checkHands();
    }
  }

  stand() {
    if (this.state === "active") {
      if (this.dealerHand.getDeckValue() >= 17) {
        this.checkWinner();
      } else if (this.dealerHand.getDeckValue() <= 16) {
        while (!(this.dealerHand.getDeckValue() >= 17)) {
          console.log("dealer drew: ");
          console.log(this.dealerHand.addCard(this.gameDeck.drawCard()));
        }
        this.checkWinner();
      }
    }
  }

  checkHands() {
    // if the player has more than 21 they bust
    if (this.playerHand.getDeckValue() > 21) {
      this.lose();
      return;
    }

    if (this.dealerHand.getDeckValue() > 21) {
      this.win();
      return;
    }

    //if the player has 21 and the dealer doesn't the player won with blackjack
    if (
      this.playerHand.getDeckValue() === 21 &&
      this.dealerHand.getDeckValue() !== 21
    ) {
      this.win();
      return;
    }

    //if the dealer has 21 and the player doesn't then the player loses
    if (
      this.dealerHand.getDeckValue() === 21 &&
      this.playerHand.getDeckValue() !== 21
    ) {
      this.lose();
      return;
    }

    //if the dealer and the player both have blackjack then they tie
    if (
      this.dealerHand.getDeckValue() === 21 &&
      this.playerHand.getDeckValue() === 21
    ) {
      this.tie();
      return;
    }
  }

  checkWinner() {
    this.checkHands();
    let playerDiff = 21 - this.playerHand.getDeckValue();
    let dealerDiff = 21 - this.dealerHand.getDeckValue();
    if (playerDiff < dealerDiff) {
      this.win();
      return;
    }
    if (playerDiff > dealerDiff) {
      this.lose();
      return;
    }
    if (playerDiff === dealerDiff) {
      this.tie();
      return;
    }
  }

  win() {
    this.state = "win";
    this.playerCredits += this.betAmount * 2;
  }

  lose() {
    this.state = "lose";
  }

  tie() {
    this.state = "tie";
    this.playerCredits += this.betAmount;
  }
}
/*
//Interactive test
const game = new Blackjack();

import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "move>",
});
//console.log(JSON.stringify(game, null, 2));
//console.log(game);

console.log(game.playerCredits);
rl.prompt();
rl.on("line", (line) => {
  if (line.includes("bet")) {
    const input = line.split(" ");
    game.bet(input[1]);
    console.log(game.playerCredits);
    console.log(game.betAmount);
    console.log(game.state);
  } else {
    switch (line.trim()) {
      case "new":
        game.initRound();
        console.log(game.dealerHand.cards[0]);
        console.log(game.playerHand);
        console.log(game.playerCredits);
        console.log(game.betAmount);
        console.log(game.state);
        break;
      case "hit":
        game.hit();
        console.log(game.dealerHand.cards[0]);
        console.log(game.playerHand);
        console.log(game.playerCredits);
        console.log(game.betAmount);
        console.log(game.state);
        break;
      case "stand":
        game.stand();
        console.log(game.dealerHand);
        console.log(game.playerHand);
        console.log(game.playerCredits);
        console.log(game.betAmount);
        console.log(game.state);
        break;
      case "close":
        process.exit(0);
      default:
        console.log(`Say what? I might have heard '${line.trim()}'`);
        break;
    }
  }
  rl.prompt();
});
*/