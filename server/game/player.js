import Deck from "./deck.js";

export default class Player {
  constructor() {
    this.hand = new Deck();
    this.money = 0;
    this.bet = 0;
  }
}
