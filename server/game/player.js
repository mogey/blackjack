export default class Player {
  constructor(credits, isDealer, hand) {
    this.isDealer = isDealer;
    this.credits = credits;
    this.hand = hand;
  }

  getHandValue() {
    let value = 0;
    this.hand.forEach((card) => {
      if (card.value === "J" || card.value === "K" || card.value === "Q") {
        value += 10;
      } else if (card.value !== "A") {
        value += parseInt(card.value);
      } else if (card.value === "A") {
      }
    });
    return value;
  }
}
