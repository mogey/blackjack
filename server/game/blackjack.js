import Deck from "./deck.js";
import Player from "../models/player.js";

export default class Blackjack {
  constructor() {
    //Instantiate the decks
    this.gameDeck = new Deck();
    this.playerHand = new Deck();
    this.dealerHand = new Deck();

    this.playerCredits = 1000;
    this.betAmount = 0;
    this.state = "bet"; //win, lose, tie, active, bet
    this.message = "";

    console.log("initialized");
  }

  initRound() {
    this.betAmount = 0;

    this.state = "bet";
    this.message = "";
    console.log("new game" + this.playerCredits);
  }

  deal() {
    this.gameDeck.generateDeck();
    this.gameDeck.shuffle();

    this.playerHand.reset();
    this.dealerHand.reset();

    this.playerHand.addCard(this.gameDeck.drawCard(true));
    this.playerHand.addCard(this.gameDeck.drawCard(true));
    if (this.playerHand.getDeckValue() === 21) {
      this.stand();
    }
    this.dealerHand.addCard(this.gameDeck.drawCard(true));
    this.dealerHand.addCard(this.gameDeck.drawCard(false));

    this.state = "active";
    this.message = "";
    this.checkHands();
    console.log("dealt cards " + this.playerCredits + " " + this.betAmount);
  }

  bet(betAmount) {
    if (this.state === "bet" && betAmount >= 0) {
      this.betAmount += betAmount;
      this.playerCredits -= betAmount;
      console.log(
        "Player bet: " +
          betAmount +
          ", remaining balance: " +
          this.playerCredits
      );
      this.deal();
    }
  }

  hit() {
    if (this.state === "active" || this.state === "ready") {
      this.state = "active";
      const card = this.gameDeck.drawCard(true);
      this.playerHand.addCard(card);
      console.log("hit:");
      console.log(card);
      if (this.playerHand.getDeckValue() > 21) {
        this.lose();
      }
      if (this.playerHand.getDeckValue() === 21) {
        this.stand();
      }
    }
  }

  stand() {
    if (this.state === "active" || this.state === "ready") {
      this.revealDealerCards();
      console.log("stood ");
      this.state = "stand";
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

  replenish() {
    if (this.playerCredits === 0) {
      this.playerCredits = 1000;

      console.log("replenished ");
    }
  }

  checkHands() {
    console.log("checking hands");
    // if the player has more than 21 they bust
    if (this.playerHand.getDeckValue() > 21) {
      this.lose();
      return true;
    }

    if (this.dealerHand.getDeckValue() > 21) {
      this.win();
      return true;
    }

    //if the player has 21 and the dealer doesn't the player won with blackjack
    if (
      this.playerHand.getDeckValue() === 21 &&
      this.dealerHand.getDeckValue() !== 21
    ) {
      this.win();
      return true;
    }

    //if the dealer has 21 and the player doesn't then the player loses
    if (
      this.dealerHand.getDeckValue() === 21 &&
      this.playerHand.getDeckValue() !== 21
    ) {
      this.lose();
      return true;
    }

    //if the dealer and the player both have blackjack then they tie
    if (
      this.dealerHand.getDeckValue() === 21 &&
      this.playerHand.getDeckValue() === 21
    ) {
      this.tie();
      return true;
    }
  }

  checkWinner() {
    console.log("checking winner");
    if (this.checkHands()) {
      return;
    }
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

  revealDealerCards() {
    this.dealerHand.cards.forEach((card) => {
      card.visible = true;
    });
  }

  win() {
    this.state = "win";
    this.playerCredits += this.betAmount * 2;
    console.log("win " + this.playerCredits);
    this.revealDealerCards();
  }

  lose() {
    console.log("lose");
    this.state = "lose";
    this.revealDealerCards();
  }

  tie() {
    console.log("tied");
    this.state = "tie";
    this.playerCredits += this.betAmount;
    this.revealDealerCards();
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
