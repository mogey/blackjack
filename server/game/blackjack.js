import Deck from "./deck.js";
import Player from "./player.js";

class Blackjack {
  constructor() {
    this.deck = new Deck();
    console.log(this.deck);
    this.deck.shuffle();
    console.log(this.deck);

    let playerHand = [this.deck.cards.pop(), this.deck.cards.pop()];
    this.player = new Player(1000, false, playerHand);
    console.log(this.player);
    console.log(this.player.getHandValue());
    console.log(this.deck.cards.length);
  }
}
new Blackjack();
