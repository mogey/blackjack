export default class Card {
  constructor(suit, value, cost) {
    this.suit = suit;
    this.value = value;
    this.cost = cost;
    this.visible = false;
  }
}
