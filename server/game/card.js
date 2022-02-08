export default class Card {
  /**
   *
   * @param {string} suit Card's suit "clubs", "diamonds" "hearts" "spades"
   * @param {*} value Card's # example: 10, 7, A, J, K, Q
   * @param {int} cost Card's weight relative to rest of the cards (J is 11, Q is 12, K is 13, A is 14)
   */
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
    if (value === "J") {
      this.cost = 11;
    } else if (value === "Q") {
      this.cost = 12;
    } else if (value === "K") {
      this.cost = 13;
    } else if (value === "A") {
      this.cost = 14;
    } else {
      this.cost = parseInt(value);
    }
    this.visible = false;
  }
}
