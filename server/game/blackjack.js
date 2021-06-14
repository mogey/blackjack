import Deck from "./deck.js";

export default class Blackjack {
  /**
   *
   * @param {int} credits player's credits
   * @param {string} id UUID for player
   * @param {int} betAmount player's bet amount
   * @param {Deck} gameDeck game deck
   * @param {Deck} playerHand player's hand
   * @param {Deck} dealerHand dealer's hand
   * @param {string} state game state
   */
  constructor(credits, id, betAmount, gameDeck, playerHand, dealerHand, state) {
    //Instantiate the decks
    this.gameDeck = new Deck(gameDeck);
    this.playerHand = new Deck(playerHand);
    this.dealerHand = new Deck(dealerHand);
    this.id = id;
    this.playerCredits = credits;
    this.betAmount = betAmount;
    this.state = state; //win, lose, tie, active, bet
    this.message = "";

    console.log(
      "Game | ID| " +
        this.id +
        " | " +
        "instanced started game with " +
        this.playerCredits +
        " credits."
    );
  }

  /**
   * Resets bet amount to zero and sets game state to bet
   */
  initRound() {
    this.betAmount = 0;
    this.state = "bet";
    this.message = "";
    console.log(
      "Game | ID| " +
        this.id +
        " | " +
        "started new round with " +
        this.playerCredits +
        " credits."
    );
  }

  /**
   * Resets game and deals cards to player and dealer, sets state to active, and then checks hands
   */
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
    console.log("Game | ID| " + this.id + " | " + "dealt cards.");
  }

  /**
   *
   * @param {int} betAmount Amount to bet
   * Places bet when game state is "bet"
   */
  bet(betAmount) {
    if (this.state === "bet" && betAmount >= 0) {
      this.betAmount += betAmount;
      this.playerCredits -= betAmount;
      console.log(
        "Game | ID| " +
          this.id +
          " | Bet " +
          this.betAmount +
          " credits, remaining: " +
          this.playerCredits +
          " credits."
      );
      this.deal();
    }
  }

  /**
   *Draws card for player and checks to see if they won
   */
  hit() {
    if (this.state === "active" || this.state === "ready") {
      this.state = "active";
      const card = this.gameDeck.drawCard(true);
      this.playerHand.addCard(card);
      console.log("Game | ID| " + this.id + " | Hit");
      if (this.playerHand.getDeckValue() > 21) {
        this.lose();
      }
      if (this.playerHand.getDeckValue() === 21) {
        this.stand();
      }
    }
  }

  /**
   * Dealer reveals their cards and draws
   */
  stand() {
    if (this.state === "active" || this.state === "ready") {
      this.revealDealerCards();
      console.log("Game | ID| " + this.id + " | Stood");
      this.state = "stand";
      if (this.dealerHand.getDeckValue() >= 17) {
        this.checkWinner();
      } else if (this.dealerHand.getDeckValue() <= 16) {
        while (!(this.dealerHand.getDeckValue() >= 17)) {
          console.log("Game | ID| " + this.id + " | Dealer draw");
          this.dealerHand.addCard(this.gameDeck.drawCard());
        }
        this.checkWinner();
      }
    }
  }

  /**
   * Sets player's credits to 1000 if it is 0
   */
  replenish() {
    if (this.playerCredits === 0) {
      this.playerCredits = 1000;

      console.log("Game | ID| " + this.id + " | Replenished");
    }
  }

  /**
   *
   * @returns {boolean} true if a winner is found
   */
  checkHands() {
    console.log("Game | ID| " + this.id + " | Checking hands");
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

  /**
   *
   * @returns null, checks to see who is closest to 21
   */
  checkWinner() {
    console.log("Game | ID| " + this.id + " | Checking for winner");
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

  /**
   * Sets all cards in dealerHand.cards to visible
   */
  revealDealerCards() {
    this.dealerHand.cards.forEach((card) => {
      card.visible = true;
    });
  }

  /**
   * Called when player wins, adds betAmount * 2 credits to playerCredits
   */
  win() {
    this.state = "win";
    this.playerCredits += this.betAmount * 2;
    console.log(
      "Game | ID| " +
        this.id +
        " | Won!!! They have " +
        this.playerCredits +
        " credits"
    );
    this.revealDealerCards();
  }

  /**
   * Called when player loses
   */
  lose() {
    this.state = "lose";
    console.log("Game | ID| " + this.id + " | Lost.");
    this.revealDealerCards();
  }

  /**
   * Called when player ties, adds betAmmount to playerCredits
   */
  tie() {
    this.state = "tie";
    this.playerCredits += this.betAmount;
    console.log(
      "Game | ID| " +
        this.id +
        " | Tied, they have " +
        this.playerCredits +
        " credits"
    );
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
