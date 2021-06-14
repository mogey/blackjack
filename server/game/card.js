export default class Card {
  /**
   *
   * @param {string} suit Card's suit example: "spades", "hearts"
   * @param {*} value Card's # example: 10, 7, A, J, K, Q
   * @param {int} cost Card's weight relative to rest of the cards (Ace is 11, rest are their normal values)
   */
  constructor(suit, value, cost) {
    this.suit = suit;
    this.value = value;
    this.cost = cost;
    this.visible = false;
  }
}
