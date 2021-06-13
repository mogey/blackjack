import Deck from "./deck.js";
import Player from "./player.js";

class Blackjack {
  constructor() {
    //Instantiate and destructure the game's deck
    this.gameDeck = new Deck();
    const gameDeck = this.gameDeck;
    //fill game deck with standard deck of cards and shuffle the order
    gameDeck.generateDeck();
    gameDeck.shuffle();

    this.playerHand = new Deck();
    this.dealerHand = new Deck();
    this.playerCredits = 1000;
    this.bet = 0;
    this.state = "active"; //win, lose, tie, active
  }

  initRound() {
    this.playerHand.addCard(this.gameDeck.drawCard());
    this.playerHand.addCard(this.gameDeck.drawCard());

    this.dealerHand.addCard(this.gameDeck.drawCard());
    this.dealerHand.addCard(this.gameDeck.drawCard());

    this.checkHands();
  }

  bet(bet) {
    this.bet = bet;
    this.playerCredits -= this.bet;
    console.log(
      "Player bet: " + this.bet + ", remaining balance: " + this.playerCredits
    );
  }

  hit() {
    this.playerHand.addCard(this.gameDeck.drawCard());
    this.checkHands();
  }

  stand() {
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
    this.playerCredits += this.bet * 2;
  }

  lose() {
    this.state = "lose";
  }

  tie() {
    this.state = "tie";
    this.playerCredits += this.bet;
  }
}
const game = new Blackjack();

game.initRound();
game.stand();

//console.log(JSON.stringify(game, null, 2));
console.log(game);
