import Card from "./card.js";

const suits = ["clubs", "diamonds", "hearts", "spades"];
const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export default class Deck {
  constructor() {
    this.cards = this.generateDeck();
  }

  generateDeck() {
    let cards = [];
    suits.forEach((suit, i) => {
      values.forEach((value, j) => {
        cards.push(new Card(suit, value));
      });
    });
    return cards;
  }

  getRandomInt(max) {
    //Gets a random number from 0 to max-1
    return Math.floor(Math.random() * max);
  }

  shuffle() {
    for (let i = this.cards.length - 1; i != 0; i--) {
      let r = this.getRandomInt(i);
      let temp = this.cards[r];
      this.cards[r] = this.cards[i];
      this.cards[i] = temp;
    }
  }
}
